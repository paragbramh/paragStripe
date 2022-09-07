import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  billingID: String,
  plan: {
    type: String,
    enum: ["NONE", "BASIC", "STANDARD", "PREMIUM", "REGULAR"],
    default: "NONE",
  },
  subId: String,
  endDate: { type: Date, default: null },
});

const userDb = mongoose.model("userdb", userSchema);

export default userDb;
