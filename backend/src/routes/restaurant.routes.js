import { Router } from "express";
import { create, getById, list,getMine } from "../controllers/restaurant.controller.js";
import { ROLES } from "../constants/roles.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createRestaurantSchema } from "../validators/restaurant.validator.js";

const router = Router();

router.get("/", list);
router.get(
  "/mine",
  authenticate,
  authorizeRoles(ROLES.RESTAURANT_OWNER),
  getMine
);
router.get("/:id", getById);
router.post(
  "/",
  authenticate,
  authorizeRoles(ROLES.RESTAURANT_OWNER),
  validate(createRestaurantSchema),
  create
);

export default router;
