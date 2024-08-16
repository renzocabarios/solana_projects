import { Orao } from "@orao-network/solana-vrf";
import { clusterApiUrl, Connection, Keypair } from "@solana/web3.js";
import { AnchorProvider } from "@coral-xyz/anchor";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import wallet from "./wallet.json";
(async () => {
  const connection = new Connection(clusterApiUrl("devnet"), "finalized");
  const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

  const nodeWallet = new NodeWallet(keypair);

  const provider = new AnchorProvider(connection, nodeWallet);
  const vrf = new Orao(provider);

  //   Request randomness
  //   const [seed, tx] = await (await vrf.request()).rpc();
  //   console.log("Your transaction is " + tx);
  //   console.log("Your seed is " + seed);

  //   Check random number
  const randomnessAcc = await vrf.waitFulfilled(
    new Uint8Array([
      81, 202, 102, 157, 220, 51, 238, 113, 161, 11, 126, 129, 225, 97, 249, 34,
      23, 51, 8, 215, 149, 103, 16, 250, 28, 69, 15, 129, 241, 1, 174, 154,
    ])
  );
  console.log("Your client is " + randomnessAcc.client);
  console.log("Your randomness is " + randomnessAcc.randomness);
  console.log("Your responses is " + randomnessAcc.responses);
  console.log("Your seed is " + randomnessAcc.seed);
})();
