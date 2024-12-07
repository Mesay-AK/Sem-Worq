const express = require('express');
const dotenv = require('dotenv');
const connectToDatabase = require('./Infrastructures/dataBase');
const contactUsRouter = require('./adapters/Routes/ContactUsRoutes');
const testmonyRoute = require('./adapters/Routes/testmonyRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON requests
app.use(express.json());

// Route setup
app.use('/api/contacts', contactUsRouter);
app.use('api/testimonials', testmonyRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

connectToDatabase() 
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error.message);
  });
