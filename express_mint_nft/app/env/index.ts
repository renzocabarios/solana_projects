import dotenv from "dotenv";

dotenv.config();

const ENV = {
  PORT: process.env.PORT || 9000,
  MONGO_CON:
    process.env.MONGO_CON ||
    "mongodb://localhost:27017/srs?directConnection=true",
  HASH_SALT: Number(process.env.HASH_SALT) || 10,
  JWT_KEY: process.env.JWT_KEY || "secret",
  PRIVATE_KEY: process.env.PRIVATE_KEY || "",
  BUNDLR_STORAGE_ADDRESS:
    process.env.BUNDLR_STORAGE_ADDRESS || "https://devnet.bundlr.network/",
  BUNDLR_STORAGE_PROVIDE_URL:
    process.env.BUNDLR_STORAGE_PROVIDE_URL || "https://api.devnet.solana.com/",
  BUNDLR_STORAGE_TIMEOUT: process.env.BUNDLR_STORAGE_TIMEOUT || 60000,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
};

export default ENV;
