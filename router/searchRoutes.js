const express = require('express');
const searchController = require('../controller/searchController');
const { searchValidation } = require('../validation/searchValidation');

const router = express.Router();


router.post("/", searchValidation, searchController)


module.exports = router;