import { Router } from "express";
import {
  accept,
  cancel,
  create,
  delivered,
  listMine,
  outForDelivery,
  reject,
} from "../controllers/order.controller.js";
import { ROLES } from "../constants/roles.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createOrderSchema, orderIdParamSchema } from "../validators/order.validator.js";

const router = Router();

router.use(authenticate);

router.get("/", listMine);
router.post("/", authorizeRoles(ROLES.CUSTOMER), validate(createOrderSchema), create);
router.patch("/:id/cancel", authorizeRoles(ROLES.CUSTOMER), validate(orderIdParamSchema), cancel);
router.patch(
  "/:id/accept",
  authorizeRoles(ROLES.RESTAURANT_OWNER),
  validate(orderIdParamSchema),
  accept
);
router.patch(
  "/:id/reject",
  authorizeRoles(ROLES.RESTAURANT_OWNER),
  validate(orderIdParamSchema),
  reject
);
router.patch(
  "/:id/out-for-delivery",
  authorizeRoles(ROLES.RIDER),
  validate(orderIdParamSchema),
  outForDelivery
);
router.patch("/:id/deliver", authorizeRoles(ROLES.RIDER), validate(orderIdParamSchema), delivered);

export default router;
