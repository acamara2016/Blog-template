const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);

router.post('/signup', authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/profile',authController.getProfile);

router.get('/user/:id', authController.getUser);

router.post('/follow', authController.postFollow);

router.post('/unfollow', authController.postUnFollow);

router.post('/message', authController.postMessage);

module.exports = router;