import ENV from "../../../env/index.js";
import { generateAccess } from "../../../utils/index.js";
import { Request, Response } from "express";
import { Connection, PublicKey, clusterApiUrl, Keypair } from "@solana/web3.js";
import { Program, AnchorProvider, web3 } from "@coral-xyz/anchor";
import { ExpressTodo, IDL } from "../../../../../target/types/express_todo";
import bs58 from "bs58";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet.js";

const connection = new Connection(clusterApiUrl("devnet"));
const program = new Program<ExpressTodo>(
  IDL,
  new PublicKey("DSKk1maqJij5xqjFqgJNcKgo8sKgRzGZjjr1BWRFP4dP"),
  {
    connection,
  }
);

const account = Keypair.fromSecretKey(bs58.decode(ENV.PRIVATE_KEY ?? ""));

const wallet = new NodeWallet(account);

const provider = new AnchorProvider(connection, wallet, {
  commitment: "processed",
});

const getAll = async (_req: Request, _res: Response) => {
  const data = await program.account.customer.all();
  _res.send({
    data,
    status: "success",
    message: "Get todo success",
    meta: {
      access: generateAccess({}),
    },
  });
};

const add = async (_req: Request, _res: Response) => {
  const { email, name } = _req.body;
  const keyPair = Keypair.generate();
  await program.methods
    .initialize(name, email)
    .accounts({
      customer: keyPair.publicKey,
      signer: provider.publicKey,
      systemProgram: web3.SystemProgram.programId,
    })
    .signers([keyPair])
    .rpc();

  _res.send({
    status: "successs",
    message: "Create todo success",
    data: [],
    meta: {
      access: generateAccess({}),
    },
  });
};

const update = async (_req: Request, _res: Response) => {
  const { id } = _req.params;
  const { name, email } = _req.body;
  await program.methods
    .initialize(name, email)
    .accounts({
      customer: new PublicKey(id),
    })
    .rpc();

  _res.send({
    status: "successs",
    message: "Update todo success",
    data: [],
    meta: {
      access: generateAccess({}),
    },
  });
};

const removeOne = async (_req: Request, _res: Response) => {
  const { id } = _req.params;
  await program.methods
    .delete()
    .accounts({
      customer: new PublicKey(id),
    })
    .rpc();

  _res.send({
    status: "successs",
    message: "Delete todo success",
    data: [],
    meta: {
      access: generateAccess({}),
    },
  });
};

export { getAll, add, update, removeOne };
