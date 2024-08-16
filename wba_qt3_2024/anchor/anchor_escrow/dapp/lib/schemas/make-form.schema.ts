import { z } from "zod";

export const MakeFormSchema = z.object({
  mintA: z.string().min(23),
  mintB: z.string().min(23),
  mintAAmount: z.coerce.number().gte(0),
  mintBAmount: z.coerce.number().gte(0),
});

export type IMakeFormSchema = z.infer<typeof MakeFormSchema>;

export const MakeFormSchemaDefaults: IMakeFormSchema = {
  mintA: "",
  mintB: "",
  mintAAmount: 0,
  mintBAmount: 0,
};
