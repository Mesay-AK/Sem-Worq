const AdminRepository = require('./../Repositories/AdminRepository')
const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config({ path: '../.env' });

const AdminRepo = new AdminRepository()
const connectToDatabase = async () => {
  try {

    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }
    
    await mongoose.connect(mongoURI);
    AdminRepo.createFirstAdmin();

    console.log('Connected to MongoDB');

    
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  
    process.exit(1);
  }
};

module.exports = connectToDatabase;


