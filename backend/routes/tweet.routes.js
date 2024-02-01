const express = require("express");
const router = express.Router();
const tweetServices = require('../services/tweet.services');

router.post('/addTweet', tweetServices.createTweet );
module.exports = router;