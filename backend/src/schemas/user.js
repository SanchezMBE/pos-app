import { z } from "zod";

const baseSchema = z.object({
  business_id: z.number().int().positive(),
  username: z.string().min(3),
  password: z.string().min(8),
  full_name: z.string().min(3),
  role: z.enum(["admin", "cashier"])
});

export const getUserSchema = (type = "create") => {
  if (type === "update") return baseSchema.omit({ password: true }).partial();
  return baseSchema;
};
