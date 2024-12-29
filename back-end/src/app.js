const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv')
dotenv.config({ path: '../.env' });
const dotenv = require('dotenv')
dotenv.config({ path: '../.env' });

const connectToDatabase = require('./Infrastructures/dataBase')
const connectToDatabase = require('./Infrastructures/dataBase')
const serviceRoutes = require('./adapters/Routes/ServiceRoutes');
const contactRoutes = require('./adapters/Routes/ContactUsRoutes');
const AuthRoutes = require('./adapters/Routes/AuthRoutes')
const blogRoutes = require("./adapters/Routes/blogsRoutes")



const app = express();
connectToDatabase();
connectToDatabase();

app.use(cors());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 


app.use('/api/services', serviceRoutes); 
app.use('/api/contacts', contactRoutes); 
app.use('/api/contacts', contactRoutes); 
app.use('/api/blogs', blogRoutes);
app.use('/api', AuthRoutes);



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
 