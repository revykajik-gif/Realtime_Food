import { Router } from "express";
import { create, update } from "../controllers/foodItem.controller.js";
import { ROLES } from "../constants/roles.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createFoodItemSchema, updateFoodItemSchema } from "../validators/foodItem.validator.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorizeRoles(ROLES.RESTAURANT_OWNER),
  validate(createFoodItemSchema),
  create
);

router.patch(
  "/:id",
  authenticate,
  authorizeRoles(ROLES.RESTAURANT_OWNER),
  validate(updateFoodItemSchema),
  update
);

export default router;
