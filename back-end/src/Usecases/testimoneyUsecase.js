const TestimonialEntity = require('../Domain/testimoneyEntity');

class TestimonialUseCase {
    constructor(repository){
        this.testimoinialRepository = repository;
    }
    async createTestimonial(testimonialData) {
        try {
            const testimonialEntity = new TestimonialEntity(testimonialData);
            testimonialEntity.validate();
            
            const result = await this.testimoinialRepository.create(testimonialData);
            return result;

        } catch (error) {
            console.error("Error in TestimonialUseCase.createTestimonial:", error);
            throw error;
        }
    }

    async listTestimonials(filters = {}, page = 1, limit = 10) {
        try {
            const result = await this.testimoinialRepository.findAll(filters, page, limit);
            const total = await this.testimoinialRepository.count(filters);

            return {
                testimonials: result,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            console.error("Error in TestimonialUseCase.listTestimonials:", error);
            throw new Error("Failed to list testimonials.");
        }
    }

    async updateTestimonial(id, testimonialData) {
        try {
            const testimonialEntity = new TestimonialEntity(testimonialData);
            testimonialEntity.validateOnUpdate();
            const result = await this.testimoinialRepository.update(id, testimonialData);
            return result;
        } catch (error) {
            console.error("Error in TestimonialUseCase.updateTestimonial:", error);
            throw new Error("Failed to update testimonial.");
        }
    }

    async deleteTestimonial(id) {
        try {
            await this.testimoinialRepository.delete(id);
        } catch (error) {
            console.error("Error in TestimonialUseCase.deleteTestimonial:", error);
            throw new Error("Failed to delete testimonial.");
        }
    }
}

module.exports =  TestimonialUseCase;
