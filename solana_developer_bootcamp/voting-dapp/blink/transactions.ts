import {
  clusterApiUrl,
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { BN, Program } from "@coral-xyz/anchor";
import { IVotingdapp, Votingdapp } from "./voting_idl";

export const transferSolTransaction = async ({
  from,
}: any): Promise<Transaction> => {
  const fromPubkey = new PublicKey(from);
  const toPubkey = new PublicKey(
    "7gGSitZAwiYVyeMPtvt3DDVgTJsawKc47F4cKb2zW6Fm"
  );

  const connection = new Connection(clusterApiUrl("mainnet-beta"));

  const minimumBalance = await connection.getMinimumBalanceForRentExemption(0);

  const transaction = new Transaction();
  transaction.feePayer = fromPubkey;

  transaction.add(
    SystemProgram.transfer({
      fromPubkey: fromPubkey,
      toPubkey: toPubkey,
      lamports: minimumBalance,
    })
  );

  transaction.recentBlockhash = (
    await connection.getLatestBlockhash()
  ).blockhash;

  return transaction;
};

export const voteTransaction = async ({ from }: any): Promise<Transaction> => {
  const fromPubkey = new PublicKey(from);
  console.log(fromPubkey);

  const connection = new Connection(clusterApiUrl("devnet"));
  const program: Program<IVotingdapp> = new Program(Votingdapp, { connection });

  const instruction = await program.methods
    .vote(new BN(1), "Candidate")
    .accounts({
      signer: fromPubkey,
    })
    .instruction();

  const blockhash = await connection.getLatestBlockhash();
  console.log(blockhash);

  const transaction = new Transaction({
    feePayer: fromPubkey,
    blockhash: blockhash.blockhash,
    lastValidBlockHeight: blockhash.lastValidBlockHeight,
  }).add(instruction);
  console.log(transaction);

  return transaction;
};
