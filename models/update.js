import userDb from "./userModel.js";

export const updatePlanInfo = async (id, plan, endDate, subId) => {
  try {
    let UserUpdate = await userDb.updateOne(
      { _id: id },
      {
        $set: {
          plan: plan,
          endDate: endDate,
          subId: subId,
        },
      }
    );
    return UserUpdate;
  } catch (e) {
    console.log(e);
  }
};
