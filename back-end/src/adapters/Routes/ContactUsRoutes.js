const express = require('express');
const contactController = require('../controllers/ContactUsController');
const router = express.Router();


router.post('/create', contactController.createContactController);

router.get('/get', contactController.getContactsController);

router.delete('/:id', contactController.deleteContactController);

module.exports = router;
