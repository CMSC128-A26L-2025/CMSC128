import express from "express";
import { validateToken } from "../middleware/validate-token.js";
import { authorizeRoles } from "../middleware/authorize-roles.js";
import { jobPostingController } from "../controllers/modelControllers/jobPostingController.js";
import upload from '../middleware/fileMiddleware.js'; // Multer middleware


const router = express.Router();

router.get("/all", validateToken, authorizeRoles(["Admin", "Alumni"], jobPostingController.read));
router.get("/admin-page-jobs", validateToken, authorizeRoles(["Admin"]), jobPostingController.adminPageJobs);
router.get("/admin-page-job-requests", validateToken, authorizeRoles(["Admin"]), jobPostingController.adminPageJobRequests);
router.get("/job-results", validateToken, authorizeRoles(["Admin", "Alumni"]), jobPostingController.jobResults);

router.put("/:_id/approve", jobPostingController.approveJob);
router.put("/:_id/reject", jobPostingController.disapproveJob);

router.post("/create", upload.array('files[]'), jobPostingController.create);

router.post("/:_id/upload", upload.array('files[]'), jobPostingController.uploadJobFiles);

router.get('/:_id/files',jobPostingController.getJobFiles);

router.get('/find-job/:id', validateToken, authorizeRoles(["Admin", "Alumni"]), jobPostingController.findJobById);

router.post("/bookmark", validateToken, authorizeRoles(["Admin", "Alumni"]), jobPostingController.bookmarkJob);
router.post("/unbookmark", validateToken, authorizeRoles(["Admin", "Alumni"]), jobPostingController.unbookmarkJob);
router.get("/job-bookmarked", validateToken, authorizeRoles(["Admin", "Alumni"]), jobPostingController.getbookmarked_jobs);

export default router;