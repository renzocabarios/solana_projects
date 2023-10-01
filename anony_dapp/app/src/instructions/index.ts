import { utils } from "@coral-xyz/anchor";
import { getProgramInstance } from "../config/index";
import { PublicKey } from "@solana/web3.js";

export const create = async ({ provider, title, description }: any) => {
  console.log({ provider, title, description });

  const program = getProgramInstance(provider);
  const [postPDA, _] = PublicKey.findProgramAddressSync(
    [utils.bytes.utf8.encode("post"), provider.publicKey.toBuffer()],
    program.programId
  );

  try {
    await program.methods
      .createPost(title, description)
      .accounts({
        post: postPDA,
        signer: provider.publicKey,
      })
      .rpc();
  } catch (err) {
    console.log(err);
  }
};
