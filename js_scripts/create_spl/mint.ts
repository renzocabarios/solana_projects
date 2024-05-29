import { PublicKey } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import {
  CONNECTION,
  MINT_DECIMALS,
  MINT_SUPPLY,
  PAYER_KEYPAIR,
} from "./config";

const MINT = new PublicKey("5hkaose7TWdm4uqKTMQBS4WpqNTdDHXzaa3VfLMK7G1N");

(async () => {
  try {
    const ata = await getOrCreateAssociatedTokenAccount(
      CONNECTION,
      PAYER_KEYPAIR,
      MINT,
      PAYER_KEYPAIR.publicKey
    );

    console.log(`Your ata is: ${ata.address.toBase58()}`);

    const mintTx = await mintTo(
      CONNECTION,
      PAYER_KEYPAIR,
      MINT,
      ata.address,
      PAYER_KEYPAIR.publicKey,
      MINT_SUPPLY * 10 ** MINT_DECIMALS
    );
    console.log(`Your mint txid: ${mintTx}`);
  } catch (error) {
    console.log(`Oops, something went wrong: ${error}`);
  }
})();
