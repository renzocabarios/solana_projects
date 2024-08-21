import { AnchorProvider, BN, Program } from "@coral-xyz/anchor";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import {
  AddressLookupTableProgram,
  clusterApiUrl,
  ComputeBudgetProgram,
  Connection,
  Keypair,
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { RandomProgram } from "./idl";
import { TOKEN_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";
import { SYSTEM_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/native/system";

const PAYER_KEYPAIR = Keypair.fromSecretKey(
  new Uint8Array([
    153, 91, 212, 174, 211, 180, 86, 16, 47, 145, 133, 186, 155, 58, 59, 228, 8,
    34, 77, 190, 6, 117, 187, 11, 60, 83, 97, 79, 196, 2, 127, 86, 193, 133, 82,
    48, 163, 229, 122, 9, 28, 223, 126, 248, 69, 11, 99, 217, 29, 157, 149, 79,
    229, 127, 39, 146, 246, 251, 126, 10, 97, 210, 165, 234,
  ])
);

(async () => {
  const WALLET = new NodeWallet(PAYER_KEYPAIR);
  const CONNECTION = new Connection(clusterApiUrl("devnet"));
  const PROVIDER = new AnchorProvider(CONNECTION, WALLET);

  const SB_PROGRAM_ID = new PublicKey(
    "SBondMDrcV3K4kxZR1HNVT7osZxAHVHgYXL5Ze1oMUv"
  );

  const SB_IDL = await Program.fetchIdl(SB_PROGRAM_ID, PROVIDER);
  const SB_PROGRAM = new Program(SB_IDL!, PROVIDER);

  const RNG_KEYPAIR = Keypair.generate();

  const RECENT_SLOT = await CONNECTION.getSlot("finalized");
  const QUEUE_ID = new PublicKey(
    "FfD96yeXs4cxZshoPPSKhSPgVQxLAJUT3gefgh84m1Di"
  );

  const NATIVE_MINT = new PublicKey(
    "So11111111111111111111111111111111111111112"
  );

  const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey(
    "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
  );

  const [state] = PublicKey.findProgramAddressSync(
    [Buffer.from("STATE")],
    SB_PROGRAM_ID
  );

  const lutSigner = PublicKey.findProgramAddressSync(
    [Buffer.from("LutSigner"), RNG_KEYPAIR.publicKey.toBuffer()],
    SB_PROGRAM.programId
  )[0];

  const [_, lut] = AddressLookupTableProgram.createLookupTable({
    authority: lutSigner,
    payer: PublicKey.default,
    recentSlot: RECENT_SLOT,
  });

  const [address] = PublicKey.findProgramAddressSync(
    [
      RNG_KEYPAIR.publicKey.toBuffer(),
      TOKEN_PROGRAM_ID.toBuffer(),
      NATIVE_MINT.toBuffer(),
    ],
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  const ix = await SB_PROGRAM.methods
    .randomnessInit({
      recentSlot: new BN(RECENT_SLOT.toString()),
    })
    .accounts({
      randomness: RNG_KEYPAIR.publicKey,
      queue: QUEUE_ID,
      authority: WALLET.publicKey!,
      payer: WALLET.publicKey!,
      rewardEscrow: address,
      systemProgram: SYSTEM_PROGRAM_ID,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      wrappedSolMint: NATIVE_MINT,
      programState: state,
      lutSigner,
      lut,
      addressLookupTableProgram: AddressLookupTableProgram.programId,
    })
    .instruction();

  const priorityFeeIx = ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: 75_000,
  });

  const simulationComputeLimitIx = ComputeBudgetProgram.setComputeUnitLimit({
    units: 1_400_000, // 1.4M compute units
  });

  const LATEST_BLOCKHASH = await CONNECTION.getLatestBlockhash();

  const simulateMessageV0 = new TransactionMessage({
    recentBlockhash: LATEST_BLOCKHASH.blockhash,
    instructions: [priorityFeeIx, simulationComputeLimitIx, ix],
    payerKey: PAYER_KEYPAIR.publicKey,
  }).compileToV0Message([]);

  const simulateTx = new VersionedTransaction(simulateMessageV0);
  try {
    simulateTx.serialize();
  } catch (e: any) {
    if (e instanceof RangeError) {
      throw new Error("Transaction failed to serialize: Transaction too large");
    }
    throw e;
  }

  const simulationResult = await CONNECTION.simulateTransaction(simulateTx, {
    commitment: "processed",
    sigVerify: false,
  });

  const simulationUnitsConsumed = simulationResult.value.unitsConsumed!;
  const computeLimitIx = ComputeBudgetProgram.setComputeUnitLimit({
    units: Math.floor(simulationUnitsConsumed * (1.3 ?? 1)),
  });

  const messageV0 = new TransactionMessage({
    recentBlockhash: LATEST_BLOCKHASH.blockhash,
    instructions: [priorityFeeIx, computeLimitIx, ix],
    payerKey: PAYER_KEYPAIR.publicKey,
  }).compileToV0Message([]);

  const createRandomnessTx = new VersionedTransaction(messageV0);
  createRandomnessTx.sign([PAYER_KEYPAIR, RNG_KEYPAIR]);

  const sig1 = await CONNECTION.sendTransaction(createRandomnessTx);
  await CONNECTION.confirmTransaction({
    signature: sig1,
    blockhash: LATEST_BLOCKHASH.blockhash,
    lastValidBlockHeight: LATEST_BLOCKHASH.lastValidBlockHeight,
  });
  console.log(
    "  Transaction Signature for randomness account creation: ",
    sig1
  );
})();
