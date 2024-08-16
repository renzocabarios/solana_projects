"use client";
import { Button } from "@/components/ui/button";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  DepositFormSchema,
  DepositFormSchemaDefaults,
  IDepositFormSchema,
} from "@/lib/schemas/deposit-form.schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useDeposit from "@/hooks/useDeposit";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import useWithdraw from "@/hooks/useWithdraw";
import useGetVaultBalance from "@/hooks/useGetVaultBalance";
import LoadingModal from "@/components/loading-modal";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const anchor = useAnchorWallet();
  const { mutate: deposit, isPending: depositIsPending } = useDeposit();
  const { mutate: withdraw, isPending: withdrawIsPending } = useWithdraw();
  const { data } = useGetVaultBalance(anchor?.publicKey.toString() ?? "");

  useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm<IDepositFormSchema>({
    resolver: zodResolver(DepositFormSchema),
    defaultValues: DepositFormSchemaDefaults,
  });

  async function onDeposit(values: IDepositFormSchema) {
    deposit(values.value);
  }

  async function onWithdraw(values: IDepositFormSchema) {
    withdraw(values.value);
  }

  if (!mounted) {
    return <></>;
  }

  return (
    <>
      <LoadingModal open={depositIsPending || withdrawIsPending} />
      <div className="flex w-full flex-col items-center min-h-screen">
        <div className="w-full relative flex justify-center">
          <div className="sticky top-0 right-0 w-full max-w-[1440px] flex items-center justify-between p-4 bg-red-100">
            <p className="text-2xl font-medium">Solana Scaffold</p>
            <WalletMultiButton />
          </div>
        </div>

        <div className="p-8 flex flex-col gap-4 w-full max-w-[1440px]">
          <div className="w-full flex flex-col gap-4 items-center">
            <p className="text-2xl">
              Amount deposited: {(data ?? 0) / LAMPORTS_PER_SOL}
            </p>

            <div className="min-w-[400px] flex flex-col gap-4">
              <Form {...form}>
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount of SOL to deposit/withdraw</FormLabel>
                      <FormControl>
                        <Input placeholder="shadcn" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center w-full gap-8">
                  <Button
                    onClick={form.handleSubmit(onDeposit)}
                    className="flex-1"
                  >
                    Deposit
                  </Button>
                  <Button
                    onClick={form.handleSubmit(onWithdraw)}
                    className="flex-1"
                  >
                    Withdraw
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
        {/* 

    */}
      </div>
    </>
  );
}
