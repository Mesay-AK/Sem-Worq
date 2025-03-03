const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    company:{type: String, required: true},
    image: { data: Buffer, contentType: String},
    content: { type: String, required: true},
    visibility: { type: String, enum: ['public', 'private'], required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Testimonial', TestimonialSchema);
