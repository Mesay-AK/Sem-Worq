// repositories/BlogRepository.js
const BlogModel = require('../Infrastructures/models/blogModel');

class BlogRepository {
    async create(blogData) {
        const blog = new BlogModel(blogData);
        return await blog.save();
    }

    async update(id, updateData) {
        updateData.updatedAt = new Date();
        return await BlogModel.findByIdAndUpdate(id, updateData, { new: true });
    }

    async delete(id) {
    try{
        const deletedBlog = await BlogModel.findByIdAndDelete(id);
        if (!deletedBlog) {
        throw new Error('Blog not found');
        }
        console.log("repository : ", deletedBlog)
        return deletedBlog;
    } catch (err) {
    console.error('Error deleting blog in repo:', err);
    throw new Error('Error deleting blog');
  } 
        
    }

    async findById(id) {
        return await BlogModel.findById(id);
    }

    async findAll(filters = {}, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        return await BlogModel.find(filters)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
    }

    async count(filters = {}) {
        return await BlogModel.countDocuments(filters);
    }
}

module.exports = BlogRepository;
