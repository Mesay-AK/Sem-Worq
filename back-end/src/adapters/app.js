import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

// Import Database and Routes
import connectToDatabase from "../Infrastructures/dataBase.js";
// nodemo
import AuthRoutes from "./Routes/AuthRoutes.js";
// import blogRoutes from "./Routes/blogsRoutes.js";
// import portfloio from "./Routes/portfolioRoutes.js";

dotenv.config({ path: "../.env" });

const app = express();

// Connect to MongoDB
connectToDatabase();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Point this to your Frontend
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Base Routes
app.use("/sem&worq", AuthRoutes);
// app.use("/sem&worq/blogs", blogRoutes);
// app.use("/sem&worq/services", serviceRoutes);
// app.use("/sem&worq/testimony", testimonyRoutes);
// app.use("/sem&worq/contacts", contactRoutes);
// app.use("/sem&worq/portfolio", portfloio);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err.stack || err.message);
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
    },
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Main Server running on port ${PORT}`));

export default app;
