const Portfolio = require('../../Infrastructures/models/portfolioModel');
const PortfolioRepository = require('../../Repositories/portfolioRepo');

jest.mock('../../Infrastructures/models/portfolioModel'); // Mock the Mongoose model

describe('PortfolioRepository', () => {
    let portfolioRepository;

    beforeEach(() => {
        portfolioRepository = new PortfolioRepository();
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a new portfolio if it does not already exist', async () => {
            const portfolioData = { title: 'Portfolio 1', description: 'Description of portfolio 1' };
            const mockPortfolio = { _id: '123', ...portfolioData };

            Portfolio.findOne.mockResolvedValue(null); // Simulating that the portfolio doesn't exist
            Portfolio.prototype.save.mockResolvedValue(mockPortfolio); // Simulating successful save

            const result = await portfolioRepository.create(portfolioData);

            expect(result).toEqual(mockPortfolio);
            expect(Portfolio.findOne).toHaveBeenCalledWith({ title: portfolioData.title });
            expect(Portfolio.prototype.save).toHaveBeenCalled();
        });

        it('should throw an error if portfolio already exists', async () => {
            const portfolioData = { title: 'Portfolio 1', description: 'Description of portfolio 1' };

            Portfolio.findOne.mockResolvedValue(true); // Simulating portfolio exists

            await expect(portfolioRepository.create(portfolioData))
                .rejects
                .toThrow('Portfolio already exists');
        });

        it('should throw an error if creating portfolio fails', async () => {
            const portfolioData = { title: 'Portfolio 1', description: 'Description of portfolio 1' };

            Portfolio.findOne.mockResolvedValue(null);
            Portfolio.prototype.save.mockRejectedValue(new Error('Save failed'));

            await expect(portfolioRepository.create(portfolioData))
                .rejects
                .toThrow('Failed to create portfolio. Please check your input.');
        });
    });

    describe('findAll', () => {
        it('should return all portfolios with pagination', async () => {
            const page = 1;
            const limit = 10;
            const mockPortfolios = [{ _id: '123', title: 'Portfolio 1', description: 'Description' }];
            
            Portfolio.find.mockReturnValue({
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                sort: jest.fn().mockResolvedValue(mockPortfolios),
            });

            const result = await portfolioRepository.findAll(page, limit);

            expect(result).toEqual(mockPortfolios);
            expect(Portfolio.find).toHaveBeenCalled();
        });

        it('should throw an error if fetching portfolios fails', async () => {
            const page = 1;
            const limit = 10;

            Portfolio.find.mockImplementation(() => ({
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                sort: jest.fn().mockRejectedValue(new Error('Find failed')),
            }));

            await expect(portfolioRepository.findAll(page, limit))
                .rejects
                .toThrow('Failed to fetch portfolios. Please try again later.');
        });
    });

    describe('findById', () => {
        it('should return portfolio if found by ID', async () => {
            const mockPortfolio = { _id: '123', title: 'Portfolio 1', description: 'Description' };

            Portfolio.findById.mockResolvedValue(mockPortfolio);

            const result = await portfolioRepository.findById('123');

            expect(result).toEqual(mockPortfolio);
            expect(Portfolio.findById).toHaveBeenCalledWith('123');
        });

        it('should throw an error if portfolio is not found', async () => {
            Portfolio.findById.mockResolvedValue(null);

            await expect(portfolioRepository.findById('123'))
                .rejects
                .toThrow('Portfolio not found.');
        });

        it('should throw a general error if the query fails', async () => {
            Portfolio.findById.mockRejectedValue(new Error('Database error'));

            await expect(portfolioRepository.findById('123'))
                .rejects
                .toThrow('Failed to fetch portfolio.');
        });
    });

    describe('count', () => {
        it('should return the total count of portfolios', async () => {
            const totalPortfolios = 5;

            Portfolio.countDocuments.mockResolvedValue(totalPortfolios);

            const result = await portfolioRepository.count();

            expect(result).toBe(totalPortfolios);
            expect(Portfolio.countDocuments).toHaveBeenCalled();
        });

        it('should throw an error if counting portfolios fails', async () => {
            Portfolio.countDocuments.mockRejectedValue(new Error('Count failed'));

            await expect(portfolioRepository.count())
                .rejects
                .toThrow('Failed to count portfolios. Please try again later.');
        });
    });

    describe('updateById', () => {
        it('should update the portfolio by ID if found', async () => {
            const id = '123';
            const updateData = { title: 'Updated Portfolio' };
            const updatedPortfolio = { _id: '123', ...updateData };

            Portfolio.findByIdAndUpdate.mockResolvedValue(updatedPortfolio);

            const result = await portfolioRepository.updateById(id, updateData);

            expect(result).toEqual(updatedPortfolio);
            expect(Portfolio.findByIdAndUpdate).toHaveBeenCalledWith(id, updateData, { new: true });
        });

        it("should throw an error if portfolio to update is not found", async () => {
            Portfolio.findByIdAndUpdate.mockResolvedValue(null); 
            await expect(portfolioRepository.updateById("123", {}))
                .rejects
                .toThrow("Portfolio not found."); 
        });


        it('should throw an error if updating fails', async () => {
            Portfolio.findByIdAndUpdate.mockRejectedValue(new Error('Update failed'));

            await expect(portfolioRepository.updateById('123', { title: 'New Title' }))
                .rejects
                .toThrow('Failed to update portfolio. Please try again later.');
        });
    });

    describe('deleteById', () => {
        it('should delete the portfolio by ID if found', async () => {
            const id = '123';
            const mockDeletedPortfolio = { _id: '123', title: 'Portfolio 1', description: 'Description' };

            Portfolio.findByIdAndDelete.mockResolvedValue(mockDeletedPortfolio);

            const result = await portfolioRepository.deleteById(id);

            expect(result).toEqual(mockDeletedPortfolio);
            expect(Portfolio.findByIdAndDelete).toHaveBeenCalledWith(id);
        });

        it("should throw an error if portfolio to delete is not found", async () => {
            Portfolio.findByIdAndDelete.mockResolvedValue(null); 

            await expect(portfolioRepository.deleteById("123"))
                .rejects
                .toThrow("Portfolio not found."); 
        });


        it('should throw an error if deleting fails', async () => {
            Portfolio.findByIdAndDelete.mockRejectedValue(new Error('Delete failed'));

            await expect(portfolioRepository.deleteById('123'))
                .rejects
                .toThrow('Failed to delete portfolio. Please try again later.');
        });
    });
});
