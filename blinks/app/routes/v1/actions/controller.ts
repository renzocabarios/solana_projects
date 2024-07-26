import { Request, Response } from "express";
import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { ActionGetResponse, createPostResponse } from "@solana/actions";

const DEFAULT_SOL_ADDRESS = new PublicKey(
  "8TcNg37r7EuhDzNUJ8pKgcMNALVGkmSyFXdUiP4nikJP"
);
const DEFAULT_SOL_AMOUNT = 1;
const get = async (_req: Request, _res: Response) => {
  let fullUrl = _req.protocol + "://" + _req.get("host") + _req.originalUrl;
  console.log(fullUrl);
  console.log(_req.protocol + "://" + _req.get("host"));

  const baseHref =
    _req.protocol +
    "://" +
    _req.get("host") +
    `/api/v1/actions/transfer-sol?to=${DEFAULT_SOL_ADDRESS.toBase58()}`;
  console.log(baseHref);

  const payload: ActionGetResponse = {
    title: "Actions Example - Transfer Native SOL",
    icon: "https://solana-actions.vercel.app/solana_devs.jpg",
    description: "Transfer SOL to another Solana wallet",
    label: "Transfer", // this value will be ignored since `links.actions` exists
    links: {
      actions: [
        {
          label: "Send 1 SOL", // button text
          href: `${baseHref}&amount=${"1"}`,
        },
        {
          label: "Send 5 SOL", // button text
          href: `${baseHref}&amount=${"5"}`,
        },
        {
          label: "Send 10 SOL", // button text
          href: `${baseHref}&amount=${"10"}`,
        },
        {
          label: "Send SOL", // button text
          href: `${baseHref}&amount={amount}`, // this href will have a text input
          parameters: [
            {
              name: "amount", // parameter name in the `href` above
              label: "Enter the amount of SOL to send", // placeholder of the text input
              required: true,
            },
          ],
        },
      ],
    },
  };

  _res.send({
    data: [payload],
    status: "success",
    message: "Get user success",
  });
};

async function post(_req: Request, _res: Response) {
  try {
    const { amount, toPubkey } = validatedQueryParams(_req.query);
    const { account } = _req.body;

    if (!account) {
      throw new Error('Invalid "account" provided');
    }

    // const connection = new Connection(
    //   "https://mainnet.helius-rpc.com/?api-key=86841795-5a03-4192-bd44-cbe41117cb77"
    // );
    const connection = new Connection(
      "https://devnet.helius-rpc.com/?api-key=86841795-5a03-4192-bd44-cbe41117cb77"
    );

    const fromPubkey = new PublicKey(account);
    const minimumBalance = await connection.getMinimumBalanceForRentExemption(
      0
    );

    if (amount * LAMPORTS_PER_SOL < minimumBalance) {
      throw new Error(`Account may not be rent exempt: ${toPubkey.toBase58()}`);
    }

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    const transaction = new Transaction({
      feePayer: fromPubkey,
      blockhash,
      lastValidBlockHeight,
    }).add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );

    const payload = await createPostResponse({
      fields: {
        transaction,
        message: `Send ${amount} SOL to ${toPubkey.toBase58()}`,
      },
    });

    _res.json(payload);
  } catch (err) {
    console.log(err);

    _res.status(400).json({ error: "An unknown error occurred" });
  }
}

async function sendRequest(_req: Request, _res: Response) {
  const {transaction} = _req.body
}

function validatedQueryParams(query: any) {
  let toPubkey = DEFAULT_SOL_ADDRESS;
  let amount = DEFAULT_SOL_AMOUNT;

  if (query.to) {
    try {
      toPubkey = new PublicKey(query.to);
    } catch (err) {
      throw new Error("Invalid input query parameter: to");
    }
  }

  try {
    if (query.amount) {
      amount = parseFloat(query.amount);
    }
    if (amount <= 0) throw new Error("amount is too small");
  } catch (err) {
    throw new Error("Invalid input query parameter: amount");
  }

  return { amount, toPubkey };
}

export { get, post };
