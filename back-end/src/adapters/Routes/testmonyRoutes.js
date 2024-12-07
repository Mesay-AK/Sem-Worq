const express = require('express');
const testimonialController = require('../controllers/testimoneycontroller');
const testimoninalUsecase = require('../../Usecases/testimoneyUsecase');
const testimoinialRepository = require('../Repositories/testimoneyRepo');

const repo = new testimoinialRepository();
const usecase = new testimoninalUsecase(repo);
const controller = new testimonialController(usecase)

const router = express.Router();

router.post('/create', controller.createTestimonial);
router.get('/get', controller.listTestimonials);
router.put('/edit/:id', controller.updateTestimonial);
router.delete('/testimonials/:id', controller.deleteTestimonial);

module.exports = router;
