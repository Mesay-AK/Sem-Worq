const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    name: {type: String, required:true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin'], required: true },
    // refreshTokens: [{ type: String }],
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
});

module.exports = mongoose.model('Admin', AdminSchema);


