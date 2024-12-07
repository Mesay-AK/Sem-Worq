const express = require('express');

const TestimonialController = require('../controllers/testimoneycontroller');
const TestimonialUsecase = require('../../Usecases/testimoneyUsecase');
const TestimonialRepository = require('../../adapters/Repositories/testimoneyRepo');


const repo = new TestimonialRepository();
const usecase = new TestimonialUsecase(repo);
const controller = new TestimonialController(usecase);

const router = express.Router();


router.post('/create', (req, res) => controller.createTestimonial(req, res)); 
router.get('/get', (req, res) => controller.listTestimonials(req, res));      
router.put('/edit/:id', (req, res) => controller.updateTestimonial(req, res)); 
router.delete('/delete/:id', (req, res) => controller.deleteTestimonial(req, res)); 

module.exports = router;
