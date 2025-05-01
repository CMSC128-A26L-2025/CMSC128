import express from "express";
import { validateToken } from "../middleware/validate-token.js";
import { authorizeRoles } from "../middleware/authorize-roles.js";
import { jobPostingController } from "../controllers/modelControllers/jobPostingController.js";
import upload from '../middleware/fileMiddleware.js'; // Multer middleware


const router = express.Router();

router.post("/post-job", validateToken, authorizeRoles(["Admin", "Alumni"]), jobPostingController.postJob);
router.get("/all", validateToken, authorizeRoles(["Admin", "Alumni"], jobPostingController.read));
router.get("/admin-page-jobs", validateToken, authorizeRoles(["Admin"]), jobPostingController.adminPageJobs);
router.get("/admin-page-job-requests", validateToken, authorizeRoles(["Admin"]), jobPostingController.adminPageJobRequests);
router.get("/job-results", validateToken, authorizeRoles(["Admin", "Alumni"]), jobPostingController.jobResults);
router.get("/job-bookmarked", validateToken, authorizeRoles(["Admin", "Alumni"]), jobPostingController.bookmarkJob);

router.get("/admin-page-job-requests", // validateToken, authorizeRoles(["Admin"]), * commented for testing
    jobPostingController.adminPageJobRequests);

router.get("/job-results", // validateToken, authorizeRoles(["Admin"]), * commented for testing
    jobPostingController.jobResults);

router.get("/job-bookmarked", // validateToken, authorizeRoles(["Admin"]), * commented for testing
    jobPostingController.bookmarkJob);

router.post("/create", upload.array('files[]'), jobPostingController.create);


router.post("/:job_id/upload", upload.array('files[]'), jobPostingController.uploadJobFiles);

router.get('/:job_id/files', jobPostingController.getJobFiles);

export default router;
