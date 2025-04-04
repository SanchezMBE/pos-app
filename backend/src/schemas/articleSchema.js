import { z } from "zod";

export const articleSchema = z.object({
  category_id: z.number().int().positive({
    message: "Category ID must be a positive integer"
  }),
  description: z
    .string()
    .min(3, {
      message: "Description must be at least 3 characters long"
    })
    .max(255, {
      message: "Description must not exceed 255 characters"
    }),
  code: z
    .number()
    .int()
    .positive({
      message: "Code must be a positive integer"
    })
    .nullable()
    .optional(),
  barcode: z
    .string()
    .max(13, {
      message: "Barcode must not exceed 13 characters"
    })
    .nullable()
    .optional(),
  price: z.number().positive({
    message: "Price must be a positive number"
  }),
  cost: z
    .number()
    .nonnegative({
      message: "Cost must be a non-negative number"
    })
    .nullable()
    .optional(),
  stock: z
    .number()
    .int()
    .nonnegative({
      message: "Stock must be a non-negative integer"
    })
    .nullable()
    .optional()
});
