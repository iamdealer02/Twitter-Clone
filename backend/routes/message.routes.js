const express = require("express");
const router = express.Router();
const chatServices = require('../services/chat.services');

router.post('/save/:user2', chatServices.saveChat );
router.get('/get/:user2', chatServices.getChat );
router.get('/', chatServices.getAllChat );
router.get('/validate/:receiver', chatServices.isReceiverValid );
module.exports = router; 