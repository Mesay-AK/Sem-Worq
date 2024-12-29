const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv')
dotenv.config({ path: '../.env' });

const connectToDatabase = require('./Infrastructures/dataBase')
const testimonyRoutes = require('./adapters/Routes/testmonyRoutes');
const contactRoutes = require('./adapters/Routes/ContactUsRoutes');



const app = express();
connectToDatabase();

app.use(cors());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 


app.use('/api/testimony', testimonyRoutes); 
app.use('/api/contacts', contactRoutes); 



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
 