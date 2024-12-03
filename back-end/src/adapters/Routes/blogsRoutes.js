// routes/blogRoutes.js
const express = require('express');
const BlogController = require('../../adapters/controllers/blogsController');
const BlogUseCase = require('../../Usecases/blogsUsecase');
const BlogRepository = require('../../Repositories/blogsRepo');

const router = express.Router();

const blogRepository = new BlogRepository();
const blogUseCase = new BlogUseCase(blogRepository);
const blogController = new BlogController(blogUseCase);

router.post('/create', (req, res) => blogController.createBlog(req, res));
router.put('/edit:id', (req, res) => blogController.updateBlog(req, res));
router.delete('/delete/:id', (req, res) => blogController.deleteBlog(req, res));
router.get('/get/:id', (req, res) => blogController.getBlog(req, res));
router.get('/get', (req, res) => blogController.listBlogs(req, res));

module.exports = router;
