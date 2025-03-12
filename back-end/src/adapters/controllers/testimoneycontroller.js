const TestimonialEntity = require('../../Domain/testimoneyEntity');

class TestimonialController {
    constructor(repository) {
        this.testimonialRepository = repository;
    }

    // Create a new Testimonial
    async createTestimonial(req, res) {
        try {
            const { name, email, content, company, visibility } = req.body;
            const image = req.file ? req.file.buffer : null;

            if (!name || !email || !content || !company) {
                console.log('Missing required fields:', { name, email, content, company, visibility });
                return res.status(400).json({
                    error: 'Missing required fields: name, email, content, and company',
                });
            }

            // Validate image type
            if (req.file && !['image/jpeg', 'image/png'].includes(req.file.mimetype)) {
                return res.status(400).json({ error: 'Invalid image format. Only JPEG and PNG allowed.' });
            }

            const testimonialData = { name, email, content, company, visibility, image };
            const testimonialEntity = new TestimonialEntity(testimonialData);
            testimonialEntity.validate(); // Validate entity

            const testimonial = await this.testimonialRepository.create(testimonialEntity);
            console.log('Testimonial created successfully:', testimonial);

            res.status(201).json({
                message: 'Testimonial created successfully.',
                testimonial,
            });
        } catch (error) {
            console.error("Error in TestimonialController.createTestimonial:", error.message, error.stack);
            res.status(400).json({ error: error.message });
        }
    }

    // Retrieve a Testimonial by ID (including Image)
    async getTestimonialById(req, res) {
        try {
            const { id } = req.params;
            const testimonial = await this.testimonialRepository.findById(id);

            if (!testimonial) {
                return res.status(404).json({ error: "Testimonial not found" });
            }

            // Ensure we handle plain objects correctly
            const testimonialObj = testimonial.toObject ? testimonial.toObject() : testimonial;
            const imageBase64 = testimonialObj.image
                ? `data:image/jpeg;base64,${testimonialObj.image.toString("base64")}`
                : null;

            res.status(200).json({
                ...testimonialObj,
                image: imageBase64
            });
        } catch (error) {
            console.error("Error retrieving testimonial:", error.message, error.stack);
            res.status(500).json({ error: "Failed to retrieve testimonial" });
        }
    }

    // List Testimonials with Pagination and Filters
    async listTestimonials(req, res) {
        try {
            const filters = {};
            if (req.query.rating) filters.rating = req.query.rating;
            if (req.query.name) filters.name = req.query.name;

            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;

            const testimonies = await this.testimonialRepository.findAll(filters, page, limit);
            const total = await this.testimonialRepository.count(filters);

            res.json({
                testimonials: testimonies,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            });
        } catch (error) {
            console.error("Error in TestimonialController.listTestimonials:", error.message, error.stack);
            res.status(400).json({ error: error.message });
        }
    }

    // Update an existing Testimonial
    async updateTestimonial(req, res) {
        try {
            const { id } = req.params;
            const testimonialData = req.body;

            // If a new image is uploaded, validate and set it in the data
            if (req.file) {
                if (!['image/jpeg', 'image/png'].includes(req.file.mimetype)) {
                    return res.status(400).json({ error: 'Invalid image format. Only JPEG and PNG allowed.' });
                }
                testimonialData.image = req.file.buffer;
            }

            const testimonialEntity = new TestimonialEntity(testimonialData);
            testimonialEntity.validateOnUpdate();

            const updatedTestimonial = await this.testimonialRepository.update(id, testimonialData);

            if (!updatedTestimonial) {
                return res.status(404).json({ error: 'Testimonial not found' });
            }

            res.status(200).json({
                message: 'Testimonial updated successfully.',
                testimonial: updatedTestimonial
            });
        } catch (error) {
            console.error("Error in TestimonialController.updateTestimonial:", error.message, error.stack);
            res.status(400).json({ error: error.message });
        }
    }

    // Delete a Testimonial by ID
    async deleteTestimonial(req, res) {
        try {
            const { id } = req.params;
            const deletedTestimony = await this.testimonialRepository.delete(id);

            if (!deletedTestimony) {
                return res.status(404).json({ error: 'Testimonial not found' });
            }

            res.status(200).json({ message: 'Testimonial deleted successfully.', deleted: deletedTestimony });
        } catch (error) {
            console.error("Error in TestimonialController.deleteTestimonial:", error.message, error.stack);
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = TestimonialController;
