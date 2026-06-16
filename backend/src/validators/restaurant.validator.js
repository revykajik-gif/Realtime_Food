import { z } from "zod";

export const createRestaurantSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    address: z.string().min(5),
    latitude: z.number(),
    longitude: z.number(),
  }),
});
