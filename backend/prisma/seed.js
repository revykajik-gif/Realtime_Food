import bcrypt from "bcryptjs";
import prisma from "../src/config/db.js";
import { ORDER_STATUS } from "../src/constants/orderStatus.js";
import { ROLES } from "../src/constants/roles.js";

const password = await bcrypt.hash("password123", 10);

async function main() {
  await prisma.orderStatusHistory.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.foodItem.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.riderProfile.deleteMany();
  await prisma.user.deleteMany();

  const [customer, owner, rider, admin] = await Promise.all([
    prisma.user.create({
      data: { name: "Customer One", email: "customer@example.com", password, role: ROLES.CUSTOMER },
    }),
    prisma.user.create({
      data: {
        name: "Restaurant Owner",
        email: "owner@example.com",
        password,
        role: ROLES.RESTAURANT_OWNER,
      },
    }),
    prisma.user.create({
      data: {
        name: "Rider One",
        email: "rider@example.com",
        password,
        role: ROLES.RIDER,
        rider: { create: { latitude: 28.6139, longitude: 77.209, isAvailable: true } },
      },

    }),
    prisma.user.create({
      data: { name: "Admin One", email: "admin@example.com", password, role: ROLES.ADMIN },
    }),
     prisma.user.create({
  data: {
    name: "Rider Two",
    email: "rider2@example.com",
    password,
    role: ROLES.RIDER,
    rider: {
      create: {
        latitude: 28.6200,
        longitude: 77.2200,
        isAvailable: true,
      },
    },
  },
}),
 prisma.user.create({
  data: {
    name: "Rider Three",
    email: "rider3@example.com",
    password,
    role: ROLES.RIDER,
    rider: {
      create: {
        latitude: 28.6400,
        longitude: 77.2500,
        isAvailable: true,
      },
    },
  },
})
  ]);

  const restaurant = await prisma.restaurant.create({
    data: {
      name: "Dispatch Bites",
      address: "Connaught Place, New Delhi",
      latitude: 28.6315,
      longitude: 77.2167,
      ownerId: owner.id,
    },
  });

  const [burger, bowl] = await Promise.all([
    prisma.foodItem.create({
      data: {
        restaurantId: restaurant.id,
        name: "Classic Burger",
        description: "Grilled patty, cheese, lettuce, and house sauce",
        price: 199,
      },
    }),
    prisma.foodItem.create({
      data: {
        restaurantId: restaurant.id,
        name: "Rice Bowl",
        description: "Warm rice bowl with vegetables and spicy sauce",
        price: 249,
      },
    }),
  ]);

  const order = await prisma.order.create({
    data: {
      customerId: customer.id,
      restaurantId: restaurant.id,
      totalAmount: burger.price + bowl.price,
      status: ORDER_STATUS.PLACED,
      orderItems: {
        create: [
          { foodItemId: burger.id, quantity: 1, price: burger.price },
          { foodItemId: bowl.id, quantity: 1, price: bowl.price },
        ],
      },
      statusHistory: {
        create: [{ status: ORDER_STATUS.PLACED }],
      },
    },
  });

  console.log({
    users: [customer.email, owner.email, rider.email,admin.email],
    password: "password123",
    restaurant: restaurant.name,
    sampleOrderId: order.id,
    riderId: rider.id,
    adminId: admin.id,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
