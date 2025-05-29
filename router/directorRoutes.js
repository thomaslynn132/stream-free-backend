const express = require('express');
const { getAllDirectors, getDirector, updateDirector, deleteDirector, createDirector, getDirectorMovies, getDirectorSeries } = require('../controller/directorController');
const ValidateObjectId = require('../middleware/ValidateObjectId');
const Authorize = require('../middleware/Authorize');
const Authenticate = require('../middleware/Authenticate');

const router = express.Router();


router.get("/directorList", getAllDirectors);
router.post("/", [Authenticate, Authorize(["admin"])], createDirector);
router.get("/seriesList/:id", ValidateObjectId, getDirectorSeries);
router.get("/moviesList/:id", ValidateObjectId,getDirectorMovies);

router
    .route('/:id')
    .get(ValidateObjectId, getDirector)
    .put([ValidateObjectId, Authenticate, Authorize(["admin"])], updateDirector)
    .delete([ValidateObjectId, Authenticate, Authorize(["admin"])], deleteDirector);

module.exports = router;