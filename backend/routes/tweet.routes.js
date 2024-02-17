const express = require("express");
const router = express.Router();
const tweetServices = require('../services/tweet.services');
const multer = require('multer');

router.post('/addTweet', multer().single('image'), tweetServices.createTweet);
router.get('/getTweet', tweetServices.getTweet);
router.post('/addComment/:tweetId', tweetServices.addComment);
router.post('/retweet/:ogTweetId', tweetServices.retweet);
router.post('/repost/:ogTweetId', tweetServices.repost);
router.post('/likeTweet/:tweetId', tweetServices.likeTweet);

module.exports = router;