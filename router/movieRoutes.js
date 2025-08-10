import { Router } from "express";
import {
  allMovies,
  singleMovie,
  createMovie,
  updateMovie,
  deleteMovie,
  movieCategories,
  topRatedMovies,
  trendingMovies,
  newReleased,
  popularMovies,
  downloadMovie,
  getMoviesByGenre,
} from "../controller/movieController.js";
import ValidateObjectId from "../middleware/ValidateObjectId.js";
import Authorize from "../middleware/Authorize.js";
import Authenticate from "../middleware/Authenticate.js";

const router = Router();

router
  .route("/")
  .get(allMovies)
  .post([Authenticate, Authorize(["admin"])], createMovie);

router.get("/categories", movieCategories);
router.get("/top-rated", topRatedMovies);
router.get("/trending-movies", trendingMovies);
router.get("/new-released", newReleased);
router.get("/popular-movies", popularMovies);
router.get("/moviesByGenre/:genre", getMoviesByGenre);

router.post("/download", downloadMovie);

router
  .route("/:id", ValidateObjectId)
  .get(singleMovie)
  .put([Authenticate, Authorize(["admin"])], updateMovie)
  .delete([Authenticate, Authorize(["admin"])], deleteMovie);

export default router;
