const PortfolioEntity = require('../../Domain/portfolioEntity');

class PortfolioController {
    constructor(repository) {
        this.repository = repository;
    }

    async listPortfolios(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query || {};  

            const parsedPage = parseInt(page, 10);
            const parsedLimit = parseInt(limit, 10);

            if (isNaN(parsedPage) || parsedPage < 1) {
                throw new Error("Page must be a positive integer.");
            }

            if (isNaN(parsedLimit) || parsedLimit < 1) {
                throw new Error("Limit must be a positive integer.");
            }

            const portfolios = await this.repository.findAll(parsedPage, parsedLimit);
            const total = await this.repository.count();

            const result = {
                portfolios,
                pagination: {
                    page: parsedPage,
                    limit: parsedLimit,
                    total,
                    totalPages: Math.ceil(total / parsedLimit),
                },
            };

            res.json(result);
        } catch (error) {
            console.error("Error in PortfolioController.listPortfolios:", error);

            return res.status(400).json({ error: error.message || "Database error" });
        }
    }


 async getPortfolioById(req, res) {
    try {
        const { id } = req.params;

        const portfolio = await this.repository.findById(id);

        if (!portfolio) {
            return res.status(404).json({ error: "Portfolio not found" });
        }

        // Convert Mongoose document to plain object before processing the image
        const portfolioObj = portfolio.toObject();

        const imageBase64 = portfolioObj.image
            ? `data:image/jpeg;base64,${portfolioObj.image.toString("base64")}`
            : null;

        res.status(200).json({
            ...portfolioObj,
            image: imageBase64,
        });
    } catch (error) {
        console.error("Error in PortfolioController.getPortfolioById:", error.message, error.stack);
        res.status(500).json({ error: "Failed to retrieve portfolio" });
    }
}



    async createPortfolio(req, res) {
        try {
            const { title, description, tags, visibility } = req.body;
            const image = req.file ? req.file.buffer : null; 

            const portfolioData = { title, description, tags, visibility, image };
            const portfolioEntity = new PortfolioEntity(portfolioData);

            portfolioEntity.validate(); 

            const result = await this.repository.create(portfolioData); 

            res.status(201).json(result);
        } catch (error) {
            console.error("Error in PortfolioController.createPortfolio:", error);

            if (error.message.includes("must be")) {
                return res.status(400).json({ error: error.message });
            }

            return res.status(400).json({ error: "Database error" });
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
