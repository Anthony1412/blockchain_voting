require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 5001;

// ✅ Middleware
app.use(cors({
  origin: "http://localhost:5001", // frontend origin
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// ✅ API routes
app.use("/auth", authRoutes);

// ✅ Serve frontend static files
app.use(express.static(path.join(__dirname, "../client")));

// ✅ Catch-all frontend route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend & frontend running at http://localhost:${PORT}`);
});
