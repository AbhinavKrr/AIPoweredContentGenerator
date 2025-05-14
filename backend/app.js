import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import authRoutes from "./routes/authRoutes.js";
import generateRoute from "./routes/generate.js";

dotenv.config();
const app = express();

// Allow requests from frontend (localhost:5173)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the frontend's dist folder
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// For any route not handled by your APIs, serve index.html (for SPA support)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

const PORT = process.env.PORT || 3000;

// Routes
app.use("/api/auth", authRoutes);
app.use('/api/generate', generateRoute);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error("MongoDB connection failed:", err.message);
});



