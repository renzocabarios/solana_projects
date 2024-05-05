import { z } from "zod";

export const CreateFungibleTokenSchema = z.object({
  name: z.string().min(3),
  uri: z.string().url(),
  sellerFeeBasisPoints: z.coerce.number(),
});

export type CreateFungibleTokenSchema = z.infer<
  typeof CreateFungibleTokenSchema
>;

export const CreateFungibleTokenSchemaDefaults: CreateFungibleTokenSchema = {
  name: "",
  uri: "",
  sellerFeeBasisPoints: 0,
};
