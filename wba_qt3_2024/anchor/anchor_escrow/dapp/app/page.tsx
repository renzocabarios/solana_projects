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
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import {
  CreateTokenSchema,
  CreateTokenSchemaDefaults,
  ICreateTokenSchema,
} from "@/lib/schemas/create-token.schema";

import {
  MakeFormSchema,
  MakeFormSchemaDefaults,
  IMakeFormSchema,
} from "@/lib/schemas/make-form.schema";
import LoadingModal from "@/components/loading-modal";
import useCreateToken from "@/hooks/useCreateToken";
import useMake from "@/hooks/useMake";
import { generateRandomSeed, getEscrowPDA } from "@/lib/programs";
import { BN } from "@coral-xyz/anchor";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import useGetEscrows from "@/hooks/useGetEscrows";
import { truncateAddress } from "@/lib/utils";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const anchor = useAnchorWallet();

  const { mutate: createToken, isPending: createTokenIsPending } =
    useCreateToken();
  const { mutate: make, isPending: makeIsPending } = useMake();

  const { data: escrows } = useGetEscrows();

  useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm<IDepositFormSchema>({
    resolver: zodResolver(DepositFormSchema),
    defaultValues: DepositFormSchemaDefaults,
  });

  const createTokenForm = useForm<ICreateTokenSchema>({
    resolver: zodResolver(CreateTokenSchema),
    defaultValues: CreateTokenSchemaDefaults,
  });

  const makeForm = useForm<IMakeFormSchema>({
    resolver: zodResolver(MakeFormSchema),
    defaultValues: MakeFormSchemaDefaults,
  });

  async function onCreateToken(values: ICreateTokenSchema) {
    createToken({ ...values });
  }

  async function onCreateEscrow(values: IMakeFormSchema) {
    if (anchor) {
      const associatedToken = getAssociatedTokenAddressSync(
        new PublicKey(values.mintA),
        anchor.publicKey,
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      const randomSeed = generateRandomSeed();

      const escrowPDA = getEscrowPDA({
        seed: randomSeed,
        maker: anchor.publicKey,
      });

      const vault = getAssociatedTokenAddressSync(
        new PublicKey(values.mintA),
        escrowPDA,
        true,
        TOKEN_PROGRAM_ID
      );
      make({
        args: {
          seed: randomSeed,
          deposit: new BN(values.mintAAmount),
          receive: new BN(values.mintBAmount),
        },
        accounts: {
          maker: anchor.publicKey,
          mintA: new PublicKey(values.mintA),
          mintB: new PublicKey(values.mintB),
          makerAtaA: associatedToken,
          escrow: escrowPDA,
          vault: vault,
          tokenProgram: TOKEN_PROGRAM_ID,
        },
      });
    }
  }

  // async function onDeposit(values: IDepositFormSchema) {
  //   deposit(values.value);
  // }

  // async function onWithdraw(values: IDepositFormSchema) {
  //   withdraw(values.value);
  // }

  if (!mounted) {
    return <></>;
  }

  return (
    <>
      <LoadingModal open={createTokenIsPending || makeIsPending} />
      <div className="flex w-full flex-col items-center min-h-screen">
        <div className="w-full relative flex justify-center  bg-red-100">
          <div className="sticky top-0 right-0 w-full max-w-[1440px] flex items-center justify-between p-4">
            <p className="text-2xl font-medium">Solana Scaffold</p>
            <WalletMultiButton />
          </div>
        </div>

        <div className="p-8 flex flex-col gap-4 w-full max-w-[1440px]">
          <div className="w-full flex gap-4">
            <div className="flex flex-col gap-4">
              <div className="min-w-[400px] flex flex-col gap-4 p-4 border border-slate-500 rounded-xl">
                <Form {...makeForm}>
                  <p className="text-xl font-semibold">Create Escrow</p>
                  <FormField
                    control={makeForm.control}
                    name="mintA"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deposit Mint Address</FormLabel>
                        <FormControl>
                          <Input placeholder="shadcn" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={makeForm.control}
                    name="mintAAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deposit Amount</FormLabel>
                        <FormControl>
                          <Input placeholder="shadcn" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={makeForm.control}
                    name="mintB"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Receive Mint Address</FormLabel>
                        <FormControl>
                          <Input placeholder="shadcn" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={makeForm.control}
                    name="mintBAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Receive Amount</FormLabel>
                        <FormControl>
                          <Input placeholder="shadcn" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center w-full gap-8">
                    <Button
                      onClick={makeForm.handleSubmit(onCreateEscrow)}
                      className="flex-1"
                    >
                      Create Escrow
                    </Button>
                  </div>
                </Form>
              </div>

              <div className="min-w-[400px] flex flex-col gap-4 p-4 border border-slate-500 rounded-xl">
                <div className="flex flex-col">
                  <p className="text-xs text-slate-600 ">Don't have a token?</p>
                  <p className="text-xl font-semibold">Create your own token</p>
                </div>

                <Form {...createTokenForm}>
                  <FormField
                    control={createTokenForm.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount to mint</FormLabel>
                        <FormControl>
                          <Input placeholder="shadcn" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createTokenForm.control}
                    name="decimals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Token Decimals</FormLabel>
                        <FormControl>
                          <Input placeholder="shadcn" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center w-full gap-8">
                    <Button
                      onClick={createTokenForm.handleSubmit(onCreateToken)}
                      className="flex-1"
                    >
                      Create Mint
                    </Button>
                  </div>
                </Form>
              </div>
            </div>

            <div className="flex-1 flex gap-4">
              {(escrows ?? []).map((e) => {
                return (
                  <div
                    key={e.publicKey.toString()}
                    className="flex flex-col gap-4 p-4 border border-slate-500 rounded-xl basis-1/3 h-fit"
                  >
                    <p>Maker: {truncateAddress(e.account.maker.toString())}</p>

                    <div className="flex items-center gap-2">
                      <p>{truncateAddress(e.account.mintA.toString())}</p>
                      <p>for</p>
                      <p>{truncateAddress(e.account.mintB.toString())}</p>
                    </div>
                    <p>{e.account.receive.toNumber()}</p>

                    {anchor?.publicKey.toString() ===
                    e.account.maker.toString() ? (
                      <Button>Retract Offer</Button>
                    ) : (
                      <Button>Claim</Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="w-full flex flex-col gap-4 items-center"></div>
        </div>
        {/* 

    */}
      </div>
    </>
  );
}
