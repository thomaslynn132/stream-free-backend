import express from "express";
import {
  getAllSeries,
  createSeries,
  getSeries,
  updateSeries,
  deleteSeries,
  topRatedSeries,
  trendingSeries,
  seriesCategories,
  newReleasedSeries,
  popularSeries,
  getSeriesByGenre,
} from "../controller/seriesController.js";
import ValidateObjectId from "../middleware/ValidateObjectId.js";
import Authenticate from "../middleware/Authenticate.js";
import Authorize from "../middleware/Authorize.js";

const router = express.Router();

router
  .route("/")
  .get(getAllSeries)
  .post([Authenticate, Authorize(["admin"])], createSeries);

router.get("/categories", seriesCategories);
router.get("/top-rated", topRatedSeries);
router.get("/trending-series", trendingSeries);
router.get("/new-released", newReleasedSeries);
router.get("/popular-series", popularSeries);
router.get("/seriesByGenre/:genre", getSeriesByGenre);

router
  .route("/:id")
  .get(ValidateObjectId, getSeries)
  .put([Authenticate, Authorize(["admin"])], ValidateObjectId, updateSeries)
  .delete([Authenticate, Authorize(["admin"])], ValidateObjectId, deleteSeries);

export default router;
