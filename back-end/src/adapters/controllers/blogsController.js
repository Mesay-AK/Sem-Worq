const mongoose = require('mongoose')
const BlogEntity = require('../../Domain/blogEntity');
class BlogController {
    constructor(blogRepository) {
        this.blogRepository = blogRepository;
    }

    async createBlog(req, res) {
        try {
            const {data} = req.body
            const blogEntity = new BlogEntity(data);
            blogEntity.validate();
            const blog = await this.blogRepository.create(blogEntity);
            res.status(201).json(blog);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateBlog(req, res) {
        try {
            const {id} = req.params.id;
            const {data} = req.body;
            const existingBlog = await this.blogRepository.findById(id);
            if (!existingBlog) {
                throw new Error("Blog not found");
            }

            const blogEntity = new BlogEntity({ ...existingBlog.toObject(), ...data });
            blogEntity.validateOnUpdate();

            const updatedBlog = await this.blogRepository.update(id, updateData);

            res.json(updatedBlog);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async deleteBlog(req, res) {
        try {
        
            const { id } = req.params;

            if (!mongoose.isValidObjectId(id))  {
            console.error("Invalid ObjectId format for blogId:", id);
                return res.status(400).json({ message: 'Invalid blog ID' });
            }

            const existingBlog = await this.blogRepository.findById(id);
            if (!existingBlog) {
                throw new Error("Blog not found");
            }
            const deletedBlog =  await this.blogRepository.delete(id);

            if (!deletedBlog){
                console.log("Document with blogId not found:", id);
                throw new Error("Blog not deleted.")
            }
            
            res.status(200).json({ message: 'Blog deleted successfully', deletedBlog });

        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getBlog(req, res) {
        try {
            const {id} = req.id;
            const blog = await this.blogRepository.findById(id);
            if (!blog) {
                throw new Error("Blog not found");
            }

            res.json(blog);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

async listBlogsAdmin(req, res){
    try {
        const filters = {};

        if (req.user.role !== 'admin') {
            filters.status = 'published';
        }
        if (req.query.status && req.user.role === 'admin') {
            filters.status = req.query.status;
        }
        if (req.query.author) {
            filters.author = req.query.author;
        }
        if (req.query.tags) {
            filters.tags = { $in: req.query.tags.split(',') };
        }

        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;

        const blogs = await this.blogRepository.findAll(filters, page, limit);
        const total = await this.blogRepository.count(filters);

        const result = {
            blogs,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };

        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async listBlogs(req, res) {
    try {
        const filters = {};

        filters.status = 'published';
        
        if (req.query.author) {
            filters.author = req.query.author;
        }
        if (req.query.tags) {
            filters.tags = { $in: req.query.tags.split(',') };
        }

        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;

        const blogs = await this.blogRepository.findAll(filters, page, limit);
        const total = await this.blogRepository.count(filters);

        const result = {
            blogs,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };

        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


    async addComment(req, res) {
        try {
            const { blogId } = req.params.id;
            const { email, content } = req.body;

            const commentData = new CommentEntity({blogId, email, content});
            CommentEntity.validateForComment();

            const updatedBlog = await this.blogRepository.addComment(blogId, {email, content});

            if (!updatedBlog) {
                throw new Error("Blog not found or comment could not be added.");
            }

            res.status(200).json(updatedBlog);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async removeComment(req, res) {
        try {
            const { blogId, commentId } = req.params;

            const updatedBlog = await this.blogRepository.removeComment(blogId, commentId);
            if (!updatedBlog) {
                throw new Error("Blog not found or comment could not be removed.");
            }
            res.status(200).json(updatedBlog);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async addLike(req, res) {
        try {
            const ipAddress = req.headers['x-forwarded-for'] || req.ip;  // 
            const { blogId } = req.body;

            const updatedBlog = await this.blogRepository.addFeedback(blogId, ipAddress, liked);

            res.status(200).json({ message: "Like added successfully", data: updatedBlog });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async addDislike(req, res) {
        try {
            const ipAddress = req.headers['x-forwarded-for'] || req.ip;  
            const { blogId } = req.body;

            const updatedBlog = await this.blogRepository.addFeedback(blogId, ipAddress, disliked);

            res.status(200).json({ message: "Dislike added successfully", data: updatedBlog });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getComments(req, res) {
        try {
            const { blogId } = req.params;

            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;

            const {comments, total} = await this.blogRepository.getComment(blogId, page, limit);
            const result = {
                comments: comments,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };

            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getLikes(req, res) {
        try {
            const { blogId } = req.params;
            const likes = await this.blogRepository.getLikes(blogId);
            res.status(200).json({ count: likes.length, likes });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getDislikes(req, res) {
        try {
            const { blogId } = req.params;
            const dislikes = await this.blogRepository.getDislikes(blogId);
            res.status(200).json({ count: dislikes.length, dislikes });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

}

module.exports = BlogController;
