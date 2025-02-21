// routes/blogRoutes.js
const express = require('express');
const BlogController = require('../../adapters/controllers/blogsController');
const BlogRepository = require('../../Repositories/blogsRepo');
const authMiddleware = require('../../adapters/Middlewares/AuthMiddleware');


const router = express.Router();

const blogRepository = new BlogRepository();
const blogController = new BlogController(blogRepository);
const Middlware = new authMiddleware(blogRepository);

router.post('/create', Middlware.authMiddleware, Middlware.adminOnlyMiddleware, (req, res) => blogController.createBlog(req, res));
router.put('/edit/:blogId',Middlware.authMiddleware, Middlware.adminOnlyMiddleware, (req, res) => blogController.updateBlog(req, res));
router.delete('/delete/:blogId',Middlware.authMiddleware, Middlware.adminOnlyMiddleware, (req, res) => blogController.deleteBlog(req, res));
router.get('/get/:blogId', (req, res) => blogController.getBlog(req, res));


router.get('/get', (req, res) => blogController.listBlogs(req, res));
router.get('/get',Middlware.authMiddleware, Middlware.adminOnlyMiddleware, (req, res) => blogController.listBlogsAdmin(req, res));

router.post('/addComment', (req, res) => blogController.addComment(req, res));
router.delete('/deleteComment/:blogId/:commentId',Middlware.authMiddleware, Middlware.adminOnlyMiddleware, (req, res) => blogController.removeComment(req, res))
router.get('/getComments/:blogId'), (req, res) => blogController.getComments(req, res);
router.post('/like/:blogId'),(req, res) => blogController.addLike(req, res);
router.post('/dislike/:blogId'),(req, res) => blogController.addLike(req, res);
router.get('/likes/:blogId'), (req, res) => blogController.getLikes(req, res);
router.get('/dislikes/blogId'), (req, res) => blogController.getDislikes(req, res);


module.exports = router;
