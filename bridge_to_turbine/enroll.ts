import { clusterApiUrl, Connection, Keypair, PublicKey } from "@solana/web3.js";
import { Program, Wallet, AnchorProvider } from "@coral-xyz/anchor";
import { IDL, WbaPrereq } from "./programs";
import wallet from "./dev.json";

// 7L1MKR11qLHLCMzqGNcDNiqwEckapAi55D4xSWgGEb2C
(async () => {
  const github = Buffer.from("renzothenoob", "utf8");
  const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

  const connection = new Connection(clusterApiUrl("devnet"));

  const provider = new AnchorProvider(connection, new Wallet(keypair), {
    commitment: "confirmed",
  });

  const program: Program<WbaPrereq> = new Program(IDL, provider);

  const enrollment_seeds = [
    Buffer.from("prereq"),
    keypair.publicKey.toBuffer(),
  ];
  const [enrollment_key, _bump] = PublicKey.findProgramAddressSync(
    enrollment_seeds,
    program.programId
  );

  const to = Keypair.generate();
  try {
    const txhash = await program.methods
      .complete(github)
      .accounts({
        signer: keypair.publicKey,
      })
      .signers([keypair])
      .rpc();
    console.log(`Success! Check out your TX here:
https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
