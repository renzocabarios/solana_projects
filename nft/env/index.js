import "dotenv/config";

export const PRIVATE_KEY = process.env.PRIVATE_KEY || "SECRET_KEY";
export const CLUSTER = process.env.CLUSTER || "devnet";
export const BUNDLR_STORAGE_ADDRESS =
  process.env.BUNDLR_STORAGE_ADDRESS || "https://devnet.bundlr.network/";
export const BUNDLR_STORAGE_PROVIDE_URL =
  process.env.BUNDLR_STORAGE_PROVIDE_URL || "https://api.devnet.solana.com/";
export const BUNDLR_STORAGE_TIMEOUT =
  Number(process.env.BUNDLR_STORAGE_TIMEOUT) || 60000;
