const express = require('express');

const TestimonialController = require('../controllers/testimoneycontroller');
const TestimonialRepository = require('../../Repositories/testimoneyRepo');
const authMiddleware = require('../../adapters/Middlewares/AuthMiddleware');
const upload = require('../Middlewares/imageMiddleware');

const repo = new TestimonialRepository();
const controller = new TestimonialController(repo);
const Middlware = new authMiddleware(repo);

const router = express.Router();


router.post('/create',Middlware.authMiddleware, Middlware.adminOnlyMiddleware,upload.single("image"), (req, res) => controller.createTestimonial(req, res)); 
router.get('/get',Middlware.authMiddleware, Middlware.adminOnlyMiddleware, (req, res) => controller.listTestimonials(req, res));  
router.get("/get/:id", (req, res) =>
    testimonialController.getTestimonialById(req, res)
);
router.patch('/edit/:id',Middlware.authMiddleware, Middlware.adminOnlyMiddleware, (req, res) => controller.updateTestimonial(req, res)); 
router.delete('/delete/:id',Middlware.authMiddleware, Middlware.adminOnlyMiddleware, (req, res) => controller.deleteTestimonial(req, res)); 

module.exports = router;
