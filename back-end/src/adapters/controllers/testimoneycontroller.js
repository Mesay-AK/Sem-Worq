const TestimonialEntity = require('../../Domain/testimoneyEntity');


class TestimonialController {
    constructor(repository){
        this.testimoinialRepository = repository;
    }
    async createTestimonial(req, res) {
        try {
            const { name, email, content, company } = req.body;
            const image = req.file ? req.file.buffer : null; 

            const testimonialData = { name, email, content, company, image };
            const testimonialEntity = new TestimonialEntity(testimonialData);
            testimonialEntity.validate();

            const testimonial = await this.testimonialRepository.create(testimonialEntity);
            res.status(201).json({ message: "Testimonial created successfully.", testimonial });
        } catch (error) {
            console.error("Error in TestimonialController.createTestimonial:", error);
            res.status(400).json({ error: error.message });
        }
    }

    // Retrieve a Testimonial (including Image)
    async getTestimonialById(req, res) {
        try {
            const { id } = req.params;
            const testimonial = await this.testimonialRepository.findById(id);

            if (!testimonial) {
                return res.status(404).json({ error: "Testimonial not found" });
            }

            // Convert image buffer to Base64
            const imageBase64 = testimonial.image
                ? `data:image/jpeg;base64,${testimonial.image.toString("base64")}`
                : null;

            res.json({
                ...testimonial.toObject(),
                image: imageBase64 // Send image as a Base64 string
            });
        } catch (error) {
            console.error("Error retrieving testimonial:", error);
            res.status(500).json({ error: "Failed to retrieve testimonial" });
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

            const testimonies = await this.testimoinialRepository.findAll(filters, page, limit);
            const total = await this.testimoinialRepository.count(filters);

            const result = {
                testimonials: testimonies,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
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

        if (req.file) {
            testimonialData.image = req.file.buffer; 
        }

        const testimonialEntity = new TestimonialEntity(testimonialData);
        testimonialEntity.validateOnUpdate();

        const updatedTestimonial = await this.testimoinialRepository.update(id, testimonialData);

        res.json({ message: 'Testimonial updated successfully.', testimonial: updatedTestimonial });
    } catch (error) {
        console.error("Error in TestimonialController.updateTestimonial:", error);
        res.status(400).json({ error: error.message });
    }
}


    async deleteTestimonial(req, res) {
        try {
            const { id } = req.params;
            const deletedTestimony = await this.testimoinialRepository.delete(id);
            res.status(200).json({ message: 'Testimonial deleted successfully.', deleted: deletedTestimony });
        } catch (error) {
            console.error("Error in TestimonialController.deleteTestimonial:", error);
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = TestimonialController;
