const express = require('express');
const contactController = require('../controllers/ContactUsController');

const contactRepository = require('../../Repositories/ContactUsRepo');
const router = express.Router();
const authMiddleware = require('../../adapters/Middlewares/AuthMiddleware');

const contactRepo = new contactRepository();
const contactContrl = new contactController(contactRepo);
const Middlware = new authMiddleware(contactRepo);


router.post('/create',(req, res) => contactContrl.createContact(req, res));

router.get('/get',Middlware.authMiddleware, Middlware.adminOnlyMiddleware,(req, res) =>  contactContrl.getContacts(req, res));

router.get('/getContacts',Middlware.authMiddleware, Middlware.adminOnlyMiddleware,(req, res) =>  contactContrl.getContacts(req, res));

router.delete('/:id',Middlware.authMiddleware, Middlware.adminOnlyMiddleware,(req, res) =>  contactContrl.deleteContact(req, res));
router.get('/contacts/:id',Middlware.authMiddleware, Middlware.adminOnlyMiddleware,(req, res) =>  contactContrl.getContactById(req, res));

module.exports = router;
