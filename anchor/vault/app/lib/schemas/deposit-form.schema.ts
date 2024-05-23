import { z } from "zod";

export const DepositFormSchema = z.object({
  amount: z.coerce.number(),
});

export type DepositFormSchema = z.infer<typeof DepositFormSchema>;

export const DepositFormDefaults: DepositFormSchema = {
  amount: 0,
};
