import Irys from "@irys/sdk";
import { PAYER_PRIVATE_KEY } from "../../env";

export const getIrysClient = () => {
  const irys = new Irys({
    url: "https://devnet.irys.xyz",
    token: "solana",
    key: PAYER_PRIVATE_KEY,
    config: {
      providerUrl: "https://api.devnet.solana.com",
    },
  });
  // Print your wallet address
  console.log(`wallet address = ${irys.address}`);
  return irys;
};
