import { z } from "zod";

export const CreateTokenSchema = z.object({
  amount: z.coerce.number().gte(0),
  decimals: z.coerce.number().gte(0),
});

export type ICreateTokenSchema = z.infer<typeof CreateTokenSchema>;

export const CreateTokenSchemaDefaults: ICreateTokenSchema = {
  amount: 0,
  decimals: 0,
};
