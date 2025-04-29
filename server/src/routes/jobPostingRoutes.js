import express from "express";
import { validateToken } from "../middleware/validate-token.js";
import { authorizeRoles } from "../middleware/authorize-roles.js";
import { jobPostingController } from "../controllers/modelControllers/jobPostingController.js";

const router = express.Router();

router.get("/all", validateToken, authorizeRoles(["Admin", "Alumni"], jobPostingController.read));
router.get("/admin-page-jobs", validateToken, authorizeRoles(["Admin"]), jobPostingController.adminPageJobs);
router.get("/admin-page-job-requests", validateToken, authorizeRoles(["Admin"]), jobPostingController.adminPageJobRequests);
router.get("/job-results", validateToken, authorizeRoles(["Admin", "Alumni"]), jobPostingController.jobResults);
router.get("/job-bookmarked", validateToken, authorizeRoles(["Admin", "Alumni"]), jobPostingController.bookmarkJob);

export default router