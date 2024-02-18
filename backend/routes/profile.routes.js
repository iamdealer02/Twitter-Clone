const express = require("express");

const profileServices = require('../services/profile.services');
const profileTweetServices = require('../services/profile.tweet.services');
const multer = require('multer');


const router = express.Router();

router.get('/:username', profileServices.getUserProfile);
router.get('/posts/:username', profileTweetServices.viewPosts);
router.get('/replies/:username', profileTweetServices.viewReplies);
router.get('/likes/:username', profileTweetServices.viewLikes);
router.get('/media/:username', profileTweetServices.viewMedia);



router.post('/follow/:followedUserId', profileServices.followUser);
router.get('/:username/followers', profileServices.getFollowers);
router.get('/:username/following', profileServices.getFollowings);
router.post('/edit/:username', multer().array('images', 2), profileServices.editUserProfile);

router.post('/addBookmark/:bookmarks', profileServices.postBookmarks);
router.get('/bookmarks/:username', profileServices.getBookmarks);

router.get('/recommended/users', profileServices.recommendedAccounts);

router.post('/poll/vote/:tweetId/:optionId', profileServices.voteInPoll);

module.exports = router;
