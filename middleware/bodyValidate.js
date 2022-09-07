import { body } from "express-validator";

const bodyValidator = (method) => {
  switch (method) {
    case "signupuser":
      return [
        body("email", "Invalid email").exists({ checkFalsy: true }).isEmail(),
        body("name", "name must required")
          .exists({ checkFalsy: true })
          .isAlphanumeric()
          .isLength({ min: 3, max: 30 })
          .withMessage("name must be between 3 and 30 characters"),
      ];
    case "signinuser":
      return [
        body("email", "Invalid email").exists({ checkFalsy: true }).isEmail(),
        body("name", "name must required")
          .exists({ checkFalsy: true })
          .isAlphanumeric()
          .isLength({ min: 3, max: 30 })
          .withMessage("name must be between 3 and 30 characters"),
      ];
    default:
      return null;
  }
};

export default bodyValidator;
