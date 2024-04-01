import { UMI_INSTANCE } from "./config";
import { PublicKey, generateSigner, publicKey } from "@metaplex-foundation/umi";
import {
  printV1,
  fetchMasterEditionFromSeeds,
} from "@metaplex-foundation/mpl-token-metadata";
import { TokenStandard } from "@metaplex-foundation/mpl-bubblegum";

const main = async () => {
  const master: PublicKey = publicKey(process.argv[2] ?? "");

  const masterEdition = await fetchMasterEditionFromSeeds(UMI_INSTANCE, {
    mint: master,
  });

  const editionMint = generateSigner(UMI_INSTANCE);
  await printV1(UMI_INSTANCE, {
    masterEditionMint: master,
    editionMint,
    editionNumber: masterEdition.supply + 1n,
    tokenStandard: TokenStandard.NonFungible,
  }).sendAndConfirm(UMI_INSTANCE);

  console.log(`Edition NFT Mint ID: ${editionMint.publicKey.toString()}`);
};

main();
