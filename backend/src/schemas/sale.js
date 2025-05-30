import { z } from "zod";

const baseSchema = z.object({
  business_id: z.number().int().positive(),
  user_id: z.number().int().positive(),
  cash_audit_id: z.number().int().positive().nullable().optional(),
  sale_date: z.string().datetime().optional(),
  total: z.number().positive()
});

export const getSaleSchema = () => baseSchema;
