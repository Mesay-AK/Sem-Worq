const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    content: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Testimonial', TestimonialSchema);
