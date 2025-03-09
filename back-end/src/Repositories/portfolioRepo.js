const Portfolio = require("../Infrastructures/models/portfolioModel");

class PortfolioRepository {

    async findAll(page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            return await Portfolio.find({})
                .skip(skip)
                .limit(limit)
                .sort({ date: -1 });
        } catch (error) {
            console.error("Error in PortfolioRepository.findAll:", error);
            throw new Error("Failed to fetch portfolios. Please try again later.");
        }
    }

    async findById(id) {
        try {
            const portfolio = await Portfolio.findById(id);
            if (!portfolio) {
                throw new Error("Portfolio not found.");
            }
            return portfolio;
        } catch (error) {
        if (error.message === "Portfolio not found.") {
            throw error; 
        }
        throw new Error("Failed to fetch portfolio.");
        }
    }

    async count() {
        try {
            return await Portfolio.countDocuments();
        } catch (error) {

            throw new Error("Failed to count portfolios. Please try again later.");
        }
    }

    async create(portfolioData) {
        try {
            const existingPortfolio = await Portfolio.findOne({ title: portfolioData.title });
            if (existingPortfolio) {
                throw new Error("Portfolio already exists.");
            }
            const portfolio = new Portfolio(portfolioData);
            return await portfolio.save();
        } catch (error) {
            if (error.message === "Portfolio already exists.") {
                throw error;
            }
            console.error("Error in PortfolioRepository.create:", error);
            throw new Error("Failed to create portfolio. Please check your input.");
        }
    }
    async updateById(id, updateData) {
        try {
            const portfolio = await Portfolio.findByIdAndUpdate(id, updateData, { new: true });

            if (!portfolio) {
                throw new Error("Portfolio not found."); 
            }
            return portfolio;
        } catch (error) {
            if (error.message === "Portfolio not found.") {
                throw error; 
            }
            throw new Error("Failed to update portfolio. Please try again later."); 
        }
    }

    async deleteById(id) {
        try {
            const result = await Portfolio.findByIdAndDelete(id);
            if (!result) {
                throw new Error("Portfolio not found."); 
            }
            return result;
        } catch (error) {
            if (error.message === "Portfolio not found.") {
                throw error; 
            }
            throw new Error("Failed to delete portfolio. Please try again later."); 
        }
    }

}

module.exports = PortfolioRepository;
