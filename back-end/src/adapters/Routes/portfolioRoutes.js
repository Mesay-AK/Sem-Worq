const express = require("express");
const PortfolioController = require("../controllers/PortfolioController");
const PortfolioRepository = require("../../Repositories/portfolioRepo");
const authMiddleware = require('../../adapters/Middlewares/AuthMiddleware');
const upload = require('../../adapters/Middlewares/imageMiddleware'); 
const portfolioRepository = new PortfolioRepository();
const portfolioController = new PortfolioController(portfolioRepository);

const router = express.Router();

router.get("/get", (req, res) => portfolioController.listPortfolios(req, res));

router.get("/get/:id", (req, res) => portfolioController.getPortfolioById(req, res));

router.post("/create", authMiddleware, upload.single('image'), (req, res) => portfolioController.createPortfolio(req, res));


router.put("/update/:id", authMiddleware, upload.single('image'), (req, res) => portfolioController.updatePortfolio(req, res));

router.delete("/delete/:id", authMiddleware, (req, res) => portfolioController.deletePortfolio(req, res));


module.exports = router;
