const blogUseCase = require("../../Usecases/blogsUsecase")


const creatBlog = async(req, res) => {
    try {
        const { title, content, tags, status } = req.body;

        // Only admins can create blogs
        // if (req.user.role !== 'admin') {
        //     return res.status(403).json({ error: 'Only admins can create blogs.' });
        // }

        // Default status is 'draft' unless explicitly set
        const blogStatus = status === 'published' ? 'published' : 'draft';

        const newBlog = await this.blogUseCase.createBlog({
            title,
            content,
            tags,
            author: req.user.id, // Admin's user ID
            status: blogStatus,
        });

        res.status(201).json(newBlog);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const updateBlog = async(req, res) =>{
    try {
        const { id } = req.params.id; // Blog ID from the route
        const updatedData = req.body;

        // Only admins can update blogs
        // if (req.user.role !== 'admin') {
        //     return res.status(403).json({ error: 'Only admins can update blogs.' });
        // }

        // Update the blog
        const updatedBlog = await this.blogUseCase.updateBlog(id, updatedData);

        res.status(200).json(updatedBlog);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}



const listBlogs = async(req, res) => {
        try {
            const { status, author } = req.query;
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;

            const blogs = await this.blogUseCase.listBlogs({ status, author }, page, limit);
            res.status(200).json(blogs);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
}