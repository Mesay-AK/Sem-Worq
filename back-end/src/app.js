const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv')
dotenv.config({ path: '../.env' });

const connectToDatabase = require('./Infrastructures/dataBase')
const testimonyRoutes = require('./adapters/Routes/testimonyRoutes');
const serviceRoutes = require('./adapters/Routes/ServiceRoutes');
const contactRoutes = require('./adapters/Routes/ContactUsRoutes');
const AuthRoutes = require('./adapters/Routes/AuthRoutes')
const blogRoutes = require("./adapters/Routes/blogsRoutes")
const portfloio = require('./adapters/Routes/portfolioRoutes');

const app = express();
connectToDatabase();

app.use(cors({
  origin: 'http://localhost:5000', // Your frontend origin
  credentials: true               // Required to send cookies
}));
app.use(cookieParser());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

app.use('/sem&worq', AuthRoutes);
app.use('/sem&worq/blogs', blogRoutes);
app.use('/sem&worq/services', serviceRoutes);
app.use('/sem&worq/testimony', testimonyRoutes); 
app.use('/sem&worq/contacts', contactRoutes); 
app.use('/sem&worq/portfolio', portfloio); 

app.use((err, req, res, next) => {
  console.error('Error:', err.stack || err.message);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
    },
  });
});

const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



module.exports = app;
 