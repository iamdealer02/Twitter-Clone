const express = require("express");
const router = express.Router();
const tweetServices = require('../services/tweet.services');


router.post('/addTweet', tweetServices.createTweet );
router.get('/getTweet', tweetServices.getTweet);
router.post('/addComment/:tweetId', tweetServices.addComment);
router.post('/retweet/:ogTweetId', tweetServices.retweet);
router.post('/repost/:ogTweetId', tweetServices.repost);

module.exports = router;