const mongoose = require('mongoose')
class BlogController {
    constructor(blogUseCase) {
        this.blogUseCase = blogUseCase;
    }

    async createBlog(req, res) {
        try {
            const blog = await this.blogUseCase.createBlog(req.body);
            res.status(201).json(blog);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateBlog(req, res) {
        try {

        const updatedBlog = await this.blogUseCase.updateBlog(req.params.id, req.body);
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

            const deletedBlog = await this.blogUseCase.deleteBlog(id);

            if (!deletedBlog){
                console.log("Document with blogId not found:", id);
                return res.status(404).json({message: "Blog not found"})
            }
            

            res.status(200).json({ message: 'Blog deleted successfully', deletedBlog });

        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getBlog(req, res) {
        try {
            const blog = await this.blogUseCase.getBlog(req.params.id);
            res.json(blog);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

async listBlogs(req, res) {
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

        const result = await this.blogUseCase.listBlogs(filters, page, limit);

        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


    async addComment(req, res) {
        try {
            const { blogId } = req.params;
            const { email, content } = req.body;
            const updatedBlog = await this.blogUseCase.addComment({blogId, email, content});
            res.status(200).json(updatedBlog);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async removeComment(req, res) {
        try {
            const { blogId, commentId } = req.params;
            const updatedBlog = await this.blogUseCase.removeComment(blogId, commentId);
            res.status(200).json(updatedBlog);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async addLike(req, res) {
        try {
            const ipAddress = req.headers['x-forwarded-for'] || req.ip;  // 
            const { blogId } = req.body;

            const updatedBlog = await this.blogUseCase.addFeedback(blogId, ipAddress, liked);

            res.status(200).json({ message: "Like added successfully", data: updatedBlog });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async addDislike(req, res) {
        try {
            const ipAddress = req.headers['x-forwarded-for'] || req.ip;  
            const { blogId } = req.body;

            const updatedBlog = await this.blogUseCase.addFeedback(blogId, ipAddress, disliked);

            res.status(200).json({ message: "Dislike added successfully", data: updatedBlog });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getComments(req, res) {
        try {
            const { blogId } = req.params;
            const comments = await this.blogUseCase.getComments(blogId);
            res.status(200).json(comments);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getLikes(req, res) {
        try {
            const { blogId } = req.params;
            const likes = await this.blogUseCase.getLikes(blogId);
            res.status(200).json({ count: likes.length, likes });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getDislikes(req, res) {
        try {
            const { blogId } = req.params;
            const dislikes = await this.blogUseCase.getDislikes(blogId);
            res.status(200).json({ count: dislikes.length, dislikes });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

}

module.exports = BlogController;
