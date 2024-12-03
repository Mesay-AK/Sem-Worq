// routes/blogRoutes.js
const express = require('express');
const BlogController = require('../controllers/BlogController');
const BlogUseCase = require('../usecases/BlogUseCase');
const BlogRepository = require('../repositories/BlogRepository');

const router = express.Router();

const blogRepository = new BlogRepository();
const blogUseCase = new BlogUseCase(blogRepository);
const blogController = new BlogController(blogUseCase);

router.post('/blogs', (req, res) => blogController.createBlog(req, res));
router.put('/blogs:id', (req, res) => blogController.updateBlog(req, res));
router.delete('/blogs:id', (req, res) => blogController.deleteBlog(req, res));
router.get('/blogs:id', (req, res) => blogController.getBlog(req, res));
router.get('/blogs', (req, res) => blogController.listBlogs(req, res));

module.exports = router;
