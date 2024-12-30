const PortfolioEntity = require('../../Domain/portfolioEntity')
class PortfolioController {
    constructor(repository) {
        this.repository = repository;
    }

    async listPortfolios(req, res) {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;

            const portfolios = await this.repository.findAll(page, limit);
            const total = await this.repository.count();

            const result = {
                portfolios,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
            res.json(result);

        } catch (error) {
            console.error("Error in PortfolioController.listPortfolios:", error);
            res.status(400).json({ error: error.message });
        }
    }

    async createPortfolio(req, res) {
        try {

            const newPortfolio = req.body
            const portfolioEntity = new PortfolioEntity(newPortfolio);
            portfolioEntity.validate();
            
            const result =  await this.repository.create(newPortfolio);
            res.status(201).json(result);

        } catch (error) {
            console.error("Error in PortfolioController.createPortfolio:", error);
            res.status(400).json({ error: error.message });
        }
    }

    async updatePortfolio(req, res) {
        try {
            const updatedPortfolio = req.body
            const portfolioEntity = new PortfolioEntity(updatedPortfolio);
            portfolioEntity.validateOnUpdate();

            const result = await this.repository.updateById(id, updatedPortfolio);
            res.json({message: "portlolio Updated Successfully.", updated: result});

        } catch (error) {
            console.error("Error in PortfolioController.updatePortfolio:", error);
            res.status(400).json({ error: error.message });
        }
    }

    async deletePortfolio(req, res) {
        try {
            const {id} = req.params.id;
            const result = await this.repository.deleteById(id);
            res.json({ message: "Portfolio deleted successfully.", result });
            
        } catch (error) {
            console.error("Error in PortfolioController.deletePortfolio:", error);
            res.status(400).json({ error: error.message });
        }
    }
}


module.exports = PortfolioController;