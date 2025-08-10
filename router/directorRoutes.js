import { Router } from "express";
import {
  getAllDirectors,
  getDirector,
  updateDirector,
  deleteDirector,
  createDirector,
  getDirectorMovies,
  getDirectorSeries,
} from "../controller/directorController.js";
import ValidateObjectId from "../middleware/ValidateObjectId.js";
import Authorize from "../middleware/Authorize.js";
import Authenticate from "../middleware/Authenticate.js";

const router = Router();

router.get("/directorList", getAllDirectors);
router.post("/", [Authenticate, Authorize(["admin"])], createDirector);
router.get("/seriesList/:id", ValidateObjectId, getDirectorSeries);
router.get("/moviesList/:id", ValidateObjectId, getDirectorMovies);

router
  .route("/:id")
  .get(ValidateObjectId, getDirector)
  .put([ValidateObjectId, Authenticate, Authorize(["admin"])], updateDirector)
  .delete(
    [ValidateObjectId, Authenticate, Authorize(["admin"])],
    deleteDirector
  );

export default router;
