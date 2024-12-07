const PortfolioEntity = require('../Domain/portfolioEntity')
class PortfolioUseCase {
    constructor(repository) {
        this.repository = repository;
    }

    async listPortfolios(filters = {}, page = 1, limit = 10) {
        try {
            const portfolios = await this.repository.findAll(filters, page, limit);
            const total = await this.repository.count(filters);

            return {
                portfolios,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            console.error("Error in PortfolioUseCase.listPortfolios:", error);
            throw new Error("Failed to list portfolios.");
        }
    }


    async createPortfolio(data) {
        try {
            const portfolioEntity = new PortfolioEntity(data);
            portfolioEntity.validate();
            
            return await this.repository.create(data);
            
        } catch (error) {
            console.error("Error in PortfolioUseCase.createPortfolio:", error);
            throw new Error(error);
        }
    }

    async updatePortfolio(id, data) {
        try {
            const portfolioEntity = new PortfolioEntity(data);
            portfolioEntity.validateOnUpdate();
            return await this.repository.updateById(id, data);

        } catch (error) {
            console.error("Error in PortfolioUseCase.updatePortfolio:", error);
            throw error;
        }
    }

    async deletePortfolio(id) {
        try {
            return await this.repository.deleteById(id);

        } catch (error) {

            console.error("Error in PortfolioUseCase.deletePortfolio:", error);
            throw new Error("Failed to delete portfolio.");
        }
    }
}


module.exports = PortfolioUseCase;