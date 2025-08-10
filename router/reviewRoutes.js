import { Router } from "express";
import {
  getAllReviews,
  createReview,
  getReview,
  updateReview,
  deleteReview,
  getMovieReview,
} from "../controller/reviewController.js";
import ValidateObjectId from "../middleware/ValidateObjectId.js";
import { createReviewValidation } from "../validation/reviewValidation.js";

const router = Router();

router.get("/allReview", getAllReviews);

router.route("/").post(createReviewValidation, createReview);

router
  .route("/:id")
  .get(ValidateObjectId, getMovieReview)
  .get(ValidateObjectId, getReview)
  .put(ValidateObjectId, updateReview)
  .delete(ValidateObjectId, deleteReview);

export default router;
