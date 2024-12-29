// usecases/BlogUseCase.js
const BlogEntity = require('../Domain/blogEntity');

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
}

module.exports = BlogUseCase;
