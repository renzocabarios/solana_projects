"use client";
import useGetAllVaults from "@/hooks/useGetAllVaults";
import { lamportsToSOL, truncate } from "@/lib/helpers";

export default function VaultList() {
  const { data } = useGetAllVaults();

  return (
    <div className="flex flex-col gap-2">
      {data.map((e) => {
        return (
          <div
            className="flex items-center justify-between p-4 border border-gray-400 rounded-xl"
            key={e.publicKey.toString()}
          >
            <p className="text-xs font-semibold">
              {truncate(e.account.vaultAuthority.toString())}
            </p>
            <p>{lamportsToSOL(Number(e.account.amount)).toFixed(3)} SOL</p>
          </div>
        );
      })}
    </div>
  );
}
