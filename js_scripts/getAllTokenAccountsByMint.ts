import { CONNECTION } from "./config";
import { PublicKey } from "@solana/web3.js";

const main = async () => {
  const TOKEN_PUBKEY = new PublicKey(
    "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
  );

  const filters = [
    {
      memcmp: {
        offset: 0,
        bytes: process.argv[2],
      },
    },
    {
      dataSize: 165,
    },
  ];

  const programAccountsConfig = {
    filters,
    encoding: "jsonParsed",
  };

  const listOfTokens = await CONNECTION.getParsedProgramAccounts(
    TOKEN_PUBKEY,
    programAccountsConfig
  );
  listOfTokens.forEach((e: any) => {
    console.log(e.account.data.parsed.info.owner);
  });
  console.log(listOfTokens.length);
};

main();
