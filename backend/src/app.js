import cors from "cors";
import express from "express";
import adminRoutes from "./routes/admin.routes.js";
import authRoutes from "./routes/auth.routes.js";
import foodItemRoutes from "./routes/foodItem.routes.js";
import healthRoutes from "./routes/health.routes.js";
import orderRoutes from "./routes/order.routes.js";
import restaurantRoutes from "./routes/restaurant.routes.js";
import riderRoutes from "./routes/rider.routes.js";
import { errorHandler, notFound } from "./middleware/error.middleware.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

app.use("/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/food-items", foodItemRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/riders", riderRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
