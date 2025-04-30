import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import axios from "axios";
import cookieParser from "cookie-parser";
import alumniRoutes from "./src/routes/alumniRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import fileRoutes from './src/routes/fileRoutes.js';
import eventRoutes from './src/routes/eventRoutes.js';
import jobPostingRoutes from './src/routes/jobPostingRoutes.js'
import notificationRoutes from './src/routes/notificationRoutes.js';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// routes
app.use("/alumni", alumniRoutes);
app.use("/event", eventRoutes);
app.use("/jobs", jobPostingRoutes);
app.use("/auth", authRoutes);
app.use("/files", fileRoutes);
app.use("/events", eventRoutes);
app.use("/notifications", notificationRoutes);
app.use('/job-postings', jobPostingRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')))
// temporary default route -- remove when connecting to frontend
app.get('/', (req, res) => {
  res.send('API is running');
});

//export for testing
export default app;
