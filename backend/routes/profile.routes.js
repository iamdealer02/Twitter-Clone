const express = require("express");
const router = express.Router();
const profileServices = require('../services/profile.services');
const profileTweetServices = require('../services/profile.tweet.services')


router.get('/:username', profileServices.getUserProfile);
router.post('/edit/:username', profileServices.editUserProfile);
router.post('/addBookmark/:bookmarks', profileServices.postBookmarks);
router.get('/bookmarks/:username', profileServices.getBookmarks)
router.get('/viewTweets/:username', profileTweetServices.viewUserTweets)


module.exports = router;
