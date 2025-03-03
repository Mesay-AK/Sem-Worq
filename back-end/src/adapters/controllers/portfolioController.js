const PortfolioEntity = require('../../Domain/portfolioEntity');

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

    async getPortfolioById(req, res) {
        try {
            const { id } = req.params; 
            const portfolio = await this.repository.findById(id); 

            if (!portfolio) {
                return res.status(404).json({ error: "Portfolio not found" });
            }

            const imageBase64 = portfolio.image 
                ? `data:image/jpeg;base64,${portfolio.image.toString("base64")}` 
                : null;

            res.json({
                ...portfolio.toObject(),  
                image: imageBase64         
            });
        } catch (error) {
            console.error("Error in PortfolioController.getPortfolioById:", error);
            res.status(500).json({ error: "Failed to retrieve portfolio" });
        }
    }

    async createPortfolio(req, res) {
        try {
            const { title, description, tags, visibility } = req.body;
            const image = req.file ? req.file.buffer : null; // Get image as Buffer

            const portfolioData = { title, description, tags, visibility, image };
            const portfolioEntity = new PortfolioEntity(portfolioData);
            portfolioEntity.validate(); // Validating the entity

            const result = await this.repository.create(portfolioData); // Save to DB
            res.status(201).json(result);
        } catch (error) {
            console.error("Error in PortfolioController.createPortfolio:", error);
            res.status(400).json({ error: error.message });
        }
    }

    async updatePortfolio(req, res) {
        try {
            const { id } = req.params;
            const updatedData = req.body;
            if (req.file) {
                updatedData.image = req.file.buffer; // Updating image as Buffer
            }

            const portfolioEntity = new PortfolioEntity(updatedData);
            portfolioEntity.validateOnUpdate(); // Validate on update

            const result = await this.repository.updateById(id, updatedData);
            res.json({ message: "Portfolio Updated Successfully.", updated: result });
        } catch (error) {
            console.error("Error in PortfolioController.updatePortfolio:", error);
            res.status(400).json({ error: error.message });
        }
    }

    async deletePortfolio(req, res) {
        try {
            const { id } = req.params;
            const result = await this.repository.deleteById(id);
            res.json({ message: "Portfolio deleted successfully.", result });
        } catch (error) {
            console.error("Error in PortfolioController.deletePortfolio:", error);
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = PortfolioController;
