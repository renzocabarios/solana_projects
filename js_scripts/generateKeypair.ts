import { generateKeypair } from "./utils";

const main = async () => {
  const keypair = generateKeypair();
  console.log(
    `Public Key: ${keypair.publicKey} \n Secret Key: ${keypair.secretKey}`
  );
};

main();
