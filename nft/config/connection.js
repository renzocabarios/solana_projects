import { Connection, clusterApiUrl } from "@solana/web3.js";
import { CLUSTER } from "../env/index.js";

export const CONNECTION = new Connection(clusterApiUrl(CLUSTER));
