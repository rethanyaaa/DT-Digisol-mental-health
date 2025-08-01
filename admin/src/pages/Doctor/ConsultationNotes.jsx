import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Search,
  Filter,
  Calendar,
  User,
  Eye,
  Edit,
  Trash2,
  Plus,
  ArrowLeft,
} from "lucide-react";
import { DoctorContext } from "../../context/DoctorContext";
import { toast } from "react-toastify";

const ConsultationNotes = () => {
  const navigate = useNavigate();
  const { getConsultationNotesByAppointment, updateConsultationNotes, dToken } =
    useContext(DoctorContext);

  const [consultationNotes, setConsultationNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Get doctor ID from token
  const getDoctorId = () => {
    try {
      const decodedToken = JSON.parse(atob(dToken.split(".")[1]));
      return decodedToken.id || decodedToken.doctorId || decodedToken._id;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchConsultationNotes();
  }, [currentPage, filterStatus]);

  const fetchConsultationNotes = async () => {
    setIsLoading(true);
    try {
      const doctorId = getDoctorId();
      if (!doctorId) {
        toast.error("Unable to identify doctor. Please login again.");
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/consultation-notes/doctor/${doctorId}?page=${currentPage}&limit=10&status=${filterStatus}`,
        {
          headers: {
            dToken: dToken,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setConsultationNotes(data.data);
        setTotalPages(data.pagination.totalPages);
      } else {
        toast.error(data.message || "Failed to fetch consultation notes");
      }
    } catch (error) {
      console.error("Error fetching consultation notes:", error);
      toast.error("Failed to fetch consultation notes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    fetchConsultationNotes();
  };

  const handleViewNotes = (appointmentId) => {
    navigate(`/consultation-notes/${appointmentId}`);
  };

  const handleEditNotes = (notesId) => {
    navigate(`/consultation-notes/${notesId}/edit`);
  };

  const handleDeleteNotes = async (notesId) => {
    if (
      window.confirm("Are you sure you want to delete this consultation note?")
    ) {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/consultation-notes/${notesId}`,
          {
            method: "DELETE",
            headers: {
              dToken: dToken,
            },
          }
        );

        const data = await response.json();

        if (data.success) {
          toast.success("Consultation notes deleted successfully");
          fetchConsultationNotes();
        } else {
          toast.error(data.message || "Failed to delete consultation notes");
        }
      } catch (error) {
        console.error("Error deleting consultation notes:", error);
        toast.error("Failed to delete consultation notes");
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredNotes = consultationNotes.filter((note) => {
    const matchesSearch =
      note.patientId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.provisionalDiagnosis
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      note.chiefComplaints?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" || note.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/doctor-dashboard")}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Consultation Notes
                </h1>
                <p className="text-gray-600">
                  Manage and view your consultation records
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                Total: {consultationNotes.length} notes
              </span>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by patient name, diagnosis, or complaints..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </form>

            <div className="flex items-center space-x-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>

        {/* Consultation Notes List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">
                Loading consultation notes...
              </p>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No consultation notes found
              </h3>
              <p className="text-gray-600">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "You haven't created any consultation notes yet"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Chief Complaints
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Diagnosis
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredNotes.map((note) => (
                    <tr key={note._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {note.patientId?.name || "Unknown Patient"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {note.patientId?.age
                                ? `${note.patientId.age} years`
                                : "Age not specified"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(note.consultationDate)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {note.appointmentId?.slotTime || ""}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {note.chiefComplaints}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {note.provisionalDiagnosis}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            note.status
                          )}`}
                        >
                          {note.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewNotes(note.appointmentId)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="View Notes"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditNotes(note._id)}
                            className="text-green-600 hover:text-green-900 p-1"
                            title="Edit Notes"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteNotes(note._id)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Delete Notes"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultationNotes;
