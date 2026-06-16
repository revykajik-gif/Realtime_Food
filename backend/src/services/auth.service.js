import bcrypt from "bcryptjs";
import prisma from "../config/db.js";
import { ROLES } from "../constants/roles.js";
import ApiError from "../utils/ApiError.js";
import { signToken } from "../utils/jwt.js";

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

export const registerUser = async (data) => {
  const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
  if (existingUser) {
    throw new ApiError(409, "Email is already registered");
  }

  if (data.role === ROLES.RIDER && (data.latitude === undefined || data.longitude === undefined)) {
    throw new ApiError(400, "Rider latitude and longitude are required");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
      rider:
        data.role === ROLES.RIDER
          ? {
              create: {
                latitude: data.latitude,
                longitude: data.longitude,
              },
            }
          : undefined,
    },
  });

  return {
    user: sanitizeUser(user),
    token: signToken({ id: user.id, role: user.role }),
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  return {
    user: sanitizeUser(user),
    token: signToken({ id: user.id, role: user.role }),
  };
};
