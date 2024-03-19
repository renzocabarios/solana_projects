import base58 from "bs58";

const main = async () => {
  console.log(`signature: ${base58.decode(process.argv[2].toString() ?? "")}`);
};

main();
