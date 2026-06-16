import prisma from "../config/db.js";
import ApiError from "../utils/ApiError.js";

export const createFoodItem = async (ownerId, data) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: data.restaurantId },
  });

  if (!restaurant) {
    throw new ApiError(404, "Restaurant not found");
  }

  if (restaurant.ownerId !== ownerId) {
    throw new ApiError(403, "You can manage only your own restaurant");
  }

  return prisma.foodItem.create({ data });
};

export const updateFoodItem = async (ownerId, id, data) => {
  const foodItem = await prisma.foodItem.findUnique({
    where: { id },
    include: { restaurant: true },
  });

  if (!foodItem) {
    throw new ApiError(404, "Food item not found");
  }

  if (foodItem.restaurant.ownerId !== ownerId) {
    throw new ApiError(403, "You can manage only your own restaurant");
  }

  return prisma.foodItem.update({
    where: { id },
    data,
  });
};
