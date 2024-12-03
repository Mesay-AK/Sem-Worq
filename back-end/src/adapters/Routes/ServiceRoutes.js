// src/routes/serviceRoutes.js
const express = require('express');
const {
  CreateServiceController,
  UpdateServiceController,
  DeleteServiceController,
  ListServicesController,
} = require('../controllers/ServicesController');

const router = express.Router();

router.post('/create', CreateServiceController);
router.put('/update/:id', UpdateServiceController);
router.delete('/delete/:id', DeleteServiceController);
router.get('/get', ListServicesController);

module.exports = router;
