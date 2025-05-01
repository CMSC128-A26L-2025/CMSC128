import express from "express";
import { validateToken } from "../middleware/validate-token.js";
import { authorizeRoles } from "../middleware/authorize-roles.js";
import { eventController } from "../controllers/modelControllers/eventController.js";
import upload from '../middleware/fileMiddleware.js'; // Multer middleware
const router = express.Router();

router.get('/read-sort', validateToken, eventController.readSort);
router.get("/admin-page-events", validateToken, authorizeRoles(["Admin"]), eventController.adminPageEvents);
router.post("/create", upload.array('files[]'), eventController.create);

router.post("/:event_id/upload", upload.array('files[]'), eventController.uploadEventFiles);
// // List metadata of all files in a job posting
router.get('/:event_id/files', eventController.getEventFiles);

export default router