import jwt from "jsonwebtoken";
import { env } from "../utils/enviroment.js";

const secret =
  "asjkdfa5s4df658ar64f3a54f5425253456544@#%@%^%$^!#$%@#RCFDSVV#$%";

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    let decodedData;
    decodedData = jwt.verify(token, secret);
    req.userId = decodedData.id;
    next();
  } catch (error) {
    if (error.name === "TypeError") {
      let data = {
        message: "not authorized",
      };
      res.status(403).json({ data });
    } else {
      let resData = {
        message: "expired",
      };
      res.status(403).json({ resData });
    }
  }
};

export default auth;
