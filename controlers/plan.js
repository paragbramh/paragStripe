import hasPlan from "../middleware/hasplan.js";
import Stripe from "stripe";

const stripe = Stripe(
  "sk_test_51LfG41SCpjJEYRkRxIbwdW1fkd5A9KFWqYBI4qS4TNsRKq3j5mv8VcJZYydRzbKiwK2P1eIRs2cnQiF2422acLrd002quzWXA4"
);
export const standardPlan = async (req, res) => {
  const { userId } = req;
  const planAuth = await hasPlan("STANDARD", userId);
  if (planAuth) {
    res.status(200).json({ msg: "welcome" });
    // show plan data
  } else {
    res.status(401).json({ msg: "unauthorized" });
  }
};

export const premiumPlan = async (req, res) => {
  const { userId } = req;
  const planAuth = await hasPlan("PREMIUM", userId);

  if (planAuth) {
    res.status(200).json({ msg: "welcome" });
    // show plan data
  } else {
    res.status(401).json({ msg: "unauthorized" });
  }
};

export const regularPlan = async (req, res) => {
  const { userId } = req;
  const planAuth = await hasPlan("REGULAR", userId);
  if (planAuth) {
    res.status(200).json({ msg: "welcome" });
    // show plan data
  } else {
    res.status(401).json({ msg: "unauthorized" });
  }
};
export const basicPlan = async (req, res) => {
  const { userId } = req;
  const planAuth = await hasPlan("BASIC", userId);
  if (planAuth) {
    //show data
    res.status(200).json({ msg: "welcome" });
  } else {
    res.status(401).json({ msg: "unauthorized" });
  }
};

export const subCancel = async (req, res) => {
  const { userId } = req;
  console.log(userId);
  console.log(req.body);
  const { customerId } = req.body;
  console.log(customerId);

  const deleted = await stripe.subscriptions.del(customerId);
  console.log(deleted);
};
