import { Router } from "express";
import {
  allActors,
  getActor,
  createActor,
  updateActor,
  deleteActor,
  getActorMovies,
  getActorSeries,
} from "../controller/actorController.js";
import ValidateObjectId from "../middleware/ValidateObjectId.js";
import Authenticate from "../middleware/Authenticate.js";
import Authorize from "../middleware/Authorize.js";
const router = Router();

router.get("/actorList", allActors);

router.post("/", [Authenticate, Authorize(["admin"])], createActor);
router.get("/seriesList/:id", ValidateObjectId, getActorSeries);
router.get("/moviesList/:id", ValidateObjectId, getActorMovies);

router
  .route("/:id")
  .get(ValidateObjectId, getActor)
  .put(ValidateObjectId, [Authenticate, Authorize(["admin"])], updateActor)
  .delete(ValidateObjectId, [Authenticate, Authorize(["admin"])], deleteActor);

export default router;
