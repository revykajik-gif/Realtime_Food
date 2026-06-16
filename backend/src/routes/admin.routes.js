import { Router } from "express";
import { overview } from "../controllers/admin.controller.js";
import { ROLES } from "../constants/roles.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = Router();

router.use(authenticate, authorizeRoles(ROLES.ADMIN));

router.get("/overview", overview);

export default router;
