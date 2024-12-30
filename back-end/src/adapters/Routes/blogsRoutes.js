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

router.post('/create', authMiddleware, adminOnlyMiddleware, (req, res) => blogController.createBlog(req, res));
router.put('/edit/:blogId',authMiddleware, adminOnlyMiddleware, (req, res) => blogController.updateBlog(req, res));
router.delete('/delete/:blogId',authMiddleware, adminOnlyMiddleware, (req, res) => blogController.deleteBlog(req, res));
router.get('/get/:blogId', (req, res) => blogController.getBlog(req, res));


router.get('/get', (req, res) => blogController.listBlogs(req, res));
router.post('/addComment', (req, res) => blogController.addComment(req, res));
router.delete('/deleteComment',authMiddleware, adminOnlyMiddleware, (req, res) => blogController.removeComment(req, res))
router.get('/getComments'), (req, res) => blogController.getComments(req, res);
router.post('/like/:blogId'),(req, res) => blogController.addLike(req, res);
router.post('/dislike/:blogId'),(req, res) => blogController.addLike(req, res);
router.get('/likes'), (req, res) => blogController.getLikes(req, res);
router.get('/dislikes'), (req, res) => blogController.getDislikes(req, res);


module.exports = router;
