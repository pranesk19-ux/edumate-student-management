const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const connectDB = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/students", studentRoutes);
app.use("/api/auth", authRoutes);

// Serve frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// Website pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/login.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/login.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.get("/student-records", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/student-records.html"));
});

app.get("/staff-management", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/staff-management.html"));
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});