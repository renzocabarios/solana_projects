import { z } from "zod";

export const DepositFormSchema = z.object({
  value: z.coerce.number().gte(0),
});

export type IDepositFormSchema = z.infer<typeof DepositFormSchema>;

export const DepositFormSchemaDefaults: IDepositFormSchema = {
  value: 0,
};
