import { Router } from "express";
import searchController from "../controller/searchController.js";
import { searchValidation } from "../validation/searchValidation.js";

const router = Router();

router.post("/", searchValidation, searchController);

export default router;
