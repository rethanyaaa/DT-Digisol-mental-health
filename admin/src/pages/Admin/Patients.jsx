import { AdminContext } from "@/context/AdminContext";
import {
  Search,
  Filter,
  Mail,
  Calendar,
  Phone,
  MapPin,
  User,
  Loader2,
} from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Patients = () => {
  const { aToken, getAllPatients, patients } = useContext(AdminContext);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [filteredPatients, setFilteredPatients] = useState([]);

  useEffect(() => {
    if (aToken) {
      const minLoadingTime = new Promise((resolve) => setTimeout(resolve, 100));
      const patientsFetch = getAllPatients();

      Promise.all([minLoadingTime, patientsFetch]).then(() =>
        setIsLoading(false)
      );
    }
  }, [aToken, getAllPatients]);

  useEffect(() => {
    if (patients) {
      const filtered = patients.filter(
        (patient) =>
          patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  }, [patients, searchTerm]);

  if (isLoading) {
    return (
      <div className="w-full h-[calc(100vh-80px)] flex items-center justify-center">
        <Loader2 className="size-14 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="m-2 w-full sm:w-[80vw] flex flex-col items-center sm:items-start justify-center pb-2 gap-4 sm:p-4 bg-gray-50 rounded">
      {/* Profile Image Popup view */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/60 w-screen flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Enlarged view"
            draggable="false"
            className="size-[300px] sm:size-[470px] object-cover rounded-full border bg-gray-700 select-none motion-preset-expand motion-duration-300"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <div className="w-full">
        <h1 className="text-2xl mt-3 sm:mt-0 sm:text-3xl font-semibold px-1 tracking-wide text-primary select-none">
          All Patients
        </h1>
        <p className="text-gray-600 mt-2 px-1">
          Manage and view detailed information about all registered patients
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="w-full bg-white border rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
            <input
              type="text"
              placeholder="Search patients by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Filter className="size-4" />
            <span>{filteredPatients.length} patients found</span>
          </div>
        </div>
      </div>

      {/* Patients List */}
      <div className="w-full">
        {filteredPatients.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredPatients.map((patient) => (
              <div
                key={patient._id}
                className="bg-white border rounded-xl p-6 hover:shadow-lg transition-all duration-300"
              >
                {/* Patient Header */}
                <div className="flex items-center gap-4 mb-4">
                  <img
                    className="size-16 aspect-square object-cover rounded-full bg-gray-700 cursor-pointer hover:opacity-80 select-none"
                    draggable="false"
                    src={patient.image}
                    alt={`${patient.name} profile`}
                    onClick={() => setSelectedImage(patient.image)}
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {patient.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Patient ID: {patient._id.slice(-8)}
                    </p>
                  </div>
                </div>

                {/* Patient Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="size-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <p className="text-sm text-gray-600">{patient.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="size-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Joined Date
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(patient.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <User className="size-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Account Status
                      </p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                  </div>

                  {/* Additional patient information can be added here */}
                  <div className="flex items-center gap-3">
                    <MapPin className="size-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Location
                      </p>
                      <p className="text-sm text-gray-600">Not specified</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="size-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Phone</p>
                      <p className="text-sm text-gray-600">Not provided</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <Link
                      to={`/patient/${patient._id}`}
                      className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium text-center"
                    >
                      View Profile
                    </Link>
                    <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border rounded-xl p-8 text-center">
            <div className="size-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="size-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? "No patients found" : "No patients registered"}
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? "Try adjusting your search terms or clear the search to see all patients."
                : "Patients will appear here once they register on the platform."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Patients;
