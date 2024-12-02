require("dotenv").config(); // Load environment variables from .env file
import express, { json } from "express";
import connectDB from "./Infrastructure/dataBase";
import routes from "./routes";

const app = express();
app.use(json()); // Middleware to parse JSON request bodies

// Connect to MongoDB
connectDB();

// Define routes
app.use("/api", routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
