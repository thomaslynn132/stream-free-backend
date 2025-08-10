import express from "express";

import {
  getAllSupportTickets,
  createSupportTicket,
  getSupportTicketById,
  updateSupportTicket,
  deleteSupportTicket,
} from "../controller/supportController.js";
import ValidateObjectId from "../middleware/ValidateObjectId.js";
import Authenticate from "../middleware/Authenticate.js";
import Authorize from "../middleware/Authorize.js";
import {
  createSupportTicketValidation,
  updateSupportTicketValidation,
} from "../validation/supportValidation.js";

const router = express.Router();

router
  .route("/")
  .get([Authenticate, Authorize("admin")], getAllSupportTickets)
  .post(createSupportTicketValidation, createSupportTicket);

router
  .route("/:id")
  .get(ValidateObjectId, getSupportTicketById)
  .put(
    [Authenticate, Authorize("admin"), updateSupportTicketValidation],
    ValidateObjectId,
    updateSupportTicket,
  )
  .delete(
    [Authenticate, Authorize("admin")],
    ValidateObjectId,
    deleteSupportTicket,
  );

export default router;
