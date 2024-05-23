"use client";
import React, { useEffect, useState } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Github } from "lucide-react";
import { getEnrollProgram } from "@/lib/programs/enroll";

export default function Enrollees() {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const [enrollees, setenrollees] = useState<any[]>([]);

  useEffect(() => {
    const init = async () => {
      const program = getEnrollProgram({ connection, wallet });
      const accountData = await program.account.enrollment.all();
      setenrollees(accountData);
    };
    init();
  }, []);

  return (
    <div className="flex flex-col gap-3 p-5 rounded-xl border">
      {enrollees.map((enrollee) => (
        <EnrolleeCard
          key={enrollee.publicKey.toString()}
          id={enrollee.publicKey.toString()}
          discord={enrollee.account.discord}
          github={enrollee.account.github}
        />
      ))}
    </div>
  );
}

interface IEnrolleeCardProps {
  github: string;
  discord: string;
  id: string;
}

function EnrolleeCard({ github, discord, id }: IEnrolleeCardProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-2">
        <p className="text-[10px]">{id}</p>
        <div className="flex items-center gap-2">
          <Github />
          <p className="text-sm font-medium">{github}</p>
        </div>
      </div>
      {/* <p className="text-sm font-bold">12/06/2024</p> */}
    </div>
  );
}
