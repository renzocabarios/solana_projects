"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { SystemProgram } from "@solana/web3.js";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { getEnrollProgram, getEnrolls } from "@/lib/programs/enroll";

export default function EnrollButton() {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const onEnroll = async () => {
    if (publicKey) {
      const enrollment = getEnrolls(publicKey);

      const program = getEnrollProgram({
        connection,
        wallet,
      });

      const tx = await program.methods
        .initialize("asd", "asd")
        .accounts({
          payer: publicKey,
          enrollment: enrollment,
          systemProgram: SystemProgram.programId,
        })
        .transaction();

      const transactionSignature = await sendTransaction(tx, connection);
    }
  };

  return <Button onClick={onEnroll}>Enroll Now</Button>;
}
