import {
  SystemProgram,
  Keypair,
  Transaction,
  sendAndConfirmTransaction,
  Connection,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import bs58 from "bs58";

(async () => {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const fromPubkey = Keypair.fromSecretKey(
    bs58.decode(
      "3e4Ve7ofQxXCLqR9iRrEXQQRJLUNKJG9FxQQdAuhzdSZy8A2QJawqQTN135qKHb71Hd2R2uRon4x4AcMNPWQVgEE"
    )
  );

  // amount of space to reserve for the account
  const space = 0;

  // Seed the created account with lamports for rent exemption
  const rentExemptionAmount =
    await connection.getMinimumBalanceForRentExemption(space);

  const newAccountPubkey = Keypair.generate();
  const createAccountParams = {
    fromPubkey: fromPubkey.publicKey,
    newAccountPubkey: newAccountPubkey.publicKey,
    lamports: rentExemptionAmount,
    space,
    programId: SystemProgram.programId,
  };

  const createAccountTransaction = new Transaction().add(
    SystemProgram.createAccount(createAccountParams)
  );

  await sendAndConfirmTransaction(connection, createAccountTransaction, [
    fromPubkey,
    newAccountPubkey,
  ]);

  console.log(newAccountPubkey.publicKey.toString());
})();
