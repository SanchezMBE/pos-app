import { z } from "zod";

const baseSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  address: z.string().max(255).nullable().optional(),
  phone: z.string().max(15).nullable().optional(),
  email: z.string().email("Correo inválido").nullable().optional()
});

export const getBusinessSchema = (type = "create") => {
  if (type === "update") return baseSchema.partial();
  return baseSchema;
};
