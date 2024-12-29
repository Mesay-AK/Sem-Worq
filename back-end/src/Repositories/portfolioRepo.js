const Portfolio = require("../Infrastructures/models/portfolioModel");

class PortfolioRepository {
    ErrFound = new Error ("Portifolio already exists")

    async findAll(filters = {}, page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            return await Portfolio.find(filters)
                .skip(skip)
                .limit(limit)
                .sort({ date: -1 });
        } catch (error) {
            console.error("Error in PortfolioRepository.findAll:", error);
            throw new Error("Failed to fetch portfolios. Please try again later.");
        }
    }

    async count(filters = {}) {
        try {
            return await Portfolio.countDocuments(filters);
        } catch (error) {
            console.error("Error in PortfolioRepository.count:", error);
            throw new Error("Failed to count portfolios. Please try again later.");
        }
    }


    async create(portfolioData) {
        try {

        const existingPortfolio = await Portfolio.findOne({ title: portfolioData.title });
        if (existingPortfolio) {
            throw this.ErrFound;
        }
        const portfolio = new Portfolio(portfolioData);
            return await portfolio.save();

        } catch (error) {
            if (error == this.ErrFound){
                throw error
            }
            console.error("Error in PortfolioRepository.create:", error);
            throw new Error("Failed to create portfolio. Please check your input.");
        }
    }

    async updateById(id, updateData) {
        try {
            const portfolio = await Portfolio.findByIdAndUpdate(id, updateData, { new: true });

            if (!portfolio) {
                throw new Error("Portfolio not found.")
            }
            return portfolio;
        } catch (error) {
            console.error("Error in PortfolioRepository.updateById:", error);
            throw new Error("Failed to update portfolio. Please try again later.");
        }
    }

    async deleteById(id) {
        try {
            const result = await Portfolio.findByIdAndDelete(id);
            if (!result) {
                return new Error("Portfolio not found.");
            }
            return result;
        } catch (error) {
            console.error("Error in PortfolioRepository.deleteById:", error);
            throw new Error("Failed to delete portfolio. Please try again later.");
        }
    }
}

module.exports = PortfolioRepository ;