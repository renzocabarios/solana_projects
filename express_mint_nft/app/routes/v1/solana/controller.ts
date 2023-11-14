// import ENV from "../../../env/";
// import { generateAccess } from "../../../utils/index.js";
// import { Request, Response } from "express";
// import { AnchorProvider, Program, web3 } from "@coral-xyz/anchor";
// import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet.js";
// import { Connection, Keypair, PublicKey, clusterApiUrl } from "@solana/web3.js";

// import { decode } from "@coral-xyz/anchor/dist/cjs/utils/bytes/bs58";

// import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";

// import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
// import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
// import { generateSigner, percentAmount } from "@metaplex-foundation/umi";
// import {
//   createNft,
//   fetchDigitalAsset,
// } from "@metaplex-foundation/mpl-token-metadata";
// // Use the RPC endpoint of your choice.
// const umi = createUmi("http://127.0.0.1:8899").use(mplTokenMetadata());

// const mint = generateSigner(umi);

// const start = async () => {
//   const [imageUri] = await umi.uploader.upload([imageFile]);

//   await createNft(umi, {
//     mint,
//     name: "My NFT",
//     uri: "https://example.com/my-nft.json",
//     sellerFeeBasisPoints: percentAmount(5.5),
//   }).sendAndConfirm(umi);

//   const asset = await fetchDigitalAsset(umi, mint.publicKey);
// };

// const getKeypairIdentity = (keypair: any) => {
//   return keypairIdentity(keypair);
// };

// const connection = new Connection(clusterApiUrl("devnet"));

// const keypair = Keypair.fromSecretKey(decode(ENV.PRIVATE_KEY));

// const wallet = new NodeWallet(keypair);

// const provider = new AnchorProvider(connection, wallet, {
//   commitment: "finalized",
// });

// // const getAll = async (_req: Request, _res: Response) => {
// //   const data = await program.account.stringHolder.all();
// //   console.log(data);

// //   _res.send({
// //     data,
// //     status: "success",
// //     message: "Get holder success",
// //     meta: {
// //       access: generateAccess({}),
// //     },
// //   });
// // };

// // const add = async (_req: Request, _res: Response) => {
// //   const holder = web3.Keypair.generate();

// //   await program.methods
// //     .initialize()
// //     .accounts({
// //       stringHolder: holder.publicKey,
// //       signer: provider.publicKey,
// //       systemProgram: web3.SystemProgram.programId,
// //     })
// //     .signers([holder])
// //     .rpc();

// //   _res.send({
// //     data: [],
// //     status: "success",
// //     message: "Create holder success",
// //     meta: {
// //       access: generateAccess({}),
// //     },
// //   });
// // };

// // const update = async (_req: Request, _res: Response) => {
// //   const { id } = _req.params;
// //   const tx = await program.methods
// //     .update(_req.body.data)
// //     .accounts({
// //       stringHolder: new PublicKey(id),
// //     })
// //     .rpc();

// //   console.log(tx);

// //   _res.send({
// //     data: [],
// //     status: "success",
// //     message: "Update holder success",
// //     meta: {
// //       access: generateAccess({}),
// //     },
// //   });
// // };

// // export { getAll, add, update };
