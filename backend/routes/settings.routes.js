const express = require("express");
const router = express.Router();

const profileServices = require('../services/profile.services');
const { route } = require("./auth.routes");


router.get('/monetizationStatus/:username', profileServices.checkMonetization);
router.post('/updateMonetizationStatus', profileServices.postMonetization);


module.exports = router;