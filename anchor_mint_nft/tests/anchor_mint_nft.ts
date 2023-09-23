import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorMintNft } from "../target/types/anchor_mint_nft";

describe("anchor_mint_nft", () => {
  const testNftTitle = "Beta";
  const testNftSymbol = "BETA";
  const testNftUri =
    "https://raw.githubusercontent.com/Coding-and-Crypto/Solana-NFT-Marketplace/master/assets/example.json";

  const provider = anchor.AnchorProvider.env();
  const wallet = provider.wallet as anchor.Wallet;
  anchor.setProvider(provider);
  const program = anchor.workspace.AnchorMintNft as Program<AnchorMintNft>;
  const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
    "Fj1NHpcEKdsJr76SrTXJdJF9P37hq3Dz3QiyaiC95nak"
  );

  it("Is initialized!", async () => {
    // Derive the mint address and the associated token account address

    const mintKeypair: anchor.web3.Keypair = anchor.web3.Keypair.generate();
    const tokenAddress = await anchor.utils.token.associatedAddress({
      mint: mintKeypair.publicKey,
      owner: wallet.publicKey,
    });
    console.log(`New token: ${mintKeypair.publicKey}`);

    // Derive the metadata and master edition addresses

    const metadataAddress = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mintKeypair.publicKey.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    )[0];
    console.log("Metadata initialized");

    const masterEditionAddress = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mintKeypair.publicKey.toBuffer(),
        Buffer.from("edition"),
      ],
      TOKEN_METADATA_PROGRAM_ID
    )[0];
    console.log("Master edition metadata initialized");

    // Transact with the "mint" function in our on-chain program
    try {
      await program.methods
        .mint(testNftTitle, testNftSymbol, testNftUri)
        .accounts({
          masterEdition: masterEditionAddress,
          metadata: metadataAddress,
          mint: mintKeypair.publicKey,
          tokenAccount: tokenAddress,
          mintAuthority: wallet.publicKey,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        })
        .signers([mintKeypair])
        .rpc();
    } catch (_) {
      console.log(_);
    }
  });
});
