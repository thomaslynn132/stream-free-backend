const express = require('express');
const { getAllReviews, createReview, getReview, updateReview, deleteReview, getMovieReview } = require('../controller/reviewController');
const ValidateObjectId = require('../middleware/ValidateObjectId');
const { createReviewValidation } = require('../validation/reviewValidation');

const router = express.Router();

router.get("/allReview", getAllReviews);

router.route("/")
    .post(createReviewValidation, createReview);

router
    .route('/:id')
    .get(ValidateObjectId, getMovieReview)
    .get(ValidateObjectId, getReview)
    .put(ValidateObjectId, updateReview)
    .delete(ValidateObjectId, deleteReview);

module.exports = router;