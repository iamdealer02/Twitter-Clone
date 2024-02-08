const express = require("express");
const router = express.Router();
const searchService = require('../services/search.services');

router.get('/', searchService.searchUsers );
module.exports = router;