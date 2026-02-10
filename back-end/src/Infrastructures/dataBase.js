import mongoose from "mongoose";
import dotenv from "dotenv";

// Path adjusted to look one level up, as per your original logic
dotenv.config({ path: "../.env" });

const connectToDatabase = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    await mongoose.connect(mongoURI);

    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);

    // Terminates the process if the database connection fails
    process.exit(1);
  }
};

export default connectToDatabase;
