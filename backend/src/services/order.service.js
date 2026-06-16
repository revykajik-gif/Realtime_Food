// import prisma from "../config/db.js";
// import { ORDER_STATUS } from "../constants/orderStatus.js";
// import { ROLES } from "../constants/roles.js";
// import ApiError from "../utils/ApiError.js";
// import { calculateDistanceKm } from "../utils/distance.js";

// const orderInclude = {
//   customer: { select: { id: true, name: true, email: true } },
//   restaurant: true,
//   rider: { include: { user: { select: { id: true, name: true, email: true } } } },
//   orderItems: { include: { foodItem: true }, orderBy: { id: "asc" } },
//   statusHistory: { orderBy: { createdAt: "asc" } },
// };


// const addStatusHistory = (tx, orderId, status) => {
//   return tx.orderStatusHistory.create({
//     data: { orderId, status },
//   });
// };

// export const createOrder = async (customerId, data) => {
//   const restaurant = await prisma.restaurant.findUnique({
//     where: { id: data.restaurantId },
//   });

//   if (!restaurant) {
//     throw new ApiError(404, "Restaurant not found");
//   }

//   const foodItems = await prisma.foodItem.findMany({
//     where: {
//       id: { in: data.items.map((item) => item.foodItemId) },
//       restaurantId: data.restaurantId,
//       isAvailable: true,
//     },
//   });

//   if (foodItems.length !== data.items.length) {
//     throw new ApiError(400, "One or more food items are unavailable");
//   }

//   const foodItemById = new Map(foodItems.map((item) => [item.id, item]));
//   const orderItems = data.items.map((item) => {
//     const foodItem = foodItemById.get(item.foodItemId);
//     return {
//       foodItemId: item.foodItemId,
//       quantity: item.quantity,
//       price: foodItem.price,
//     };
//   });

//   const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

//   const order = await prisma.$transaction(async (tx) => {
//     const createdOrder = await tx.order.create({
//       data: {
//         customerId,
//         restaurantId: data.restaurantId,
//         totalAmount,
//         orderItems: { create: orderItems },
//       },
//     });

//     await addStatusHistory(tx, createdOrder.id, ORDER_STATUS.PLACED);

//     return tx.order.findUnique({
//       where: { id: createdOrder.id },
//       include: orderInclude,
//     });
//   });


//   return order;
// };

// export const getOrdersForUser = async (user) => {
//   const whereByRole = {
//     [ROLES.CUSTOMER]: { customerId: user.id },
//     [ROLES.RESTAURANT_OWNER]: { restaurant: { ownerId: user.id } },
//     [ROLES.ADMIN]: {},
//   };

//   if (user.role === ROLES.RIDER) {
//     const rider = await prisma.riderProfile.findUnique({ where: { userId: user.id } });
//     return prisma.order.findMany({
//       where: { riderId: rider?.id },
//       include: orderInclude,
//       orderBy: { createdAt: "desc" },
//     });
//   }

//   return prisma.order.findMany({
//     where: whereByRole[user.role] ?? {},
//     include: orderInclude,
//     orderBy: { createdAt: "desc" },
//   });
// };

// export const cancelOrder = async (userId, orderId) => {
//   const order = await prisma.order.findUnique({ where: { id: orderId } });

//   if (!order) {
//     throw new ApiError(404, "Order not found");
//   }

//   if (order.customerId !== userId) {
//     throw new ApiError(403, "You can cancel only your own order");
//   }

//   if (order.status !== ORDER_STATUS.PLACED) {
//     throw new ApiError(400, "Order can be cancelled only while it is PLACED");
//   }

//   const updatedOrder = await prisma.$transaction(async (tx) => {
//     await addStatusHistory(tx, orderId, ORDER_STATUS.CANCELLED);
//     return tx.order.update({
//       where: { id: orderId },
//       data: { status: ORDER_STATUS.CANCELLED },
//       include: orderInclude,
//     });
//   });


//   return updatedOrder;
// };

// export const rejectOrderByRestaurant = async (ownerId, orderId) => {
//   const order = await prisma.order.findUnique({
//     where: { id: orderId },
//     include: { restaurant: true },
//   });

//   if (!order) {
//     throw new ApiError(404, "Order not found");
//   }

