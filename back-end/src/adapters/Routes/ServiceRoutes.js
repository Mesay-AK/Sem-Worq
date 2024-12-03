const express = require('express');
const ServiceController = require('../controllers/ServicesController');
const ServiceUseCase = require('../../Usecases/ServicesUsecase');
const ServiceRepository = require('../../Repositories/ServicesRepo');


const serviceRepo = new ServiceRepository();
const serviceUseCase = new ServiceUseCase(serviceRepo);
const serviceController = new ServiceController(serviceUseCase);

const router = express.Router();

// Define routes and bind controller methods
router.post('/create', (req, res) => serviceController.createService(req, res));
router.put('/update/:id', (req, res) => serviceController.updateService(req, res));
router.delete('/delete/:id', (req, res) => serviceController.deleteService(req, res));
router.get('/get', (req, res) => serviceController.listServices(req, res));

module.exports = router;
