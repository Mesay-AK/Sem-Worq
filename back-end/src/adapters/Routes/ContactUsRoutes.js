const express = require('express');
const contactController = require('../controllers/ContactUsController');

const contactRepository = require('../Repositories/ContactUsRepo');
const router = express.Router();
const { authMiddleware, adminOnlyMiddleware } = require('../Middlewares/AuthMiddleware');

const contactRepo = new contactRepository();
const contactContrl = new contactController(contactRepo);


router.post('/create', contactContrl.createContactController);

router.get('/get',authMiddleware, adminOnlyMiddleware, contactContrl.getContacts);

router.delete('/:id',authMiddleware, adminOnlyMiddleware,  contactContrl.deleteContactController);
router.get('/getContacts',authMiddleware, adminOnlyMiddleware, contactContrl.getContacts);

router.delete('/:id',authMiddleware, adminOnlyMiddleware, contactContrl.deleteContact);
router.get('/contacts/:id',authMiddleware, adminOnlyMiddleware, contactContrl.getContactById);

module.exports = router;
