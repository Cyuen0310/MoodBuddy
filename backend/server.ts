import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import journalRoutes from "./routes/journal";

const app = express();
app.use(cors());
app.use(express.json());

// Debug middleware - add this before routes
app.use((req, res, next) => {
  console.log("Request:", {
    method: req.method,
    path: req.path,
    url: req.originalUrl,
    query: req.query,
    body: req.body,
    headers: req.headers,
  });
  next();
});

// Mount routes at /api
app.use("/api", journalRoutes);

const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Routes mounted at /api:");
  console.log("- GET  /journal");
  console.log("- POST /journal");
  console.log("- GET  /journal/insights");
});

// Add catch-all route AFTER mounting all other routes
app.use((req, res) => {
  console.log("404 Not Found:", {
    method: req.method,
    url: req.originalUrl,
    body: req.body,
  });
  res.status(404).json({ error: "Route not found" });
});
