// backend/index.js (or your main server file)
import express from "express";
import cors from "cors";
import "dotenv/config";
import { createServer } from "http";
import connetDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";
import assessmentRouter from "./routes/assessmentRoute.js";
import consultationRouter from "./routes/consultationRoute.js";
import consultationNotesRouter from "./routes/consultationNotesRoute.js";
import SocketServer from "./socketServer.js";

// -------- app config ----------
const app = express();
const server = createServer(app);
const port = process.env.PORT || 4000;
connetDB();
connectCloudinary();

// Initialize Socket.IO server
const socketServer = new SocketServer(server);

// -------- middlewares ---------
app.use(express.json({ limit: "400mb" }));

// CORS configuration for both frontend origins
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
   
  ].filter(Boolean),
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "x-auth-token",
    "token",
    "dtoken",, 'atoken'
  ], // ✅ Add "token"
};

app.use(cors(corsOptions));

// ------ api endpoints ------
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);
app.use("/api/assessments", assessmentRouter);
app.use("/api/consultation", consultationRouter);
app.use("/api/consultation-notes", consultationNotesRouter);

app.get("/", (req, res) => {
  res.send("API WORKING...");
});

// -------- port listen -------
server.listen(port, () => {
  console.log("Server Running on port", port);
  console.log("CORS enabled for origins:", corsOptions.origin);
});
