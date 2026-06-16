import { z } from "zod";

export const createOrderSchema = z.object({
  body: z.object({
    restaurantId: z.string().uuid(),
    items: z.array(
      z.object({
        foodItemId: z.string().uuid(),
        quantity: z.number().int().positive(),
      })
    ).min(1),
  }),
});

export const orderIdParamSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});
