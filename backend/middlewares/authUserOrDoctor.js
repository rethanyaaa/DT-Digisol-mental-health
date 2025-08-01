import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";

const authUserOrDoctor = async (req, res, next) => {
  try {
    const token = req.headers.token || req.headers.dtoken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // Try to verify as user token first
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded.id).select("-password");
      
      if (user) {
        req.user = user;
        req.userType = "user";
        return next();
      }
    } catch (userError) {
      // User token verification failed, try doctor token
    }

    // Try to verify as doctor token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const doctor = await doctorModel.findById(decoded.id).select("-password");
      
      if (doctor) {
        req.doctor = doctor;
        req.userType = "doctor";
        return next();
      }
    } catch (doctorError) {
      // Doctor token verification also failed
    }

    return res.status(401).json({
      success: false,
      message: "Access denied. Invalid token.",
    });
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during authentication.",
    });
  }
};

export default authUserOrDoctor; 