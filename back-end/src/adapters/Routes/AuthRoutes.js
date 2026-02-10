import express from "express";
import AuthController from "../controllers/AuthController.js";
import AdminRepository from "../../Repositories/AdminRepository.js";
import authMiddleware from "../../adapters/Middlewares/AuthMiddleware.js";
import mailService from "../../Infrastructures/email/mailService.js";
import PasswordHelper from "../../Infrastructures/helpers/password-helper.js";
import TokenHelper from "../../Infrastructures/helpers/token-helper.js";

const router = express.Router();

// Dependency Injection: Initializing the layers
const repository = new AdminRepository();
const controller = new AuthController(
  repository,
  mailService,
  PasswordHelper,
  TokenHelper,
);
const Middlware = new authMiddleware();

// Authentication Routes
router.post("/@Only_admin/_create", (req, res) =>
  controller.register(req, res),
);
router.post("/login", (req, res) => controller.login(req, res));
router.post(
  "/logout/:id",
  Middlware.authMiddleware,
  Middlware.adminOnlyMiddleware,
  (req, res) => controller.logout(req, res),
);

// Password Management
router.post("/forgot-password", (req, res) =>
  controller.forgotPassword(req, res),
);
router.post("/reset-password", (req, res) =>
  controller.resetPassword(req, res),
);
router.post("/refresh-token", (req, res) => controller.refreshToken(req, res));

// Admin Management
router.get(
  "/get/:id",
  Middlware.authMiddleware,
  Middlware.adminOnlyMiddleware,
  (req, res) => controller.getAdmin(req, res),
);
router.get(
  "/get",
  Middlware.authMiddleware,
  Middlware.adminOnlyMiddleware,
  (req, res) => controller.getAll(req, res),
);

// Profile Edits
router.patch(
  "/edit/:id",
  Middlware.authMiddleware,
  Middlware.selfOnlyMiddleware,
  (req, res) => controller.update(req, res),
);

// Deletion
router.delete("/Only_admin/delete/:id", (req, res) =>
  controller.delete(req, res),
);
router.delete(
  "/delete/:id",
  Middlware.authMiddleware,
  Middlware.selfOnlyMiddleware,
  (req, res) => controller.delete(req, res),
);

export default router;
