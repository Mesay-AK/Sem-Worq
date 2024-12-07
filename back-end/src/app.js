const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

// Import routes
const serviceRoutes = require('./adapters/Routes/ServiceRoutes');
const contactRoutes = require('./adapters/Routes/ContactUsRoutes');
const portfolioRoutes = require('./adapters/Routes/portfolioRoutes')

const app = express();

// Middleware setup
app.use(cors());
app.use(bodyParser.json()); // Parses incoming JSON requests
app.use(bodyParser.urlencoded({ extended: true })); // Parses URL-encoded data

// API routes
app.use('/api/services', serviceRoutes); 
app.use('/api/contacts', contactRoutes); 
app.use('/api/portfolio', portfolioRoutes);

// Handle invalid routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'Page not found' });
})

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack || err.message);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
    },
  });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });

module.exports = app;
