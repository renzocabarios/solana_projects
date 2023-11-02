import generateToken from "./generateToken";

export default (payload = {}) => {
  return generateToken(payload, "1y");
};
