"use client";
import { Navbar } from "@/components";
import useWeb3 from "@/components/ConnectButton/hook";
import {
  SystemProgram,
  PublicKey,
  Connection,
  clusterApiUrl,
  TransactionMessage,
  VersionedTransaction,
  Keypair,
} from "@solana/web3.js";
import { useState } from "react";
import { AnchorProvider, Program, web3 } from "@coral-xyz/anchor";
export type StringSaverDapp = {
  version: "0.1.0";
  name: "string_saver_dapp";
  instructions: [
    {
      name: "initialize";
      accounts: [
        {
          name: "stringHolder";
          isMut: true;
          isSigner: true;
        },
        {
          name: "signer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "data";
          type: "string";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "stringHolder";
      type: {
        kind: "struct";
        fields: [
          {
            name: "data";
            type: "string";
          }
        ];
      };
    }
  ];
};

export const IDL: StringSaverDapp = {
  version: "0.1.0",
  name: "string_saver_dapp",
  instructions: [
    {
      name: "initialize",
      accounts: [
        {
          name: "stringHolder",
          isMut: true,
          isSigner: true,
        },
        {
          name: "signer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "data",
          type: "string",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "stringHolder",
      type: {
        kind: "struct",
        fields: [
          {
            name: "data",
            type: "string",
          },
        ],
      },
    },
  ],
};

export default function Home() {
  const [publicKey, setpublicKey] = useState("");
  const { wallet, provider } = useWeb3();

  const changeHandler = (e: any) => {
    setpublicKey(e.target.value);
  };

  const getLatestBlockhash = async () => {
    const connection = new Connection(clusterApiUrl("devnet"));
    return (await connection.getLatestBlockhash("finalized")).blockhash;
  };

  const getAnchor = (provider: any) => {
    const connection = new Connection(clusterApiUrl("devnet"));
    return new AnchorProvider(connection, provider, {
      commitment: "confirmed",
    });
  };
  const send = async () => {
    const connection = new Connection(clusterApiUrl("devnet"));
    const program = new Program<StringSaverDapp>(
      IDL,
      new PublicKey("4EZmVGSvLdh7J25EftVKE4rs1SwmGqnCkn4DdmbQF5oJ"),
      {
        connection,
      }
    );

    const keyPair = Keypair.generate();

    const instruction = await program.methods
      .initialize("User")
      .accounts({
        stringHolder: keyPair.publicKey,
        signer: getAnchor(provider).wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .();

    const instructions = [
      // SystemProgram.transfer({
      //   fromPubkey: new PublicKey(wallet ?? ""),
      //   toPubkey: keyPair.publicKey,
      //   lamports: 10000,
      // }),
      instruction,
    ];

    const messageV0 = new TransactionMessage({
      payerKey: new PublicKey(wallet ?? ""),
      recentBlockhash: await getLatestBlockhash(),
      instructions,
    }).compileToV0Message();

    const transactionV0 = new VersionedTransaction(messageV0);

    if (provider) {
      const signature = await getAnchor(provider).sendAndConfirm(transactionV0);
      console.log(signature);
    }
  };

  return (
    <main>
      <Navbar />
      <input type="text" onChange={changeHandler} />
      <button onClick={send}> Send 1 SOL</button>
    </main>
  );
}
