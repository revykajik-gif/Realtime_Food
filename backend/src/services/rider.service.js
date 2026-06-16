import prisma from "../config/db.js";
import ApiError from "../utils/ApiError.js";
import { assignOldestSearchingOrderToRider } from "./order.service.js";

export const updateRiderAvailability = async (userId, data) => {
  const rider = await prisma.riderProfile.findUnique({ where: { userId } });
  if (!rider) {
    throw new ApiError(404, "Rider profile not found");
  }

  const updatedRider = await prisma.riderProfile.update({
    where: { userId },
    data: {
      isAvailable: data.isAvailable,
      latitude: data.latitude ?? rider.latitude,
      longitude: data.longitude ?? rider.longitude,
    },
  });

  if (updatedRider.isAvailable) {
    await assignOldestSearchingOrderToRider(updatedRider.id);
  }

  return updatedRider;
};

export const getRiderAssignments = async (userId) => {
  const rider = await prisma.riderProfile.findUnique({ where: { userId } });
  if (!rider) {
    throw new ApiError(404, "Rider profile not found");
  }

  return prisma.order.findMany({
    where: { riderId: rider.id },
    include: {
      customer: { select: { id: true, name: true, email: true } },
      restaurant: true,
      orderItems: { include: { foodItem: true } },
      statusHistory: { orderBy: { createdAt: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });
};
