const express = require('express');
const AuthController = require('../controllers/AuthController');
const AdminRepository = require('../../Repositories/AdminRepository');
const authMiddleware = require('../../adapters/Middlewares/AuthMiddleware');
const mailService = require('../../Infrastructures/email/mailService')
const PasswordHelper = require('../../Infrastructures/helpers/password-helper')
const TokenHelper = require('../../Infrastructures/helpers/token-helper')




const router = express.Router();
const repository = new AdminRepository();
const controller = new AuthController(repository, mailService, PasswordHelper, TokenHelper);
const Middlware = new authMiddleware();

router.post('/@Only_admin/_create', (req, res) => controller.register(req, res));
router.post('/login', (req, res) => controller.login(req, res));
router.post('/logout/:id', Middlware.authMiddleware, Middlware.adminOnlyMiddleware, (req, res) => controller.logout(req, res));

router.post('/forgot-password', (req, res) => controller.forgotPassword(req, res));
router.post('/reset-password', (req, res) => controller.resetPassword(req, res));
router.post('/refresh-token',(req, res) => controller.refreshToken(req, res));

router.delete('/delete/:id', (req, res) => controller.delete(req, res))

router.get('/get/:id', Middlware.authMiddleware, Middlware.adminOnlyMiddleware ,(req, res) => controller.getAdmin(req, res))

router.get('/get',Middlware.authMiddleware, Middlware.adminOnlyMiddleware, (req, res) => controller.getAll(req, res))

module.exports = router;
