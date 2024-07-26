import "dotenv/config";

const ENV = {
  PORT: process.env.PORT || 9000,
  MONGO_CON:
    process.env.MONGO_CON ||
    "mongodb://localhost:27017/srs?directConnection=true",
  HASH_SALT: Number(process.env.HASH_SALT) || 10,
  JWT_KEY: process.env.JWT_KEY || "secret",
};

export default ENV;
