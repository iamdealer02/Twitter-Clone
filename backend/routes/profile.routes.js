const express = require("express");

const profileServices = require('../services/profile.services');
const profileTweetServices = require('../services/profile.tweet.services');



const upload = require('../middleware/multer');
const router = express.Router();


router.get('/:username', profileServices.getUserProfile);
router.post('/follow/:followedUserId', profileServices.followUser);
router.get('/:username/followers', profileServices.getFollowers);
router.get('/:username/following', profileServices.getFollowings);
router.post('/edit/:username', upload.fields([{ name: 'profile_picture', maxCount: 1}, { name: 'cover_picture', maxCount: 1}]), profileServices.editUserProfile);

router.post('/addBookmark/:bookmarks', profileServices.postBookmarks);
router.get('/bookmarks/:username', profileServices.getBookmarks)
router.get('/viewTweets/:username', profileTweetServices.viewUserTweets)


router.post('/poll/vote/:tweetId/:optionId', profileServices.voteInPoll);

module.exports = router;
