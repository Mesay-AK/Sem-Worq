const mongoose = require('mongoose')
class BlogController {
    constructor(blogUseCase) {
        this.blogUseCase = blogUseCase;
    }

    async createBlog(req, res) {
        try {
            // if (!req.user || !req.user.isAdmin) {
            //     return res.status(403).json({ message: "Forbidden: Admin access only" });
            // }

            const blog = await this.blogUseCase.createBlog(req.body);
            res.status(201).json(blog);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateBlog(req, res) {
        try {
            // if (!req.user || !req.user.isAdmin) {
            //     return res.status(403).json({ message: "Forbidden: Admin access only" });
            // }

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
            console.log("controller : ",deletedBlog)

            res.status(204).json({ message: 'Blog deleted successfully', deletedBlog });

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

            // const isAdmin = req.user && req.user.role === 'admin'; 
            
            // if (!isAdmin && req.query.status && req.query.status === 'draft') {
            //     return res.status(403).json({ error: 'You are not authorized to view draft blogs.' });
            // }

            if (req.query.author) {
                filters.author = req.query.author;
            }

    
            if (req.query.status) {
                filters.status = req.query.status;
            } 
            // else if (!isAdmin) {

            //     filters.status = 'published';
            // }

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

}

module.exports = BlogController;
