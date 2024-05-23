"use client";
import Navbar from "@/components/navbar";
import VaultList from "@/views/vault-list";
import MyVault from "@/views/my-vault";

import DepositForm from "@/views/deposit-form";
import WithdrawForm from "@/views/withdraw-form";

export default function Home() {
  return (
    <main className="relvative flex min-h-screen flex-col">
      <Navbar />

      <div className="h-[92vh] flex flex-col items-center p-10">
        <div className="min-w-[700px] flex flex-col gap-4 border-x border-gray-300 p-10">
          <MyVault />
          <DepositForm />
          <WithdrawForm />
          <div className="h-[1px] bg-gray-400"></div>
          <VaultList />
        </div>
      </div>
    </main>
  );
}
