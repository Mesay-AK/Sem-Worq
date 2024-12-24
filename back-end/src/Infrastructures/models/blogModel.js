const mongoose = require('mongoose');

const CommentSchema = new mongoos.Schema({
    email: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
})
const BlogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    tags: { type: [String], default: [] },
    comments: {CommentSchema}, 
    liked: [String], 
    likeCount: { type: Number, default: 0 }, 
    disliked: [String],   
    dislikeCount: { type: Number, default: 0 },
    status:{type: String, required: true},
    createdAt: { type: Date, default: Date.now },
    updatedAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Blog', BlogSchema);
