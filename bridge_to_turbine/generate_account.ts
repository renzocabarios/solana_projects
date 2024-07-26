import { Keypair } from "@solana/web3.js";

// 7L1MKR11qLHLCMzqGNcDNiqwEckapAi55D4xSWgGEb2C
(async () => {
  const newAccount = Keypair.generate();

  console.log(newAccount.publicKey.toString());
  console.log(newAccount.secretKey);
})();
