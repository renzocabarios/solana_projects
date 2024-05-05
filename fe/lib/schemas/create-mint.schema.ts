import { z } from "zod";

export const CreateMintSchema = z.object({
  decimals: z.coerce.number(),
});

export type CreateMintSchema = z.infer<typeof CreateMintSchema>;

export const CreateMintSchemaDefaults: CreateMintSchema = {
  decimals: 0,
};
