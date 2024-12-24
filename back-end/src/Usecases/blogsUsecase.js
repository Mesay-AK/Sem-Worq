const BlogEntity = require('../Domain/blogEntity');
const CommentEntity = require('../Domain/commentEntity');

class BlogUseCase {
    constructor(blogRepository) {
        this.blogRepository = blogRepository;
    }

    async createBlog(data) {
        const blogEntity = new BlogEntity(data);
        blogEntity.validate();
        return await this.blogRepository.create(blogEntity);
    }

    async updateBlog(id, updateData) {
        const existingBlog = await this.blogRepository.findById(id);
        if (!existingBlog) {
            throw new Error("Blog not found");
        }

        const blogEntity = new BlogEntity({ ...existingBlog.toObject(), ...updateData });
        blogEntity.validateOnUpdate();

        return await this.blogRepository.update(id, updateData);
    }

    async deleteBlog(id) {
        const existingBlog = await this.blogRepository.findById(id);
        if (!existingBlog) {
            throw new Error("Blog not found");
        }
        const deletedBlog =  await this.blogRepository.delete(id);
        console.log("usecase : ", deletedBlog)

        return deletedBlog
    }

    async getBlog(id) {
        const blog = await this.blogRepository.findById(id);
        if (!blog) {
            throw new Error("Blog not found");
        }
        return blog;
    }

    async listBlogs(filters = {}, page = 1, limit = 10) {

        const blogs = await this.blogRepository.findAll(filters, page, limit);
        const total = await this.blogRepository.count(filters);

        return {
            blogs,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async addComment(comment) {
        const commentData = new CommentEntity(comment);
        CommentEntity.validateForComment();

        const { blogId, email, content } = commentData;

        const updatedBlog = await this.blogRepository.addComment(blogId, {email, content});

        if (!updatedBlog) {
            throw new Error("Blog not found or comment could not be added.");
        }
        return updatedBlog;
    }

    async removeComment(blogId, commentId) {
        const updatedBlog = await this.blogRepository.removeComment(blogId, commentId);
        if (!updatedBlog) {
            throw new Error("Blog not found or comment could not be removed.");
        }
        return updatedBlog;
    }
    
    async addFeedback(blogID, ipAddress, feedback){
        const blog = this.blogRepository.findById(blogID);

        if (blog.feedback.includes(ipAddress)){
            throw new (`You have already ${feedback}`)
        }

        blog.feedback.push(ipAddress);
        if (feedback == "liked"){
            blog.likeCount += 1;

            return await this.blogRepository.addFeedback(blogID,{liked, likeCount})
        }else{
            blog.dislikeCount += 1;
            return await this.blogRepository.addFeedback(blogID,{disliked, dislikeCount})
        }
    }

    async getComments(blogId) {
        return await this.blogRepository.getComments(blogId);
    }

    async getLikes(blogId) {
        return await this.blogRepository.getLikes(blogId);
    }

    async getDislikes(blogId) {
        return await this.blogRepository.getDislikes(blogId);
    }

}

module.exports = BlogUseCase;
