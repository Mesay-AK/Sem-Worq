class PortfolioController {
    constructor(portfolioUseCase) {
        this.portfolioUseCase = portfolioUseCase;
    }

    async listPortfolios(req, res) {
        try {
            const filters = {};
            if (req.query.visibility) {
                filters.visibility = req.query.visibility;
            }

            if (req.query.tags) {
                filters.tags = { $in: req.query.tags.split(",") };
            }

            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;

            const result = await this.portfolioUseCase.listPortfolios(filters, page, limit);
            res.json(result);

        } catch (error) {
            console.error("Error in PortfolioController.listPortfolios:", error);
            res.status(400).json({ error: error.message });
        }
    }

    async createPortfolio(req, res) {
        try {
            const result = await this.portfolioUseCase.createPortfolio(req.body);
            res.status(201).json(result);

        } catch (error) {
            console.error("Error in PortfolioController.createPortfolio:", error);
            res.status(400).json({ error: error.message });
        }
    }

    async updatePortfolio(req, res) {
        try {
            const result = await this.portfolioUseCase.updatePortfolio(req.params.id, req.body);
            res.json(result);

        } catch (error) {
            console.error("Error in PortfolioController.updatePortfolio:", error);
            res.status(400).json({ error: error.message });
        }
    }

    async deletePortfolio(req, res) {
        try {
            const result = await this.portfolioUseCase.deletePortfolio(req.params.id);
            res.json({ message: "Portfolio deleted successfully.", result });
            
        } catch (error) {
            console.error("Error in PortfolioController.deletePortfolio:", error);
            res.status(400).json({ error: error.message });
        }
    }
}


module.exports = PortfolioController;