const express = require('express');
const router = express.Router();
const postController = require('../controllers/post');

router.get('/', postController.getIndex);
router.get('/c/:category', postController.getCategories);
router.get('/post/:id', postController.getPostById);
router.get('/new-post', postController.getAddPost);
router.post('/add-post', postController.postPost);
router.get('/edit/:id', postController.getPostEdit);
router.post('/comment', postController.postComment);
router.get('/about', postController.getAbout);
router.post('/like', postController.postLike);
router.get('/doc', postController.getDocumentation);
router.get('/write-post', postController.getWritePost);
module.exports = router;