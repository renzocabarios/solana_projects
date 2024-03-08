import { createAccount, generateKeypair, getPayerKeypair } from "./utils";

const main = async () => {
  const newAccountKeypair = generateKeypair();
  const space = 0;
  const signature = await createAccount(newAccountKeypair, space);
  console.log(
    ` Address: ${getPayerKeypair().publicKey.toString()} created ${newAccountKeypair.publicKey.toString()}`
  );
  console.log(`signature: ${signature}`);
};

main();
