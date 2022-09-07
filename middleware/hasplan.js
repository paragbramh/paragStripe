import userDb from "../models/userModel.js";

const hasPlan = async (plan, userid) => {
  const userData = await userDb.findById(userid);

  if (userData.plan == plan) {
    return true;
  } else {
    return false;
  }
};

export default hasPlan;
