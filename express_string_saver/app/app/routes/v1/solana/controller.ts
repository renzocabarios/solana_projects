import ENV from "../../../env/";
import { generateAccess } from "../../../utils/index.js";
import { Request, Response } from "express";
import { AnchorProvider, Program, web3 } from "@coral-xyz/anchor";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet.js";
import { Connection, Keypair, PublicKey, clusterApiUrl } from "@solana/web3.js";
import {
  IDL,
  ExpressStringSaver,
} from "../../../../../target/types/express_string_saver";
import { decode } from "@coral-xyz/anchor/dist/cjs/utils/bytes/bs58";

const connection = new Connection(clusterApiUrl("devnet"));

const keypair = Keypair.fromSecretKey(decode(ENV.PRIVATE_KEY));

const wallet = new NodeWallet(keypair);

const provider = new AnchorProvider(connection, wallet, {
  commitment: "finalized",
});

const program = new Program<ExpressStringSaver>(
  IDL,
  new PublicKey("DgYFnBtV7hVEGZbiByNkE5CLaPyJyeWH9e3jXiznq4rN"),
  provider
);

const getAll = async (_req: Request, _res: Response) => {
  const data = await program.account.stringHolder.all();
  console.log(data);

  _res.send({
    data,
    status: "success",
    message: "Get holder success",
    meta: {
      access: generateAccess({}),
    },
  });
};

const add = async (_req: Request, _res: Response) => {
  const holder = web3.Keypair.generate();

  await program.methods
    .initialize()
    .accounts({
      stringHolder: holder.publicKey,
      signer: provider.publicKey,
      systemProgram: web3.SystemProgram.programId,
    })
    .signers([holder])
    .rpc();

  _res.send({
    data: [],
    status: "success",
    message: "Create holder success",
    meta: {
      access: generateAccess({}),
    },
  });
};

const update = async (_req: Request, _res: Response) => {
  const { id } = _req.params;
  const tx = await program.methods
    .update(_req.body.data)
    .accounts({
      stringHolder: new PublicKey(id),
    })
    .rpc();

  console.log(tx);

  _res.send({
    data: [],
    status: "success",
    message: "Update holder success",
    meta: {
      access: generateAccess({}),
    },
  });
};

export { getAll, add, update };
