const express = require("express");
const PortfolioController = require("../controllers/PortfolioController");
const PortfolioUseCase = require("../../Usecases/portfolioUsecase");
const PortfolioRepository = require("../../Repositories/portfolioRepo")

const portfolioRepository = new PortfolioRepository();
const portfolioUseCase = new PortfolioUseCase(portfolioRepository);
const portfolioController = new PortfolioController(portfolioUseCase);

const router = express.Router();

router.get("/get", (req, res) => portfolioController.listPortfolios(req, res));
router.post("/create", (req, res) => portfolioController.createPortfolio(req, res));
router.put("/update/:id", (req, res) => portfolioController.updatePortfolio(req, res));
router.delete("/delete/:id", (req, res) => portfolioController.deletePortfolio(req, res));

module.exports = router;
