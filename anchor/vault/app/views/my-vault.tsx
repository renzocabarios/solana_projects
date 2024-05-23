"use client";
import { lamportsToSOL, truncate } from "@/lib/helpers";
import CreateVaultButton from "./create-vault-button";
import useGetMyVault from "@/hooks/useGetMyVault";

export default function MyVault() {
  const { data, isPending } = useGetMyVault();

  if (!isPending && data) {
    return (
      <div className=" flex flex-col gap-2">
        <div></div>
        <p className="font-semibold">My Vault</p>
        <div className="flex items-center justify-between border border-gray-400 rounded-xl p-4  ">
          <p className="text-xs font-semibold">
            {truncate(data.vaultAuthority.toString())}
          </p>
          <p>{lamportsToSOL(Number(data.amount)).toFixed(3)} SOL</p>
        </div>
      </div>
    );
  }

  return <CreateVaultButton />;
}