//   if (order.restaurant.ownerId !== ownerId) {
//     throw new ApiError(403, "You can reject orders only for your restaurant");
//   }

//   if (![ORDER_STATUS.PLACED, ORDER_STATUS.SEARCHING_RIDER].includes(order.status)) {
//     throw new ApiError(400, "Order can be rejected only before rider assignment");
//   }

//   const updatedOrder = await prisma.$transaction(async (tx) => {
//     await addStatusHistory(tx, orderId, ORDER_STATUS.CANCELLED);
//     return tx.order.update({
//       where: { id: orderId },
//       data: { status: ORDER_STATUS.CANCELLED },
//       include: orderInclude,
//     });
//   });

//   return updatedOrder;
// };

// export const acceptOrderAndAssignRider = async (ownerId, orderId) => {
//   const order = await prisma.order.findUnique({
//     where: { id: orderId },
//     include: { restaurant: true },
//   });

//   if (!order) {
//     throw new ApiError(404, "Order not found");
//   }

//   if (order.restaurant.ownerId !== ownerId) {
//     throw new ApiError(403, "You can accept orders only for your restaurant");
//   }

//   if (![ORDER_STATUS.PLACED, ORDER_STATUS.SEARCHING_RIDER].includes(order.status)) {
//     throw new ApiError(400, "Only PLACED or SEARCHING_RIDER orders can be assigned");
//   }

//   const availableRiders = await prisma.riderProfile.findMany({
//     where: { isAvailable: true },
//     include: { user: { select: { id: true, name: true, email: true } } },
//   });

//   if (availableRiders.length === 0) {
//     const searchingOrder = await prisma.$transaction(async (tx) => {
//       if (order.status === ORDER_STATUS.PLACED) {
//         await addStatusHistory(tx, orderId, ORDER_STATUS.ACCEPTED);
//         await addStatusHistory(tx, orderId, ORDER_STATUS.SEARCHING_RIDER);
//       }

//       return tx.order.update({
//         where: { id: orderId },
//         data: { status: ORDER_STATUS.SEARCHING_RIDER },
//         include: orderInclude,
//       });
//     });

//     return searchingOrder;
//   }

//   const [nearestRider] = availableRiders
//     .map((rider) => ({
//       ...rider,
//       distanceKm: calculateDistanceKm(order.restaurant, rider),
//     }))
//     .sort((a, b) => a.distanceKm - b.distanceKm);

//   const assignedOrder = await prisma.$transaction(async (tx) => {
//     await tx.riderProfile.update({
//       where: { id: nearestRider.id },
//       data: { isAvailable: false },
//     });

//     if (order.status === ORDER_STATUS.PLACED) {
//       await addStatusHistory(tx, orderId, ORDER_STATUS.ACCEPTED);
//       await addStatusHistory(tx, orderId, ORDER_STATUS.SEARCHING_RIDER);
//     }
//     await addStatusHistory(tx, orderId, ORDER_STATUS.RIDER_ASSIGNED);

//     return tx.order.update({
//       where: { id: orderId },
//       data: {
//         riderId: nearestRider.id,
//         status: ORDER_STATUS.RIDER_ASSIGNED,
//       },
//       include: orderInclude,
//     });
//   });



//   return assignedOrder;
// };

// export const assignOldestSearchingOrderToRider = async (riderId) => {
//   const rider = await prisma.riderProfile.findUnique({
//     where: { id: riderId },
//   });

//   if (!rider?.isAvailable) {
//     return null;
//   }

//   const waitingOrder = await prisma.order.findFirst({
//     where: { status: ORDER_STATUS.SEARCHING_RIDER, riderId: null },
//     include: { restaurant: true },
//     orderBy: { createdAt: "asc" },
//   });

//   if (!waitingOrder) {
//     return null;
//   }

//   const assignedOrder = await prisma.$transaction(async (tx) => {
//     await tx.riderProfile.update({
//       where: { id: riderId },
//       data: { isAvailable: false },
//     });

//     await addStatusHistory(tx, waitingOrder.id, ORDER_STATUS.RIDER_ASSIGNED);

