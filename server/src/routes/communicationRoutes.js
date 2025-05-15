import express from "express";
import { validateToken } from "../middleware/validate-token.js";
import { authorizeRoles } from "../middleware/authorize-roles.js";
import { communicationController } from "../controllers/modelControllers/communicationController.js";


const router = express.Router();

router.post("/create", communicationController.create);
export default router