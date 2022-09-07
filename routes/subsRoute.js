import express from "express";
import { checkoutUser, fetchBill } from "../controlers/subs.js";
import { signinUser, signupUser } from "../controlers/userC.js";
import auth from "../middleware/auth.js";
import bodyValidator from "../middleware/bodyValidate.js";
import {
  standardPlan,
  regularPlan,
  premiumPlan,
  subCancel,
  basicPlan,
} from "../controlers/plan.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/signin", signinUser);
router.post("/checkout", auth, checkoutUser);
router.get("/regular", auth, regularPlan);
router.get("/premium", auth, premiumPlan);
router.get("/basic", auth, basicPlan);
router.get("/standard", auth, standardPlan);
router.post("/billing", auth, fetchBill);
router.post("/subcancel", auth, subCancel);

export default router;
