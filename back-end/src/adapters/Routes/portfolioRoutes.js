const express = require("express");
const PortfolioController = require("../controllers/PortfolioController");
const PortfolioRepository = require("../../Repositories/portfolioRepo")
const authMiddleware = require('../../adapters/Middlewares/AuthMiddleware');

const portfolioRepository = new PortfolioRepository();
const portfolioController = new PortfolioController(portfolioRepository);
// const Middlware = new authMiddleware(portfolioRepository);

const router = express.Router();

router.get("/get", (req, res) => portfolioController.listPortfolios(req, res));
router.post("/create", (req, res) => portfolioController.createPortfolio(req, res));
router.put("/update/:id", (req, res) => portfolioController.updatePortfolio(req, res));
router.delete("/delete/:id", (req, res) => portfolioController.deletePortfolio(req, res));

module.exports = router;
