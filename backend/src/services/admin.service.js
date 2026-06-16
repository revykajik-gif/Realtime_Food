import prisma from "../config/db.js";

export const getAdminOverview = async () => {
  const [users, restaurants, riders, orders] = await Promise.all([
    prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.restaurant.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.riderProfile.findMany({
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.findMany({
      include: {
        customer: { select: { id: true, name: true, email: true } },
        restaurant: true,
        rider: { include: { user: { select: { id: true, name: true, email: true } } } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return { users, restaurants, riders, orders };
};
