const express = require('express');
const contactController = require('../controllers/ContactUsController');

const contactRepository = require('../../Repositories/ContactUsRepo');
const router = express.Router();
const { authMiddleware, adminOnlyMiddleware } = require('../Middlewares/AuthMiddleware');

const contactRepo = new contactRepository();
const contactContrl = new contactController(contactRepo);


router.post('/create',(req, res) => contactContrl.createContact(req, res));

router.get('/get',authMiddleware, adminOnlyMiddleware,(req, res) =>  contactContrl.getContacts(req, res));

router.get('/getContacts',authMiddleware, adminOnlyMiddleware,(req, res) =>  contactContrl.getContacts(req, res));

router.delete('/:id',authMiddleware, adminOnlyMiddleware,(req, res) =>  contactContrl.deleteContact(req, res));
router.get('/contacts/:id',authMiddleware, adminOnlyMiddleware,(req, res) =>  contactContrl.getContactById(req, res));

module.exports = router;
