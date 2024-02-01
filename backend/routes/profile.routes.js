const express = require("express");
const router = express.Router();
const profileServices = require('../services/profile.services');


router.get('/:username', profileServices.getUserProfile);


module.exports = router;