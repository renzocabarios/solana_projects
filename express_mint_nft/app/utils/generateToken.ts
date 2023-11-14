import jwt from "jsonwebtoken";
import ENV from "../env";

export default (payload = {}, expiresIn = "1y") => {
  return jwt.sign(payload, ENV.JWT_KEY, { expiresIn });
};