//     return tx.order.update({
//       where: { id: waitingOrder.id },
//       data: {
//         riderId,
//         status: ORDER_STATUS.RIDER_ASSIGNED,
//       },
//       include: orderInclude,
//     });
//   });



//   return assignedOrder;
// };

// export const markOrderOutForDelivery = async (userId, orderId) => {
//   const rider = await prisma.riderProfile.findUnique({ where: { userId } });
//   if (!rider) throw new ApiError(404, "Rider profile not found");

//   const order = await prisma.order.findUnique({ where: { id: orderId } });
//   if (!order || order.riderId !== rider.id) {
//     throw new ApiError(403, "This order is not assigned to you");
//   }

//   if (order.status !== ORDER_STATUS.RIDER_ASSIGNED) {
//     throw new ApiError(400, "Order must be RIDER_ASSIGNED first");
//   }

//   const updatedOrder = await prisma.$transaction(async (tx) => {
//     await addStatusHistory(tx, orderId, ORDER_STATUS.OUT_FOR_DELIVERY);
//     return tx.order.update({
//       where: { id: orderId },
//       data: { status: ORDER_STATUS.OUT_FOR_DELIVERY },
//       include: orderInclude,
//     });
//   });


//   return updatedOrder;
// };

// export const markOrderDelivered = async (userId, orderId) => {
//   const rider = await prisma.riderProfile.findUnique({ where: { userId } });
//   if (!rider) throw new ApiError(404, "Rider profile not found");

//   const order = await prisma.order.findUnique({ where: { id: orderId } });
//   if (!order || order.riderId !== rider.id) {
//     throw new ApiError(403, "This order is not assigned to you");
//   }

//   if (order.status !== ORDER_STATUS.OUT_FOR_DELIVERY) {
//     throw new ApiError(400, "Order must be OUT_FOR_DELIVERY first");
//   }

//   const updatedOrder = await prisma.$transaction(async (tx) => {
//     await tx.riderProfile.update({
//       where: { id: rider.id },
//       data: { isAvailable: true },
//     });
//     await addStatusHistory(tx, orderId, ORDER_STATUS.DELIVERED);
//     return tx.order.update({
//       where: { id: orderId },
//       data: { status: ORDER_STATUS.DELIVERED },
//       include: orderInclude,
//     });
//   });

//   await assignOldestSearchingOrderToRider(rider.id);
//   return updatedOrder;
// };






import { getIO } from "../config/socket.js";
import prisma from "../config/db.js";
import { ORDER_STATUS } from "../constants/orderStatus.js";
import { ROLES } from "../constants/roles.js";
import ApiError from "../utils/ApiError.js";
import { calculateDistanceKm } from "../utils/distance.js";

const orderInclude = {
  customer: { select: { id: true, name: true, email: true } },
  restaurant: true,
  rider: { include: { user: { select: { id: true, name: true, email: true } } } },
  orderItems: { include: { foodItem: true }, orderBy: { id: "asc" } },
  statusHistory: { orderBy: { createdAt: "asc" } },
};


const addStatusHistory = (tx, orderId, status) => {
  return tx.orderStatusHistory.create({
    data: { orderId, status },
  });
};
const emitOrderUpdate = (order) => {
  const io = getIO();

  if (!io || !order) return;

  if (order.customerId) {
    io.to(`customer:${order.customerId}`)
      .emit("order-status-updated", order);
  }

  if (order.restaurantId) {
    io.to(`restaurant:${order.restaurantId}`)
      .emit("order-status-updated", order);
  }

  if (order.riderId) {
    io.to(`rider:${order.riderId}`)
      .emit("order-status-updated", order);
  }
};
export const createOrder = async (customerId, data) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: data.restaurantId },
  });

  if (!restaurant) {
    throw new ApiError(404, "Restaurant not found");
  }

  const foodItems = await prisma.foodItem.findMany({
    where: {
      id: { in: data.items.map((item) => item.foodItemId) },
      restaurantId: data.restaurantId,
      isAvailable: true,
    },
  });

  if (foodItems.length !== data.items.length) {
    throw new ApiError(400, "One or more food items are unavailable");
  }

  const foodItemById = new Map(foodItems.map((item) => [item.id, item]));
  const orderItems = data.items.map((item) => {
    const foodItem = foodItemById.get(item.foodItemId);
    return {
      foodItemId: item.foodItemId,
      quantity: item.quantity,
      price: foodItem.price,
    };
  });

  const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        customerId,
        restaurantId: data.restaurantId,
        totalAmount,
        orderItems: { create: orderItems },
      },
    });

    await addStatusHistory(tx, createdOrder.id, ORDER_STATUS.PLACED);

    return tx.order.findUnique({
      where: { id: createdOrder.id },
      include: orderInclude,
    });
  });
