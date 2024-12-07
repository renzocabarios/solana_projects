import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { FavouritesProgram } from "../target/types/favourites_program";
import { getCustomErrorMessage } from "@solana-developers/helpers";
import { assert } from "chai";
import { systemProgramErrors } from "./system-errors";

const web3 = anchor.web3;

describe("favourites_program", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const user = (provider.wallet as anchor.Wallet).payer;
  const someRandomGuy = anchor.web3.Keypair.generate();
  const program = anchor.workspace
    .FavouritesProgram as Program<FavouritesProgram>;

  const favoriteNumber = new anchor.BN(23);
  const favoriteColor = "purple";
  const favoriteHobbies = ["skiing", "skydiving", "biking"];

  before(async () => {
    const balance = await provider.connection.getBalance(user.publicKey);
    const balanceInSOL = balance / web3.LAMPORTS_PER_SOL;
    const formattedBalance = new Intl.NumberFormat().format(balanceInSOL);
    console.log(`Balance: ${formattedBalance} SOL`);
  });

  it("Writes our favorites to the blockchain", async () => {
    await program.methods
      // set_favourites in Rust becomes setFavorites in TypeScript
      .setFavorites(favoriteNumber, favoriteColor, favoriteHobbies)
      // Sign the transaction
      .signers([user])
      // Send the transaction to the cluster or RPC
      .rpc();

    // Find the PDA for the user's favorites
    const favoritesPdaAndBump = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("favorites"), user.publicKey.toBuffer()],
      program.programId
    );
    const favoritesPda = favoritesPdaAndBump[0];
    const dataFromPda = await program.account.favorites.fetch(favoritesPda);
    // And make sure it matches!
    assert.equal(dataFromPda.color, favoriteColor);
    // A little extra work to make sure the BNs are equal
    assert.equal(dataFromPda.number.toString(), favoriteNumber.toString());
    // And check the hobbies too
    assert.deepEqual(dataFromPda.hobbies, favoriteHobbies);
  });

  it("Updates the favorites", async () => {
    const newFavoriteHobbies = ["skiing", "skydiving", "biking", "swimming"];
    try {
      await program.methods
        .setFavorites(favoriteNumber, favoriteColor, newFavoriteHobbies)
        .signers([user])
        .rpc();
    } catch (error) {
      console.error((error as Error).message);
      const customErrorMessage = getCustomErrorMessage(
        systemProgramErrors,
        error
      );
      throw new Error(customErrorMessage);
    }
  });

  it("Rejects transactions from unauthorized signers", async () => {
    try {
      await program.methods
        .setFavorites(favoriteNumber, favoriteColor, favoriteHobbies)
        .signers([someRandomGuy])
        .rpc();
    } catch (error) {
      const errorMessage = (error as Error).message;
      assert.isTrue(errorMessage.includes("unknown signer"));
    }
  });
});
