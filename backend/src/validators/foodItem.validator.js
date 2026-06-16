import { z } from "zod";

export const createFoodItemSchema = z.object({
  body: z.object({
    restaurantId: z.string().uuid(),
    name: z.string().min(2),
    description: z.string().optional(),
    price: z.number().positive(),
    isAvailable: z.boolean().optional(),
  }),
});

export const updateFoodItemSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    price: z.number().positive().optional(),
    isAvailable: z.boolean().optional(),
  }),
});
