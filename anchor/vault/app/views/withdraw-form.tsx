"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  DepositFormDefaults,
  DepositFormSchema,
} from "@/lib/schemas/deposit-form.schema";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  VAULT_PROGRAM_ID,
  depositToVault,
  getVaultAddress,
  withdrawFromVault,
} from "@/lib/programs/vault_program";
import WriteButton from "@/components/write-button";
import { Button } from "@/components/ui/button";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import useSendTransaction from "@/hooks/useSendTransaction";
import { SOLToLamports } from "@/lib/helpers";
import {
  WithdrawFormDefaults,
  WithdrawFormSchema,
} from "@/lib/schemas/withdraw-form.schema";

export default function WithdrawForm() {
  const form = useForm<WithdrawFormSchema>({
    resolver: zodResolver(WithdrawFormSchema),
    defaultValues: WithdrawFormDefaults,
  });

  const { handleSendTransaction } = useSendTransaction();
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  async function onSubmit(values: WithdrawFormSchema) {
    if (wallet) {
      const [vault_pkey, vault_bump] = getVaultAddress(
        wallet.publicKey,
        VAULT_PROGRAM_ID
      );

      const tx = await (
        await withdrawFromVault(
          { connection, wallet },
          { amount: SOLToLamports(values.amount) },
          { vaultAccount: vault_pkey, vaultAuthority: wallet?.publicKey }
        )
      ).transaction();

      handleSendTransaction(tx);
    }
  }

  return (
    <div className="flex items-center justify-end">
      <Form {...form}>
        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="number" className="bg-gray-200" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <WriteButton>
            <Button onClick={form.handleSubmit(onSubmit)}>Withdraw</Button>
          </WriteButton>
        </div>
      </Form>
    </div>
  );
}
