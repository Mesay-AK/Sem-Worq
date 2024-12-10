// routes/blogRoutes.js
const express = require('express');
const BlogController = require('../../adapters/controllers/blogsController');
const BlogUseCase = require('../../Usecases/blogsUsecase');
const BlogRepository = require('../../Repositories/blogsRepo');
const { authMiddleware, adminOnlyMiddleware } = require('../Middlewares/AuthMiddleware');


const router = express.Router();

const blogRepository = new BlogRepository();
const blogUseCase = new BlogUseCase(blogRepository);
const blogController = new BlogController(blogUseCase);

router.post('/create',authMiddleware, adminOnlyMiddleware , (req, res) => blogController.createBlog(req, res));
router.put('/edit/:id',authMiddleware, adminOnlyMiddleware , (req, res) => blogController.updateBlog(req, res));
router.delete('/delete/:id',authMiddleware, adminOnlyMiddleware , (req, res) => blogController.deleteBlog(req, res));
router.get('/get/:id',authMiddleware, adminOnlyMiddleware , (req, res) => blogController.getBlog(req, res));
router.get('/get',authMiddleware, (req, res) => blogController.listBlogs(req, res));

module.exports = router;
