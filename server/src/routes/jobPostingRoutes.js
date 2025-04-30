import express from "express";
import { validateToken } from "../middleware/validate-token.js";
import { authorizeRoles } from "../middleware/authorize-roles.js";
import { jobPostingController } from "../controllers/modelControllers/jobPostingController.js";
import upload from '../middleware/fileMiddleware.js'; // Multer middleware


const router = express.Router();

router.get("/admin-page-jobs", // validateToken, authorizeRoles(["Admin"]), * commented for testing
    jobPostingController.adminPageJobs);

router.get("/admin-page-job-requests", // validateToken, authorizeRoles(["Admin"]), * commented for testing
    jobPostingController.adminPageJobRequests);

router.get("/job-results", // validateToken, authorizeRoles(["Admin"]), * commented for testing
    jobPostingController.jobResults);

router.get("/job-bookmarked", // validateToken, authorizeRoles(["Admin"]), * commented for testing
    jobPostingController.bookmarkJob);

router.post("/create", upload.array('files[]'), jobPostingController.create);

// File upload for a specific job posting
// router.post('/job-postings/create', upload.array('files[]'), async (req, res) => {
//     console.log('Files:', req.files);  // Should be an array
//     console.log('Body:', req.body);    // Should contain your form fields
//     res.json({ message: 'Upload received' });
//   });
router.post("/:job_id/upload", upload.array('files[]'), jobPostingController.uploadJobFiles);
// // List metadata of all files in a job posting
router.get('/:job_id/files', jobPostingController.getJobFiles);

// // Delete a specific file (by server filename) from job posting
// router.delete('/:id/file/:filename', jobPostingController.deleteJobFile);

// // Download a file
// router.get('/download/:filename', jobPostingController.downloadJobFile);
export default router;