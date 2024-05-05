import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import {
  TOKEN_PROGRAM_ID,
  createInitializeMint2Instruction,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  getAssociatedTokenAddressSync,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  createMintToInstruction,
} from "@solana/spl-token";
import { PublicKey, Signer } from "@solana/web3.js";
import { SystemProgram, Transaction } from "@solana/web3.js";
import { assert } from "chai";
import { SendMyFt } from "../target/types/send_my_ft";

export const PROVIDER = anchor.AnchorProvider.local();
export const CONNECTION = PROVIDER.connection;
anchor.setProvider(PROVIDER);

export const SEND_MY_FT_PROGRAM = anchor.workspace
  .SendMyFt as Program<SendMyFt>;
export const TO_WALLET = new anchor.web3.Keypair();
export const MINT = new anchor.web3.Keypair();
