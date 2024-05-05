import { UMI_INSTANCE } from "./config";

const main = async () => {
  const name: string = process.argv[2] ?? "NFT TICKET";
  const symbol: string = process.argv[3] ?? "NFTT";
  const description: string = process.argv[4] ?? "A ticket in an nft format";
  const image: string =
    process.argv[5] ??
    "https://gateway.irys.xyz/JQ5N4d-Mnk1poEQZKUqwTEB3M_SRJHc3oT3aVWCghcg";

  const metadata = await UMI_INSTANCE.uploader.uploadJson({
    name,
    symbol,
    description,
    image,
  });

  console.log(`URI: ${metadata}`);
};

main();
