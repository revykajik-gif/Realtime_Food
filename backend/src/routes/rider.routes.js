import { Router } from "express";
import { assignments, updateAvailability,getMyProfile } from "../controllers/rider.controller.js";
import { ROLES } from "../constants/roles.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = Router();

router.use(authenticate, authorizeRoles(ROLES.RIDER));
router.get("/me", getMyProfile);
router.get("/assignments", assignments);
router.patch("/availability", updateAvailability);

export default router;
