const express = require("express");
const router = express.Router();
const settingsServices = require ('../services/settings.services')

router.post('/changePassword/:username', settingsServices.changePassword );

module.exports = router;