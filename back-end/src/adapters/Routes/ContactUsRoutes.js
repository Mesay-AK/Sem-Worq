const express = require('express');
const contactController = require('../controllers/ContactUsController');
const router = express.Router();


router.post('/submitContactUs', contactController.createContactController);

router.get('/getContacts', contactController.getContactsController);

router.delete('/contacts/:contactId', contactController.deleteContactController);

module.exports = router;
