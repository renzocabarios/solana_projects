import "dotenv/config";

export default {
  MONGO_CON: process.env.MONGO_CON || "",
  RPC_URL: process.env.RPC_URL || "",
};
