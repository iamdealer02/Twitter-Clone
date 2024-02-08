const express = require("express");
const router = express.Router();
const profileServices = require('../services/profile.services');


router.get('/:username', profileServices.getUserProfile);
router.post('/follow/:followedUserId', profileServices.followUser);
router.get('/:username/followers', profileServices.getFollowers);
router.get('/:username/followings', profileServices.getFollowings);


module.exports = router;