const express = require("express");
const router = express.Router();
const authServices = require('../services/auth.services');

router.post('/register', authServices.register );
router.post('/login', authServices.login);
router.get('/logout', authServices.logout);

module.exports = router;