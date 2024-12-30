const express = require('express');

const TestimonialController = require('../controllers/testimoneycontroller');
const TestimonialRepository = require('../../Repositories/testimoneyRepo');
const { authMiddleware, adminOnlyMiddleware } = require('../Middlewares/AuthMiddleware');

const repo = new TestimonialRepository();
const controller = new TestimonialController(repo);

const router = express.Router();


router.post('/create',authMiddleware, adminOnlyMiddleware, (req, res) => controller.createTestimonial(req, res)); 
router.get('/get', (req, res) => controller.listTestimonials(req, res));      
router.put('/edit/:id',authMiddleware, adminOnlyMiddleware, (req, res) => controller.updateTestimonial(req, res)); 
router.delete('/delete/:id',authMiddleware, adminOnlyMiddleware, (req, res) => controller.deleteTestimonial(req, res)); 

module.exports = router;
