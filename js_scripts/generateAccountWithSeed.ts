import { generateAccountWithSeed, getPayerKeypair } from "./utils";

const main = async () => {
  const keypair = getPayerKeypair();
  let seed = "robot001";

  const account = await generateAccountWithSeed(keypair.publicKey, seed);
  console.log(`${account}`);
};

main();