const io = getIO();

if (io) {
  io.to(`restaurant:${order.restaurantId}`)
    .emit("new-order", order);

  io.to(`customer:${customerId}`)
    .emit("order-status-updated", order);
}



  return order;
};

export const getOrdersForUser = async (user) => {
  const whereByRole = {
    [ROLES.CUSTOMER]: { customerId: user.id },
    [ROLES.RESTAURANT_OWNER]: { restaurant: { ownerId: user.id } },
    [ROLES.ADMIN]: {},
  };

  if (user.role === ROLES.RIDER) {
    const rider = await prisma.riderProfile.findUnique({ where: { userId: user.id } });
    return prisma.order.findMany({
      where: { riderId: rider?.id },
      include: orderInclude,
      orderBy: { createdAt: "desc" },
    });
  }

  return prisma.order.findMany({
    where: whereByRole[user.role] ?? {},
    include: orderInclude,
    orderBy: { createdAt: "desc" },
  });
};

export const cancelOrder = async (userId, orderId) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.customerId !== userId) {
    throw new ApiError(403, "You can cancel only your own order");
  }

  if (order.status !== ORDER_STATUS.PLACED) {
    throw new ApiError(400, "Order can be cancelled only while it is PLACED");
  }

  const updatedOrder = await prisma.$transaction(async (tx) => {
    await addStatusHistory(tx, orderId, ORDER_STATUS.CANCELLED);
    return tx.order.update({
      where: { id: orderId },
      data: { status: ORDER_STATUS.CANCELLED },
      include: orderInclude,
    });
  });

emitOrderUpdate(updatedOrder);

  return updatedOrder;
};

export const rejectOrderByRestaurant = async (ownerId, orderId) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { restaurant: true },
  });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.restaurant.ownerId !== ownerId) {
    throw new ApiError(403, "You can reject orders only for your restaurant");
  }

  if (![ORDER_STATUS.PLACED, ORDER_STATUS.SEARCHING_RIDER].includes(order.status)) {
    throw new ApiError(400, "Order can be rejected only before rider assignment");
  }

  const updatedOrder = await prisma.$transaction(async (tx) => {
    await addStatusHistory(tx, orderId, ORDER_STATUS.CANCELLED);
    return tx.order.update({
      where: { id: orderId },
      data: { status: ORDER_STATUS.CANCELLED },
      include: orderInclude,
    });
  });
emitOrderUpdate(updatedOrder);
  return updatedOrder;
};

