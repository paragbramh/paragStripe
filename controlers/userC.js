import userDb from "./../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { env } from "../utils/enviroment.js";
import { addNewCustomer } from "./subs.js";

const secret =
  "asjkdfa5s4df658ar64f3a54f5425253456544@#%@%^%$^!#$%@#RCFDSVV#$%";

export const signupUser = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    }

    const { name, email, password, confirmPassword } = req.body;

    const existedUser = await userDb.findOne({ email });
    if (existedUser)
      return res.status(400).json({ message: "user already existed" });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "password do not match" });

    const hasedPasswd = await bcrypt.hash(password, 12);
    const stripeUser = await addNewCustomer(email);

    const user = await userDb.create({
      name,
      email,
      password: hasedPasswd,
      billingID: stripeUser.id,
    });

    const token = jwt.sign(
      { email: user.email, name: user.name, id: user._id, plan: user.plan },
      secret,
      { expiresIn: "8h" }
    );

    const profile = {
      name: user.name,
      email: user.email,
      token: token,
    };

    profile.stripeData = stripeUser;

    res.status(201).json({ profile });
  } catch (error) {
    console.log(error);
  }
};

export const signinUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
  }
  try {
    const { email, password } = req.body;

    const User = await userDb.findOne({ email });

    if (!User) return res.status(404).json({ message: "user not existed" });
    const hasedPasswd = await bcrypt.compare(password, User.password);

    if (!hasedPasswd)
      return res.status(400).json({ message: "invalid credentials" });

    const token = jwt.sign(
      { email: User.email, name: User.name, id: User._id },
      secret,
      { expiresIn: "8h" }
    );

    const existedUser = {
      name: User.name,
      email: User.email,
      token: token,
    };

    res.status(201).json({ existedUser });
  } catch (error) {
    console.log(error);
  }
};
