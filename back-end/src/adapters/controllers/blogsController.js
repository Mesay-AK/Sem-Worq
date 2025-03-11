const mongoose = require("mongoose");
const BlogEntity = require("../../Domain/blogEntity");
// const CommentEntity = require("../../Domain/commentEntity");

class BlogController {
    constructor(blogRepository) {
        this.blogRepository = blogRepository;
    }

            async createBlog(req, res) {
            try {
                const { title, content, author, tags, status } = req.body;
                const image = req.file ? req.file.buffer : null;

                if (!title || !content || !author) {
                    return res.status(400).json({ error: "Title, content, and author are required." });
                }

                if (content.length < 10) {
                    return res.status(400).json({ error: "Blog content must be at least 10 characters long." });
                }

                const blogEntity = new BlogEntity({ title, content, author, tags, status, image });

                try {
                    blogEntity.validate();
                } catch (validationError) {
                    return res.status(400).json({ error: validationError.message });
                }

                const blog = await this.blogRepository.create(blogEntity);
                res.status(201).json(blog);
            } catch (error) {
                console.error("Create blog error:", error.message);
                res.status(400).json({ error: error.message });
            }
        }


        async updateBlog(req, res) {
            try {
                const { id } = req.params;
                if (!mongoose.isValidObjectId(id)) {
                    return res.status(400).json({ error: "Invalid blog ID." });
                }

                const { title, content, author, tags, status } = req.body;
                const image = req.file ? req.file.buffer : undefined;

                const existingBlog = await this.blogRepository.findById(id);
                if (!existingBlog) {
                    return res.status(404).json({ error: "Blog not found." });
                }

                const updatedData = { title, content, author, tags, status };
                if (image) updatedData.image = image;

                const updatedBlog = await this.blogRepository.update(id, updatedData);
                res.status(200).json(updatedBlog);
            } catch (error) {
                res.status(400).json({ error: error.message });
            }
        }

        async deleteBlog(req, res) {
            try {
                const { id } = req.params;
                if (!mongoose.isValidObjectId(id)) {
                    return res.status(400).json({ error: "Invalid blog ID." });
                }

                const deletedBlog = await this.blogRepository.delete(id);
                if (!deletedBlog) {
                    return res.status(404).json({ error: "Blog not found." });
                }

                res.status(200).json({ message: "Blog deleted successfully." });
            } catch (error) {
                res.status(400).json({ error: error.message });
            }
        }

        async getBlog(req, res) {
            try {
                const { id } = req.params;
                if (!mongoose.isValidObjectId(id)) {
                    return res.status(400).json({ error: "Invalid blog ID." });
                }

                const blog = await this.blogRepository.findById(id);
                if (!blog) {
                    return res.status(404).json({ error: "Blog not found." });
                }

                res.status(200).json(blog);
            } catch (error) {
                res.status(400).json({ error: error.message });
            }
        }

        async addComment(req, res) {
            try {
                const { blogId } = req.params;
                const { email, content } = req.body;

                if (!mongoose.isValidObjectId(blogId)) {
                    return res.status(400).json({ error: "Invalid blog ID." });
                }

                const updatedBlog = await this.blogRepository.addComment(blogId, { email, content });

                if (!updatedBlog) {
                    return res.status(404).json({ error: "Blog not found or comment could not be added." });
                }

                res.status(200).json(updatedBlog);
            } catch (error) {
                res.status(400).json({ error: error.message });
            }
        }
    }

    module.exports = BlogController;