export const acceptOrderAndAssignRider = async (ownerId, orderId) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { restaurant: true },
  });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.restaurant.ownerId !== ownerId) {
    throw new ApiError(403, "You can accept orders only for your restaurant");
  }

  if (![ORDER_STATUS.PLACED, ORDER_STATUS.SEARCHING_RIDER].includes(order.status)) {
    throw new ApiError(400, "Only PLACED or SEARCHING_RIDER orders can be assigned");
  }

  const availableRiders = await prisma.riderProfile.findMany({
    where: { isAvailable: true },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  if (availableRiders.length === 0) {
    const searchingOrder = await prisma.$transaction(async (tx) => {
      if (order.status === ORDER_STATUS.PLACED) {
        await addStatusHistory(tx, orderId, ORDER_STATUS.ACCEPTED);
        await addStatusHistory(tx, orderId, ORDER_STATUS.SEARCHING_RIDER);
      }

      return tx.order.update({
        where: { id: orderId },
        data: { status: ORDER_STATUS.SEARCHING_RIDER },
        include: orderInclude,
      });
    });
emitOrderUpdate(searchingOrder);

    return searchingOrder;
  }

  const [nearestRider] = availableRiders
    .map((rider) => ({
      ...rider,
      distanceKm: calculateDistanceKm(order.restaurant, rider),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm);

  const assignedOrder = await prisma.$transaction(async (tx) => {
    await tx.riderProfile.update({
      where: { id: nearestRider.id },
      data: { isAvailable: false },
    });

    if (order.status === ORDER_STATUS.PLACED) {
      await addStatusHistory(tx, orderId, ORDER_STATUS.ACCEPTED);
      await addStatusHistory(tx, orderId, ORDER_STATUS.SEARCHING_RIDER);
    }
    await addStatusHistory(tx, orderId, ORDER_STATUS.RIDER_ASSIGNED);

    return tx.order.update({
      where: { id: orderId },
      data: {
        riderId: nearestRider.id,
        status: ORDER_STATUS.RIDER_ASSIGNED,
      },
      include: orderInclude,
    });
  });

emitOrderUpdate(assignedOrder);

const io = getIO();

if (io) {
  io.to(`rider:${nearestRider.id}`)
    .emit("new-assignment", assignedOrder);
}

return assignedOrder;
};

export const assignOldestSearchingOrderToRider = async (riderId) => {
  const rider = await prisma.riderProfile.findUnique({
    where: { id: riderId },
  });

  if (!rider?.isAvailable) {
    return null;
  }

  const waitingOrder = await prisma.order.findFirst({
    where: { status: ORDER_STATUS.SEARCHING_RIDER, riderId: null },
    include: { restaurant: true },
    orderBy: { createdAt: "asc" },
  });

  if (!waitingOrder) {
    return null;
  }

  const assignedOrder = await prisma.$transaction(async (tx) => {
    await tx.riderProfile.update({
      where: { id: riderId },
      data: { isAvailable: false },
    });

    await addStatusHistory(tx, waitingOrder.id, ORDER_STATUS.RIDER_ASSIGNED);

    return tx.order.update({
      where: { id: waitingOrder.id },
      data: {
        riderId,
        status: ORDER_STATUS.RIDER_ASSIGNED,
      },
      include: orderInclude,
    });
  });


emitOrderUpdate(assignedOrder);

const io = getIO();

if (io) {
  io.to(`rider:${riderId}`)
    .emit("new-assignment", assignedOrder);
}

return assignedOrder;
};

export const markOrderOutForDelivery = async (userId, orderId) => {
  const rider = await prisma.riderProfile.findUnique({ where: { userId } });
  if (!rider) throw new ApiError(404, "Rider profile not found");

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.riderId !== rider.id) {
    throw new ApiError(403, "This order is not assigned to you");
  }

  if (order.status !== ORDER_STATUS.RIDER_ASSIGNED) {
    throw new ApiError(400, "Order must be RIDER_ASSIGNED first");
  }

  const updatedOrder = await prisma.$transaction(async (tx) => {
    await addStatusHistory(tx, orderId, ORDER_STATUS.OUT_FOR_DELIVERY);
    return tx.order.update({
      where: { id: orderId },
      data: { status: ORDER_STATUS.OUT_FOR_DELIVERY },
      include: orderInclude,
    });
  });

emitOrderUpdate(updatedOrder);
return updatedOrder;
};

export const markOrderDelivered = async (userId, orderId) => {
  const rider = await prisma.riderProfile.findUnique({ where: { userId } });
  if (!rider) throw new ApiError(404, "Rider profile not found");

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.riderId !== rider.id) {
    throw new ApiError(403, "This order is not assigned to you");
  }

  if (order.status !== ORDER_STATUS.OUT_FOR_DELIVERY) {
    throw new ApiError(400, "Order must be OUT_FOR_DELIVERY first");
  }

  const updatedOrder = await prisma.$transaction(async (tx) => {
    await tx.riderProfile.update({
      where: { id: rider.id },
      data: { isAvailable: true },
    });
    await addStatusHistory(tx, orderId, ORDER_STATUS.DELIVERED);
    return tx.order.update({
      where: { id: orderId },
      data: { status: ORDER_STATUS.DELIVERED },
      include: orderInclude,
    });
  });

  emitOrderUpdate(updatedOrder);

await assignOldestSearchingOrderToRider(
  rider.id
);

return updatedOrder;
};
