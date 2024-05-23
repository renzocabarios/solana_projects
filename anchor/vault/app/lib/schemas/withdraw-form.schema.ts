import { z } from "zod";

export const WithdrawFormSchema = z.object({
  amount: z.coerce.number(),
});

export type WithdrawFormSchema = z.infer<typeof WithdrawFormSchema>;

export const WithdrawFormDefaults: WithdrawFormSchema = {
  amount: 0,
};
