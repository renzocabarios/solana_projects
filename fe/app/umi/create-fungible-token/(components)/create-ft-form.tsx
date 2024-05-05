"use client";

import React from "react";
import useUmi from "@/hooks/useUmi";
import { percentAmount, generateSigner } from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { createFungible } from "@metaplex-foundation/mpl-token-metadata";
import {
  CreateFungibleTokenSchema,
  CreateFungibleTokenSchemaDefaults,
} from "@/lib/schemas/create-fungible-token.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

function CreateFTForm() {
  const umi = useUmi();
  const { toast } = useToast();

  const form = useForm<CreateFungibleTokenSchema>({
    resolver: zodResolver(CreateFungibleTokenSchema),
    defaultValues: CreateFungibleTokenSchemaDefaults,
  });

  const onSubmit = async (values: CreateFungibleTokenSchema) => {
    const mint = generateSigner(umi);

    const tx = await createFungible(umi, {
      mint,
      name: values.name,
      uri: values.uri,
      sellerFeeBasisPoints: percentAmount(values.sellerFeeBasisPoints),
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
        name="uri"
        render={({ field }) => (
          <FormItem>
            <FormLabel>URI</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="sellerFeeBasisPoints"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Seller Fee Basis Points</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button onClick={form.handleSubmit(onSubmit)}>Submit</Button>
    </Form>
  );
}

export default CreateFTForm;
