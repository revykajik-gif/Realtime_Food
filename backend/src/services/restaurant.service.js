import prisma from "../config/db.js";
import ApiError from "../utils/ApiError.js";

export const createRestaurant = async (ownerId, data) => {
  const existingRestaurant = await prisma.restaurant.findUnique({ where: { ownerId } });
  if (existingRestaurant) {
    throw new ApiError(409, "Restaurant owner already has a restaurant");
  }

  return prisma.restaurant.create({
    data: {
      name: data.name,
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      ownerId,
    },
  });

};

export const getRestaurants = async () => {
  return prisma.restaurant.findMany({
    include: {
      foodItems: {
        where: { isAvailable: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getRestaurantById = async (id) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
    include: { foodItems: true },
  });

  if (!restaurant) {
    throw new ApiError(404, "Restaurant not found");
  }

  return restaurant;
};
export const getMyRestaurant = async (ownerId) => {
  return prisma.restaurant.findUnique({
    where: { ownerId },
    include: {
      foodItems: true,
    },
  });
};
