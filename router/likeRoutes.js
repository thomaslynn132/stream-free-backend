const express = require('express');
const { like, unlike, likeStatus, getLikes } = require('../controller/likeController');
const { likeValidation, unlikeValidation } = require('../validation/likeValidation');

const router = express.Router();

router.post("/like", likeValidation, like);
router.post("/unlike", unlikeValidation, unlike);

router.get("/status/:userId/:media", likeStatus);
router.get("/getLikes/:media", getLikes);


module.exports = router;