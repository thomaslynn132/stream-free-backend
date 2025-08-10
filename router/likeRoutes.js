import { Router } from "express";
import {
  like,
  unlike,
  likeStatus,
  getLikes,
} from "../controller/likeController.js";
import {
  likeValidation,
  unlikeValidation,
} from "../validation/likeValidation.js";

const router = Router();

router.post("/like", likeValidation, like);
router.post("/unlike", unlikeValidation, unlike);

router.get("/status/:userId/:media", likeStatus);
router.get("/getLikes/:media", getLikes);

export default router;
