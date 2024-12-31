const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: { type: [String], default: [] },
    image: { type: Buffer, required: true},
    visibility: { type: String, enum: ['public', 'private'], required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);
