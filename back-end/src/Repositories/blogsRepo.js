const BlogModel = require('../Infrastructures/models/blogModel');

class BlogRepository {
    async create(blogData) {
        const blogExists = await BlogModel.findOne(blogData);

        if (blogExists){
            throw new Error("Blog already Exists")
        }
        const blog = new BlogModel(blogData);
        return await blog.save();
    }

    async update(id, updateData) {

        return await BlogModel.findByIdAndUpdate(id, updateData, { new: true });
    }

    async delete(id) {
        const deletedBlog = await BlogModel.findByIdAndDelete(id);
        if (!deletedBlog) {
            throw new Error("Blog not found");  
        }
        return deletedBlog;

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

    async addComment(blogId, commentData) {
        return await BlogModel.findByIdAndUpdate(blogId, 
            { $push: { comments: commentData } }, 
            { new: true });
    }

    async removeComment(blogId, commentId) {
        return await BlogModel.findByIdAndUpdate(blogId, 
            { $pull: { comments: { _id: commentId } } }, 
            { new: true });
    }
    async getComments(blogID, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const comments = await BlogModel.findById(blogId).select('comments').skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        if (!blog) {
            throw new Error("Comments not found.");
        }
        const total = await BlogModel.findById(blogID).select('comments').countDocuments();

        return {comments, total};
    }

    async addFeedback(blogID, ipAddress, feedback){
        const blog = await BlogModel.findById(blogID);
        if (!blog) {
                throw new Error("Blog not found.");
            }

        if (!blog.feedback) {
                blog.feedback = [];
            }

        if (blog.feedback.includes(ipAddress)){
            throw new Error(`You have already ${feedback}`)
        }

        blog.feedback.push(ipAddress);
        if (feedback == "liked"){
            blog.likeCount += 1;

            return await this.updateFeedback(blogID, { liked, likeCount });

        }else{
            blog.dislikeCount += 1;
            return await this.updateFeedback(blogID,{disliked, dislikeCount})
        }
    }
    async updateFeedback(blogId, feedback){
        
        const updatedFeedback = await BlogModel.findByIdAndUpdate(blogId, feedback, {new: true})

        if (!updatedFeedback){
            throw new Error("Error while updating feedback")
        }
        
        return updatedFeedback

    }

    async getLikes(blogId) {
        const blog = await BlogModel.findById(blogId).select('likeCount');
        if (!blog) {
            throw new Error("Blog not found.");
        }
        return blog.likeCount;
    }

    async getDislikes(blogId) {
        const blog = await BlogModel.findById(blogId).select('dislikCount');
        if (!blog) {
            throw new Error("Blog not found.");
        }
        return blog.dislikeCount;
    }

}

module.exports = BlogRepository;
