class TestimonialController {
    constructor(usecase){
        this.testimonialUseCase = usecase;
    }
    async createTestimonial(req, res) {
        try {
            const testimonialData = req.body;
            const testimonial = await this.testimonialUseCase.createTestimonial(testimonialData);
            res.status(201).json({
                message: 'Testimonial created successfully.',
                testimonial,
            });
        } catch (error) {
            console.error("Error in TestimonialController.createTestimonial:", error);
            res.status(400).json({ error: error.message });
        }
    }

    async listTestimonials(req, res) {
        try {
            const filters = {};
            if (req.query.rating) {
                filters.rating = req.query.rating;
            }
            if (req.query.name) {
                filters.name = req.query.name;
            }

            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;

            const result = await this.testimonialUseCase.listTestimonials(filters, page, limit);
            res.json(result);
        } catch (error) {
            console.error("Error in TestimonialController.listTestimonials:", error);
            res.status(400).json({ error: error.message });
        }
    }

    async updateTestimonial(req, res) {
        try {
            const { id } = req.params;
            const testimonialData = req.body;
            const updatedTestimonial = await this.testimonialUseCase.updateTestimonial(id, testimonialData);
            res.json({ message: 'Testimonial updated successfully.', testimonial: updatedTestimonial });
        } catch (error) {
            console.error("Error in TestimonialController.updateTestimonial:", error);
            res.status(400).json({ error: error.message });
        }
    }

    async deleteTestimonial(req, res) {
        try {
            const { id } = req.params;
            await this.testimonialUseCase.deleteTestimonial(id);
            res.json({ message: 'Testimonial deleted successfully.' });
        } catch (error) {
            console.error("Error in TestimonialController.deleteTestimonial:", error);
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new TestimonialController();
