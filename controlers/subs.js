import Stripe from "stripe";
import userDb from "../models/userModel.js";
import { updatePlanInfo } from "../models/update.js";

const stripe = Stripe(
  "sk_test_51LfG41SCpjJEYRkRxIbwdW1fkd5A9KFWqYBI4qS4TNsRKq3j5mv8VcJZYydRzbKiwK2P1eIRs2cnQiF2422acLrd002quzWXA4"
);

const productToPriceMapYearly = {
  PREMIUM: "price_1LfJVDSCpjJEYRkRrx3v6c91",
  STANDARD: "price_1LfJRhSCpjJEYRkRT67nr8NJ",
  BASIC: "price_1LfGGOSCpjJEYRkRMZmflUrk",
  REGULAR: "price_1LfJWLSCpjJEYRkRNcAUTK1f",
};
const productToPriceMapMonthly = {
  PREMIUM: "price_1LfJVDSCpjJEYRkRB7YpdRMQ",
  STANDARD: "price_1LfJRhSCpjJEYRkRDMzQ3cXV",
  BASIC: "price_1LfGGOSCpjJEYRkRrlIRG8f6",
  REGULAR: "price_1LfJWLSCpjJEYRkRv93BC093",
};

export const addNewCustomer = async (email) => {
  const customer = await stripe.customers.create({
    email,
    description: "New Customer",
  });
  return customer;
};

export const getCustomerByID = async (id) => {
  const customer = await stripe.customers.retrieve(id);
  return customer;
};

export const createBillingSession = async (customer) => {
  const session = await stripe.billingPortal.sessions.create({
    customer,
    return_url: "http://localhost:3000",
  });
  return session;
};

export const fetchBill = async (req, res) => {
  const customerId = await userDb.findById(req.userId);
  const session = await createBillingSession(customerId.billingID);
  res.status(200).json({ url: session.url });
};

export const createCheckoutSession = async (customer, price) => {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer,
    line_items: [
      {
        price,
        quantity: 1,
      },
    ],
    success_url: `http://localhost:3000/success`,
    cancel_url: `http://localhost:3000/canceled`,
  });

  return session;
};

export const checkoutUser = async (req, res) => {
  const customer = req.userId;
  const { product, customerId, planDate } = req.body;
  let price;
  planDate == "M"
    ? (price = productToPriceMapMonthly[product])
    : (price = productToPriceMapYearly[product]);

  try {
    const session = await createCheckoutSession(customerId, price);
    console.log("subStart");
    const ms = new Date().getTime() + 1000 * 60 * 60 * 24;
    const n = new Date(ms);

    const updatedData = await updatePlanInfo(customer, product, n);

    res.status(200).json({ subId: session.id, url: session.url });
  } catch (e) {
    console.log(e);
    res.status(400);
    return res.send({
      error: {
        message: e.message,
      },
    });
  }
};

export const createWebhook = (rawBody, sig) => {
  const event = Stripe.webhooks.constructEvent(
    rawBody,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET
  );
  return event;
};

export const subsWebhook = async (req, res) => {
  let event;

  try {
    event = Stripe.createWebhook(req.body, req.header("Stripe-Signature"));
  } catch (err) {
    console.log(err);
    return res.status(301).json({ message: session.url });
  }

  const data = event.data.object;

  console.log(event.type, data);
  switch (event.type) {
    case "customer.created":
      console.log(JSON.stringify(data));
      break;
    case "invoice.paid":
      break;
    case "customer.subscription.created": {
      const user = await UserService.getUserByBillingID(data.customer);

      if (data.plan.id === process.env.PRODUCT_BASIC) {
        console.log("You are talking about basic product");
        user.plan = "basic";
      }

      if (data.plan.id === process.env.PRODUCT_PRO) {
        console.log("You are talking about pro product");
        user.plan = "pro";
      }

      await user.save();

      break;
    }
    case "customer.subscription.updated": {
      // started trial
      const user = await UserService.getUserByBillingID(data.customer);

      if (data.plan.id == process.env.PRODUCT_BASIC) {
        console.log("You are talking about basic product");
        user.plan = "basic";
      }

      if (data.plan.id === process.env.PRODUCT_PRO) {
        console.log("You are talking about pro product");
        user.plan = "pro";
      }

      if (data.canceled_at) {
        // cancelled
        console.log("You just canceled the subscription" + data.canceled_at);
        user.plan = "none";
        user.hasTrial = false;
        user.endDate = null;
      }
      console.log("actual", data.current_period_end, user.plan);

      await user.save();
      console.log("customer changed", JSON.stringify(data));
      break;
    }
    default:
  }
  res.sendStatus(200);
};
