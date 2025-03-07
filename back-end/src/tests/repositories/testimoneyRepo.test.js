// testimonialRepository.test.js
const Testimonial = require('../../Infrastructures/models/testimoneyModel');
const TestimonialRepository = require('../../Repositories/testimoneyRepo');

// Mock the Testimonial model methods
jest.mock('../../Infrastructures/models/testimoneyModel');

describe('TestimonialRepository', () => {
    let testimonialRepository;

    beforeEach(() => {
        testimonialRepository = new TestimonialRepository();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test for create method
    describe('create', () => {
        it('should create a testimonial if it does not already exist', async () => {
            const testimonialData = { name: 'John Doe', message: 'Great service!' };
            const mockTestimonial = { _id: '123', ...testimonialData };

            // Simulate no existing testimonial
            Testimonial.findOne.mockResolvedValue(null);
            Testimonial.prototype.save.mockResolvedValue(mockTestimonial);

            const result = await testimonialRepository.create(testimonialData);

            expect(result).toEqual(mockTestimonial);
            expect(Testimonial.findOne).toHaveBeenCalledWith(testimonialData);
            expect(Testimonial.prototype.save).toHaveBeenCalled();
        });

        it('should throw an error if testimonial already exists', async () => {
            const testimonialData = { name: 'John Doe', message: 'Great service!' };

            // Simulate existing testimonial
            Testimonial.findOne.mockResolvedValue(true);

            await expect(testimonialRepository.create(testimonialData))
                .rejects
                .toThrow('Testimonial already exists');
        });

        it('should throw an error if creating testimonial fails', async () => {
            const testimonialData = { name: 'John Doe', message: 'Great service!' };

            // Simulate error during saving
            Testimonial.findOne.mockResolvedValue(null);
            Testimonial.prototype.save.mockRejectedValue(new Error('Save failed'));

            await expect(testimonialRepository.create(testimonialData))
                .rejects
                .toThrow('Save failed');
        });
    });

    // Test for findAll method
    describe('findAll', () => {
        it('should fetch testimonials with pagination and sorting', async () => {
            const filters = { name: 'John Doe' };
            const page = 1;
            const limit = 10;
            const mockTestimonials = [{ _id: '123', name: 'John Doe', message: 'Great service!' }];
            const skip = (page - 1) * limit;

            // Simulate fetching testimonials
            Testimonial.find.mockResolvedValue(mockTestimonials);

            const result = await testimonialRepository.findAll(filters, page, limit);

            expect(result).toEqual(mockTestimonials);
            expect(Testimonial.find).toHaveBeenCalledWith(filters);
            expect(Testimonial.find).toHaveBeenCalledWith(filters);
        });

        it('should throw an error if page or limit is less than 1', async () => {
            await expect(testimonialRepository.findAll({}, -1, 10))
                .rejects
                .toThrow('Page and limit must be greater than 0');

            await expect(testimonialRepository.findAll({}, 1, 0))
                .rejects
                .toThrow('Page and limit must be greater than 0');
        });

        it('should throw an error if fetching testimonials fails', async () => {
            const filters = { name: 'John Doe' };
            const page = 1;
            const limit = 10;

            // Simulate error during fetching
            Testimonial.find.mockRejectedValue(new Error('Find failed'));

            await expect(testimonialRepository.findAll(filters, page, limit))
                .rejects
                .toThrow('Failed to fetch testimonials.');
        });
    });

    // Test for count method
    describe('count', () => {
        it('should return the total count of testimonials', async () => {
            const filters = { name: 'John Doe' };
            const totalTestimonials = 5;

            // Simulate countDocuments operation
            Testimonial.countDocuments.mockResolvedValue(totalTestimonials);

            const result = await testimonialRepository.count(filters);

            expect(result).toBe(totalTestimonials);
            expect(Testimonial.countDocuments).toHaveBeenCalledWith(filters);
        });

        it('should throw an error if counting testimonials fails', async () => {
            const filters = { name: 'John Doe' };

            // Simulate countDocuments failure
            Testimonial.countDocuments.mockRejectedValue(new Error('Count failed'));

            await expect(testimonialRepository.count(filters))
                .rejects
                .toThrow('Failed to count testimonials.');
        });
    });

    // Test for update method
    describe('update', () => {
        it('should update testimonial if found', async () => {
            const id = '123';
            const updatedData = { message: 'Updated message' };
            const updatedTestimonial = { _id: '123', name: 'John Doe', message: 'Updated message' };

            // Simulate finding and updating testimonial
            Testimonial.findById.mockResolvedValue(updatedTestimonial);
            Testimonial.findByIdAndUpdate.mockResolvedValue(updatedTestimonial);

            const result = await testimonialRepository.update(id, updatedData);

            expect(result).toEqual(updatedTestimonial);
            expect(Testimonial.findByIdAndUpdate).toHaveBeenCalledWith(id, updatedData, { new: true });
        });

        it('should throw an error if testimonial is not found for update', async () => {
            const id = '123';
            const updatedData = { message: 'Updated message' };

            // Simulate testimonial not found
            Testimonial.findById.mockResolvedValue(null);

            await expect(testimonialRepository.update(id, updatedData))
                .rejects
                .toThrow('Testimonial not found.');
        });

        it('should throw an error if updating testimonial fails', async () => {
            const id = '123';
            const updatedData = { message: 'Updated message' };

            // Simulate error during update
            Testimonial.findById.mockResolvedValue(true);
            Testimonial.findByIdAndUpdate.mockRejectedValue(new Error('Update failed'));

            await expect(testimonialRepository.update(id, updatedData))
                .rejects
                .toThrow('Failed to update testimonial: Update failed');
        });
    });

    // Test for delete method
    describe('delete', () => {
        it('should delete the testimonial if found', async () => {
            const id = '123';
            const mockDeletedTestimonial = { _id: '123', name: 'John Doe', message: 'Great service!' };

            // Simulate testimonial being deleted
            Testimonial.findByIdAndDelete.mockResolvedValue(mockDeletedTestimonial);

            const result = await testimonialRepository.delete(id);

            expect(result).toEqual(mockDeletedTestimonial);
            expect(Testimonial.findByIdAndDelete).toHaveBeenCalledWith(id);
        });

        it('should throw an error if deleting testimonial fails', async () => {
            const id = '123';

            // Simulate error during deletion
            Testimonial.findByIdAndDelete.mockRejectedValue(new Error('Delete failed'));

            await expect(testimonialRepository.delete(id))
                .rejects
                .toThrow('Failed to delete testimonial.');
        });
    });
});
