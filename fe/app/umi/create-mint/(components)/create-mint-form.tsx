"use client";
import React from "react";
import useUmi from "@/hooks/useUmi";
import { generateSigner } from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { createMint } from "@metaplex-foundation/mpl-toolbox";
import { useForm } from "react-hook-form";
import {
  CreateMintSchema,
  CreateMintSchemaDefaults,
} from "@/lib/schemas/create-mint.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

function CreateMintForm() {
  const umi = useUmi();
  const { toast } = useToast();

  const form = useForm<CreateMintSchema>({
    resolver: zodResolver(CreateMintSchema),
    defaultValues: CreateMintSchemaDefaults,
  });

  const onSubmit = async (values: CreateMintSchema) => {
    const mint = generateSigner(umi);

    const tx = await createMint(umi, {
      mint,
      decimals: values.decimals,
      mintAuthority: umi.identity.publicKey,
      freezeAuthority: umi.identity.publicKey,
    }).sendAndConfirm(umi);

    const [signature, _] = base58.deserialize(tx.signature);

    toast({
      title: "Transaction Success",
      action: (
        <ToastAction
          altText="View on SolScan"
          onClick={() => {
            window.open(
              `https://solscan.io/tx/${signature}?cluster=devnet`,
              "_blank",
              "noopener"
            );
          }}
        >
          View on SolScan
        </ToastAction>
      ),
    });
  };

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="decimals"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Decimals</FormLabel>
            <FormControl>
              <Input placeholder="shadcn" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button onClick={form.handleSubmit(onSubmit)}>Submit</Button>
    </Form>
  );
}

export default CreateMintForm;
