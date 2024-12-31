const express = require('express');
const ServiceController = require('../controllers/ServicesController');
const ServiceRepository = require('../../Repositories/ServicesRepo');
const { authMiddleware, adminOnlyMiddleware } = require('../Middlewares/AuthMiddleware');


const serviceRepo = new ServiceRepository();
const serviceController = new ServiceController(serviceRepo);

const router = express.Router();

router.post('/create',authMiddleware, adminOnlyMiddleware, (req, res) => serviceController.createService(req, res));
router.put('/update/:id',authMiddleware, adminOnlyMiddleware,  (req, res) => serviceController.updateService(req, res));
router.delete('/delete/:id',authMiddleware, adminOnlyMiddleware,  (req, res) => serviceController.deleteService(req, res));
router.get('/get',(req, res) => serviceController.listServices(req, res));

module.exports = router;
