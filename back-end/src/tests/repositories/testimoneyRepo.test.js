const TestimonialRepository = require('../../Repositories/testimoneyRepo');
const Testimonial = require('../../Infrastructures/models/testimoneyModel');

jest.mock('../../Infrastructures/models/testimoneyModel');

describe('Testimonial Repository', () => {
    let repo;

    beforeEach(() => {
        repo = new TestimonialRepository();
        jest.clearAllMocks(); // Reset mocks before each test
    });

    describe('create', () => {
        it('should create a new testimonial successfully', async () => {
            const testimonialData = { title: 'Great Service', content: 'Amazing experience!' };

            Testimonial.findOne.mockResolvedValue(null); // No existing testimonial
            Testimonial.prototype.save = jest.fn().mockResolvedValue(testimonialData);

            const result = await repo.create(testimonialData);
            expect(result).toEqual(testimonialData);
            expect(Testimonial.findOne).toHaveBeenCalledWith({ title: testimonialData.title });
            expect(Testimonial.prototype.save).toHaveBeenCalled();
        });

        it('should throw an error if the testimonial already exists', async () => {
            const testimonialData = { title: 'Great Service', content: 'Amazing experience!' };

            Testimonial.findOne.mockResolvedValue(testimonialData); // Mock existing testimonial

            await expect(repo.create(testimonialData))
                .rejects.toThrow("Testimonial with this title already exists.");
            expect(Testimonial.findOne).toHaveBeenCalledWith({ title: testimonialData.title });
        });

        it('should throw a generic error if saving fails', async () => {
            const testimonialData = { title: 'Great Service', content: 'Amazing experience!' };

            Testimonial.findOne.mockResolvedValue(null);
            Testimonial.prototype.save = jest.fn().mockRejectedValue(new Error("Database error"));

            await expect(repo.create(testimonialData))
                .rejects.toThrow("Failed to create testimonial.");
        });
    });

    describe('findAll', () => {
        it('should return all testimonials with pagination', async () => {
            const mockTestimonials = [{ title: 'Test 1' }, { title: 'Test 2' }];
            
            Testimonial.find.mockImplementation(() => ({
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                sort: jest.fn().mockResolvedValue(mockTestimonials),
            }));

            const result = await repo.findAll({}, 1, 10);
            expect(result).toEqual(mockTestimonials);
        });

        it('should throw an error if page or limit is invalid', async () => {
            await expect(repo.findAll({}, 0, 10))
                .rejects.toThrow("Page and limit must be greater than 0.");
        });

        it('should handle database errors gracefully', async () => {
            Testimonial.find.mockImplementation(() => ({
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                sort: jest.fn().mockRejectedValue(new Error("Database error")),
            }));

            await expect(repo.findAll({}, 1, 10))
                .rejects.toThrow("Failed to fetch testimonials: Database error");
        });
    });

    describe('count', () => {
        it('should return the total count of testimonials', async () => {
            Testimonial.countDocuments.mockResolvedValue(5);

            const count = await repo.count({});
            expect(count).toBe(5);
            expect(Testimonial.countDocuments).toHaveBeenCalledWith({});
        });

        it('should handle count errors', async () => {
            Testimonial.countDocuments.mockRejectedValue(new Error("Database error"));

            await expect(repo.count({}))
                .rejects.toThrow("Failed to count testimonials.");
        });
    });

    describe('update', () => {
        it('should update a testimonial successfully', async () => {
            const testimonialData = { title: 'Updated Testimonial' };
            Testimonial.findByIdAndUpdate.mockResolvedValue(testimonialData);

            const result = await repo.update("test-id", testimonialData);
            expect(result).toEqual(testimonialData);
        });

        it('should throw an error if testimonial not found', async () => {
            Testimonial.findByIdAndUpdate.mockResolvedValue(null);

            await expect(repo.update("test-id", {}))
                .rejects.toThrow("Testimonial not found.");
        });

        it('should handle database errors', async () => {
            Testimonial.findByIdAndUpdate.mockRejectedValue(new Error("Database error"));

            await expect(repo.update("test-id", {}))
                .rejects.toThrow("Failed to update testimonial.");
        });
    });

    describe('delete', () => {
        it('should delete a testimonial successfully', async () => {
            Testimonial.findByIdAndDelete.mockResolvedValue({ title: "Deleted Testimonial" });

            const result = await repo.delete("test-id");
            expect(result).toEqual({ title: "Deleted Testimonial" });
        });

        it('should throw an error if testimonial not found', async () => {
            Testimonial.findByIdAndDelete.mockResolvedValue(null);

            await expect(repo.delete("test-id"))
                .rejects.toThrow("Testimonial not found.");
        });

        it('should handle database errors', async () => {
            Testimonial.findByIdAndDelete.mockRejectedValue(new Error("Database error"));

            await expect(repo.delete("test-id"))
                .rejects.toThrow("Failed to delete testimonial.");
        });
    });
});
