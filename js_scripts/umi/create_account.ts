// import { UMI_INSTANCE } from "./config";
// import {
//   generateSigner,
//   keypairIdentity,
//   publicKey,
// } from "@metaplex-foundation/umi";
// import { base58 } from "@metaplex-foundation/umi/serializers";
// import { PAYER_PRIVATE_KEY } from "../env";
// import { createAccount, mplToolbox } from "@metaplex-foundation/mpl-toolbox";
// // TODO: Fix this
// const main = async () => {
//   const decoded = base58.serialize(PAYER_PRIVATE_KEY);
//   const keypair = UMI_INSTANCE.eddsa.createKeypairFromSecretKey(decoded);
//   UMI_INSTANCE.use(keypairIdentity(keypair));

//   UMI_INSTANCE.use(mplToolbox());

//   const space = 42;
//   const KeyPair = generateSigner(UMI_INSTANCE);

//   const tx = await createAccount(UMI_INSTANCE, {
//     newAccount: KeyPair,
//     lamports: await UMI_INSTANCE.rpc.getRent(space),
//     space,
//     programId: UMI_INSTANCE.programs.get("mplToolbox").publicKey,
//   }).sendAndConfirm(UMI_INSTANCE);

//   const [signature, _] = base58.deserialize(tx.signature);
//   console.log(`Created ${KeyPair.publicKey.toString()}`);
//   console.log(`TX HASH ${signature}`);
// };

// main();
