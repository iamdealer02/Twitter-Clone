const express = require("express");
const router = express.Router();
const profileServices = require('../services/profile.services');


router.get('/:username', profileServices.getUserProfile);
router.post('/poll/vote/:tweetId/:optionId', profileServices.voteInPoll);

module.exports = router;