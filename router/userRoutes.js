import { Router } from "express";
import {
  singleUser,
  registerUser,
  login,
  deleteUser,
  allUser,
  getWatchList,
  logout,
  refreshToken,
  // freeTrial,
  addSubscription,
} from "../controller/userController.js";
import ValidateObjectId from "../middleware/ValidateObjectId.js";
import Authenticate from "../middleware/Authenticate.js";
import Authorize from "../middleware/Authorize.js";
import {
  registerValidation,
  loginValidation,
  addSubscriptionValidation,
} from "../validation/userValidation.js";

const router = Router();

router.get("/users", [Authenticate, Authorize(["admin"])], allUser);

router.get("/getWatchList/:id", ValidateObjectId, getWatchList);

router.get("/userData", singleUser);
router
  .route("/user/:id")
  .delete(ValidateObjectId, [Authenticate, Authorize(["admin"])], deleteUser);
//! must add edit user route here

router.post("/register", registerValidation, registerUser);
router.post("/login", loginValidation, login);
router.post("/logout", logout);
router.get("/refreshToken", refreshToken);

router.get("/setCookie", (req, res) => {
  res
    .cookie("token2", "15687sdf9", {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 40), //! 40 seconds
    })
    .send("Cookie set");
});

//? Subscription Route
router.post(
  "/addSubscription/:id",
  [Authenticate, ValidateObjectId, addSubscriptionValidation],
  addSubscription,
);

export default router;
