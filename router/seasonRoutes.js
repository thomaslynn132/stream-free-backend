import { Router } from "express"; // seasonRoutes.js
import * as seasonController from "../controller/seasonController.js";

import ValidateObjectId from "../middleware/ValidateObjectId.js";
import { createSeasonValidation } from "../validation/seasonValidation.js";

const router = Router();

router.route("/").post(createSeasonValidation, seasonController.createSeason);

router.route("/seasons/:seriesId").get(seasonController.getSeasonsBySeries);

router
  .route("/:id")
  .get(ValidateObjectId, seasonController.getSeason)
  .put(ValidateObjectId, seasonController.updateSeason)
  .delete(ValidateObjectId, seasonController.deleteSeason);

export default router;
