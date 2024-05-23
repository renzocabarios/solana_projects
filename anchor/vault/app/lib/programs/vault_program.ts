import { AnchorProvider, Program, utils, BN } from "@coral-xyz/anchor";
import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import { VaultIdl } from "./vault_idl";
import { AnchorWallet } from "@solana/wallet-adapter-react";

const VAULT_SEED = "VAULT_SEED";

export const VAULT_PROGRAM_ID = new PublicKey(
  "857qXVVHUu3rXin47Bm9y3FpLohTwBW8s8V3pkcwXa4F"
);

export interface IAnchorContext {
  connection: Connection;
  wallet: AnchorWallet;
}

export function getProgram({ connection, wallet }: IAnchorContext) {
  const provider = new AnchorProvider(connection, wallet, {});
  return new Program<VaultIdl>(VaultIdl, VAULT_PROGRAM_ID, provider);
}

export function getVaultAddress(
  vault_authority: PublicKey,
  programID: PublicKey
) {
  return PublicKey.findProgramAddressSync(
    [utils.bytes.utf8.encode(VAULT_SEED), vault_authority.toBuffer()],
    programID
  );
}

export interface IInitializeVaultAccounts {
  vaultAuthority: PublicKey;
  vaultAccount: PublicKey;
}

export async function initializeVault(
  context: IAnchorContext,
  accounts: IInitializeVaultAccounts
) {
  return await getProgram(context)
    .methods.initialize()
    .accounts({
      systemProgram: SystemProgram.programId,
      ...accounts,
    });
}

export function getAllVaults(connection: Connection) {
  return new Program<VaultIdl>(VaultIdl, VAULT_PROGRAM_ID, {
    connection,
  }).account.vaultAccount.all();
}

export function getVaultByAddress(connection: Connection, address: PublicKey) {
  return new Program<VaultIdl>(VaultIdl, VAULT_PROGRAM_ID, {
    connection,
  }).account.vaultAccount.fetch(address);
}

export interface IDepositToVaultArgs {
  amount: number;
}

export interface IDepositToVaultAccounts {
  vaultAuthority: PublicKey;
  vaultAccount: PublicKey;
}

export async function depositToVault(
  context: IAnchorContext,
  args: IDepositToVaultArgs,
  accounts: IDepositToVaultAccounts
) {
  return await getProgram(context)
    .methods.deposit(new BN(args.amount))
    .accounts({
      systemProgram: SystemProgram.programId,
      ...accounts,
    });
}

export interface IWithdrawFromArgs {
  amount: number;
}

export interface IWithdrawFromAccounts {
  vaultAuthority: PublicKey;
  vaultAccount: PublicKey;
}

export async function withdrawFromVault(
  context: IAnchorContext,
  args: IWithdrawFromArgs,
  accounts: IWithdrawFromAccounts
) {
  return await getProgram(context)
    .methods.withdraw(new BN(args.amount))
    .accounts({
      ...accounts,
    });
}
// export interface IAnchorContext {
//   connection: Connection;
//   wallet: AnchorWallet;
// }

// export interface ILikeTweetAccounts {
//   reactionAuthor: PublicKey;
//   tweetReaction: PublicKey;
//   tweet: PublicKey;
//   tweetAuthority: PublicKey;
// }

// export async function likeTweet(
//   context: IAnchorContext,
//   accounts: ILikeTweetAccounts
// ) {
//   return await getProgram(context).methods.likeTweet().accounts(accounts);
// }
// export interface IDisikeTweetAccounts {
//   reactionAuthor: PublicKey;
//   tweetReaction: PublicKey;
//   tweet: PublicKey;
//   tweetAuthority: PublicKey;
// }

// export async function dislikeTweet(
//   context: IAnchorContext,
//   accounts: IDisikeTweetAccounts
// ) {
//   return await getProgram(context).methods.dislikeTweet().accounts(accounts);
// }
