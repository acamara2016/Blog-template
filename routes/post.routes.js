const express = require('express');
const router = express.Router();
const postController = require('../controllers/post');

router.get('/', postController.getIndex);
router.get('/post/:id', postController.getPostById);
router.get('/new-post', postController.getAddPost);
router.post('/add-post', postController.postPost);
router.get('/edit/:id', postController.getPostEdit);
router.post('/comment', postController.postComment);
router.post('/like', postController.postLike);
module.exports = router;