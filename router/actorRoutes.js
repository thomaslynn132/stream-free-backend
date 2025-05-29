const { Router } = require('express');
const { allActors, getActor, createActor, updateActor, deleteActor, getActorMovies, getActorSeries } = require('../controller/actorController');
const ValidateObjectId = require('../middleware/ValidateObjectId');
const Authenticate = require('../middleware/Authenticate');
const Authorize = require('../middleware/Authorize');
const router = Router();


router.get("/actorList", allActors)

router.post("/", [Authenticate, Authorize(["admin"])], createActor);
router.get("/seriesList/:id", ValidateObjectId, getActorSeries);
router.get("/moviesList/:id", ValidateObjectId, getActorMovies);

router.route("/:id")
    .get(ValidateObjectId, getActor)
    .put(ValidateObjectId, [Authenticate, Authorize(["admin"])], updateActor)
    .delete(ValidateObjectId, [Authenticate, Authorize(["admin"])], deleteActor);


module.exports = router;