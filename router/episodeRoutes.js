import { Router } from "express";
import {
  createEpisode,
  getEpisodeById,
  updateEpisode,
  deleteEpisode,
  getEpisodeByEpisodeNumber,
  downloadEpisode,
} from "../controller/episodeController.js";
import ValidateObjectId from "../middleware/ValidateObjectId.js";

const router = Router();

router.route("/").post(createEpisode);

router
  .route("/:id")
  .get(ValidateObjectId, getEpisodeById)
  .put(ValidateObjectId, updateEpisode)
  .delete(ValidateObjectId, deleteEpisode);

router.get("/:series/:season/:episodeNumber", getEpisodeByEpisodeNumber);
router.post("/download", downloadEpisode);

export default router;
