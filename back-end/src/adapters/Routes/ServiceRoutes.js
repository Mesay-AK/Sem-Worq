const express = require('express');
const ServiceController = require('../controllers/ServicesController');
const ServiceRepository = require('../../Repositories/ServicesRepo');
const authMiddleware = require('../../adapters/Middlewares/AuthMiddleware');
const imageMiddleware = require('../../adapters/Middlewares/imageMiddleware'); 

const serviceRepo = new ServiceRepository();
const serviceController = new ServiceController(serviceRepo);
const Middlware = new authMiddleware(serviceRepo);

const router = express.Router();

router.post('/create', Middlware.authMiddleware, Middlware.adminOnlyMiddleware, imageMiddleware.single('image'), (req, res) => serviceController.createService(req, res));

router.put('/update/:id', Middlware.authMiddleware, Middlware.adminOnlyMiddleware, imageMiddleware.single('image'), (req, res) => serviceController.updateService(req, res));

router.delete('/delete/:id', Middlware.authMiddleware, Middlware.adminOnlyMiddleware, (req, res) => serviceController.deleteService(req, res));

router.get('/get', (req, res) => serviceController.listServices(req, res));

router.get('/get/:id', (req, res) => serviceController.getServiceById(req, res));

module.exports = router;
