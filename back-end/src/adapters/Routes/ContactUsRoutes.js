const express = require('express');
const contactController = require('../controllers/ContactUsController');
const contactRepository = require('../Repositories/ContactUsRepo');
const router = express.Router();

const contactRepo = new contactRepository();
const contactContrl = new contactController(contactRepo);



router.post('/submitContactUs', contactContrl.createContact);

router.get('/getContacts', contactContrl.getContacts);

router.delete('/:id', contactContrl.deleteContact);
router.get('/contacts/:id', contactContrl.getContactById);

module.exports = router;
