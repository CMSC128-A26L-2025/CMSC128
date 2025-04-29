import express from "express";
import { validateToken } from "../middleware/validate-token.js";
import { authorizeRoles } from "../middleware/authorize-roles.js";
import { eventController } from "../controllers/modelControllers/eventController.js";

const router = express.Router();

router.get('/all', validateToken, authorizeRoles(["Admin", "Alumni"]), eventController.read);
router.get('/read-sort', validateToken, authorizeRoles(["Admin", "Alumni"]), eventController.readSort);
router.get("/admin-page-events", validateToken, authorizeRoles(["Admin"]), eventController.adminPageEvents);

export default router