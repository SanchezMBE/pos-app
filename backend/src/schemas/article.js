import { z } from "zod";

// Esquema base completo
const baseArticleSchema = z.object({
  category_id: z.number().int().positive({
    message: "Categoría id debe ser un número entero positivo"
  }),
  description: z
    .string()
    .min(3, {
      message: "Descripción debe tener al menos 3 caracteres"
    })
    .max(255, {
      message: "Descripción no debe exceder 255 caracteres"
    }),
  code: z
    .string()
    .min(1, {
      message: "Código es requerido"
    })
    .max(5, {
      message: "Código no debe exceder 5 caracteres"
    })
    .regex(/^[0-9]+$/, {
      message: "Código debe ser un número entero positivo"
    })
    .nullable()
    .optional(),
  barcode: z
    .string()
    .min(1, {
      message: "El código de barras no puede ser nulo"
    })
    .regex(/^[0-9]+$/, {
      message: "Código de barras debe ser un número entero positivo"
    })
    .refine((val) => [8, 12, 13].includes(val.length), {
      message: "La longitud del código de barras debe ser 8, 12 o 13 caracteres"
    })
    .nullable()
    .optional(),
  price: z.number().positive({
    message: "Precio debe ser un número positivo"
  }),
  cost: z
    .number()
    .nonnegative({
      message: "Costo debe ser un número no negativo"
    })
    .nullable()
    .optional(),
  stock: z
    .number()
    .int()
    .nonnegative({
      message: "Existencias debe ser un número entero no negativo"
    })
    .nullable()
    .optional()
});

// Función para generar variantes del esquema
export const getArticleSchema = ({ partial = false, fields = null } = {}) => {
  let schema = baseArticleSchema;

  if (fields) schema = schema.pick(fields);
  if (partial) schema = schema.partial();

  return schema;
};
