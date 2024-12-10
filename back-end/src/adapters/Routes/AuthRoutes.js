const express = require('express');
const AuthController = require('../controllers/AuthController');
const AuthUseCase = require('../../Usecases/AuthUsecase');
const AdminRepository = require('../../Repositories/AdminRepository');
const {authMiddleware, adminOnlyMiddleware} = require('../../adapters/Middlewares/AuthMiddleware');
const mailService = require('../../Infrastructures/email/mailService')
const PasswordHelper = require('../../Infrastructures/helpers/password-helper')
const TokenHelper = require('../../Infrastructures/helpers/token-helper')




const router = express.Router();
const repository = new AdminRepository();
const useCase = new AuthUseCase(repository, mailService, PasswordHelper, TokenHelper);
const controller = new AuthController(useCase);

router.post('/add', authMiddleware, adminOnlyMiddleware, (req, res) => controller.register(req, res));
router.post('/login', (req, res) => controller.login(req, res));
router.post('/logout', authMiddleware, (req, res) => controller.logout(req, res));

router.post('/forgot-password', (req, res) => authController.forgotPassword(req, res));
router.post('/reset-password', (req, res) => authController.resetPassword(req, res));
router.post('/refresh-token', (req, res) => controller.refreshToken(req, res));

router.delete('/delete/:id', (req, res) => authController.delete(req, res))
router.get('/get', (req, res) => repository.get(req, res))

module.exports = router;
