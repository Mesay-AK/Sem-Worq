// portfolioRepository.test.js
const Portfolio = require('../../Infrastructures/models/portfolioModel');
const PortfolioRepository = require('../../Repositories/portfolioRepo');

// Mock the Portfolio model methods
jest.mock('../../Infrastructures/models/portfolioModel');

describe('PortfolioRepository', () => {
    let portfolioRepository;

    beforeEach(() => {
        portfolioRepository = new PortfolioRepository();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test for create method
    describe('create', () => {
        it('should create a new portfolio if it does not already exist', async () => {
            const portfolioData = { title: 'Portfolio 1', description: 'Description of portfolio 1' };
            const mockPortfolio = { _id: '123', ...portfolioData };

            // Simulate finding an existing portfolio
            Portfolio.findOne.mockResolvedValue(null);
            Portfolio.prototype.save.mockResolvedValue(mockPortfolio);

            const result = await portfolioRepository.create(portfolioData);

            expect(result).toEqual(mockPortfolio);
            expect(Portfolio.findOne).toHaveBeenCalledWith({ title: portfolioData.title });
            expect(Portfolio.prototype.save).toHaveBeenCalled();
        });

        it('should throw an error if portfolio already exists', async () => {
            const portfolioData = { title: 'Portfolio 1', description: 'Description of portfolio 1' };

            // Simulate portfolio already existing
            Portfolio.findOne.mockResolvedValue(true);

            await expect(portfolioRepository.create(portfolioData))
                .rejects
                .toThrow('Portifolio already exists');
        });

        it('should throw an error if creating portfolio fails', async () => {
            const portfolioData = { title: 'Portfolio 1', description: 'Description of portfolio 1' };

            // Simulate an error during saving
            Portfolio.findOne.mockResolvedValue(null);
            Portfolio.prototype.save.mockRejectedValue(new Error('Save failed'));

            await expect(portfolioRepository.create(portfolioData))
                .rejects
                .toThrow('Failed to create portfolio. Please check your input.');
        });
    });

    // Test for findAll method
    describe('findAll', () => {
        it('should return all portfolios with pagination', async () => {
            const page = 1;
            const limit = 10;
            const mockPortfolios = [{ _id: '123', title: 'Portfolio 1', description: 'Description' }];
            const totalItems = 1;

            // Simulate find and countDocuments operations
            Portfolio.find.mockResolvedValue(mockPortfolios);
            Portfolio.countDocuments.mockResolvedValue(totalItems);

            const result = await portfolioRepository.findAll(page, limit);

            expect(result).toEqual(mockPortfolios);
            expect(Portfolio.find).toHaveBeenCalledWith(expect.objectContaining({}));
            expect(Portfolio.countDocuments).toHaveBeenCalled();
        });

        it('should throw an error if fetching portfolios fails', async () => {
            const page = 1;
            const limit = 10;

            // Simulate failure of find and countDocuments
            Portfolio.find.mockRejectedValue(new Error('Find failed'));
            Portfolio.countDocuments.mockRejectedValue(new Error('Count failed'));

            await expect(portfolioRepository.findAll(page, limit))
                .rejects
                .toThrow('Failed to fetch portfolios. Please try again later.');
        });
    });

    // Test for findById method
    describe('findById', () => {
        it('should return portfolio if found by ID', async () => {
            const mockPortfolio = { _id: '123', title: 'Portfolio 1', description: 'Description' };

            // Simulate finding a portfolio by ID
            Portfolio.findById.mockResolvedValue(mockPortfolio);

            const result = await portfolioRepository.findById('123');

            expect(result).toEqual(mockPortfolio);
            expect(Portfolio.findById).toHaveBeenCalledWith('123');
        });

        it('should throw an error if portfolio is not found', async () => {
            // Simulate portfolio not being found
            Portfolio.findById.mockResolvedValue(null);

            await expect(portfolioRepository.findById('123'))
                .rejects
                .toThrow('Portfolio not found.');
        });
    });

    // Test for count method
    describe('count', () => {
        it('should return the total count of portfolios', async () => {
            const totalPortfolios = 5;

            // Simulate countDocuments operation
            Portfolio.countDocuments.mockResolvedValue(totalPortfolios);

            const result = await portfolioRepository.count();

            expect(result).toBe(totalPortfolios);
            expect(Portfolio.countDocuments).toHaveBeenCalled();
        });

        it('should throw an error if counting portfolios fails', async () => {
            // Simulate countDocuments failure
            Portfolio.countDocuments.mockRejectedValue(new Error('Count failed'));

            await expect(portfolioRepository.count())
                .rejects
                .toThrow('Failed to count portfolios. Please try again later.');
        });
    });

    // Test for updateById method
    describe('updateById', () => {
        it('should update the portfolio by ID if found', async () => {
            const id = '123';
            const updateData = { title: 'Updated Portfolio' };
            const updatedPortfolio = { _id: '123', ...updateData };

            // Simulate finding and updating the portfolio
            Portfolio.findByIdAndUpdate.mockResolvedValue(updatedPortfolio);

            const result = await portfolioRepository.updateById(id, updateData);

            expect(result).toEqual(updatedPortfolio);
            expect(Portfolio.findByIdAndUpdate).toHaveBeenCalledWith(id, updateData, { new: true });
        });

        it('should throw an error if portfolio to update is not found', async () => {
            const id = '123';
            const updateData = { title: 'Updated Portfolio' };

            // Simulate portfolio not found
            Portfolio.findByIdAndUpdate.mockResolvedValue(null);

            await expect(portfolioRepository.updateById(id, updateData))
                .rejects
                .toThrow('Portfolio not found.');
        });
    });

    // Test for deleteById method
    describe('deleteById', () => {
        it('should delete the portfolio by ID if found', async () => {
            const id = '123';
            const mockDeletedPortfolio = { _id: '123', title: 'Portfolio 1', description: 'Description' };

            // Simulate deleting the portfolio
            Portfolio.findByIdAndDelete.mockResolvedValue(mockDeletedPortfolio);

            const result = await portfolioRepository.deleteById(id);

            expect(result).toEqual(mockDeletedPortfolio);
            expect(Portfolio.findByIdAndDelete).toHaveBeenCalledWith(id);
        });

        it('should throw an error if portfolio to delete is not found', async () => {
            const id = '123';

            // Simulate portfolio not found
            Portfolio.findByIdAndDelete.mockResolvedValue(null);

            await expect(portfolioRepository.deleteById(id))
                .rejects
                .toThrow('Portfolio not found.');
        });

        it('should throw an error if deleting portfolio fails', async () => {
            const id = '123';

            // Simulate error during deletion
            Portfolio.findByIdAndDelete.mockRejectedValue(new Error('Delete failed'));

            await expect(portfolioRepository.deleteById(id))
                .rejects
                .toThrow('Failed to delete portfolio. Please try again later.');
        });
    });
});
