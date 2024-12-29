const express = require('express');
const contactController = require('../controllers/ContactUsController');

const router = express.Router();
const { authMiddleware, adminOnlyMiddleware } = require('../Middlewares/AuthMiddleware');

router.post('/create', contactController.createContactController);

router.get('/get',authMiddleware, adminOnlyMiddleware, contactController.getContactsController);

router.delete('/:id',authMiddleware, adminOnlyMiddleware,  contactController.deleteContactController);

module.exports = router;
