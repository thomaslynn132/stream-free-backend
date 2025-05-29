const { Router } = require('express');
const { allMovies, singleMovie, createMovie, updateMovie, deleteMovie, movieCategories, topRatedMovies, trendingMovies, newReleased, popularMovies, downloadMovie, getMoviesByGenre } = require('../controller/movieController');
const ValidateObjectId = require('../middleware/ValidateObjectId');
const Authorize = require('../middleware/Authorize');
const Authenticate = require('../middleware/Authenticate');

const router = Router();

router.route("/")
    .get(allMovies)
    .post([Authenticate, Authorize(["admin"])], createMovie);

router.get("/categories", movieCategories);
router.get("/top-rated", topRatedMovies);
router.get("/trending-movies", trendingMovies)
router.get("/new-released", newReleased);
router.get("/popular-movies", popularMovies);
router.get("/moviesByGenre/:genre", getMoviesByGenre);

router.post("/download", downloadMovie);

router.route("/:id", ValidateObjectId)
    .get(singleMovie)
    .put([Authenticate, Authorize(["admin"])], updateMovie)
    .delete([Authenticate, Authorize(["admin"])], deleteMovie);

module.exports = router;