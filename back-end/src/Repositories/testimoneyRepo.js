const Testimonial = require('../Infrastructures/models/testimoneyModel');

class TestimonialRepository {
    async create(testimonialData) {
        try {

            const existTestimony = await Testimonial.findOne(testimonialData);

            if (existTestimony) {
                throw new Error("Testimonial already exists");
            }

            return await testimonial.save(); 
        } catch (error) {
            console.error("Error in TestimonialRepository.create:", error);
            throw error;
        }
    }


    async findAll(filters = {}, page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            return await Testimonial.find(filters)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });

        } catch (error) {

            console.error("Error in TestimonialRepository.findAll:", error);
            throw new Error("Failed to fetch testimonials.");
        }
    }

    async count(filters = {}) {
        try {
            return await Testimonial.countDocuments(filters);
        } catch (error) {
            console.error("Error in TestimonialRepository.count:", error);
            throw new Error("Failed to count testimonials.");
        }
    }

    async findById(id) {
        try {
            return await Testimonial.findById(id);
        } catch (error) {
            console.error("Error in TestimonialRepository.findById:", error);
            throw new Error("Testimonial not found.");
        }
    }

    async update(id, updatedData) {
        try {
            const testimonial = await Testimonial.findByIdAndUpdate(id, updatedData, { new: true });
            return testimonial;
        } catch (error) {
            console.error("Error in TestimonialRepository.update:", error);
            throw new Error("Failed to update testimonial.");
        }
    }

    async delete(id) {
        try {
            await Testimonial.findByIdAndDelete(id);
        } catch (error) {
            console.error("Error in TestimonialRepository.delete:", error);
            throw new Error("Failed to delete testimonial.");
        }
    }
}

module.exports = TestimonialRepository;
