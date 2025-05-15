import express from "express";
import upload from "../middleware/fileMiddleware.js";
import {
  uploadFilesForModel,
  getFilesForModel,
  downloadFile,
  deleteFileFromModel
} from "../controllers/fileController/fileController.js";

const router = express.Router();

// Upload files to any model with a files field
router.post("/:modelName/:id/upload", upload.array("files[]"), uploadFilesForModel);
router.get("/:modelName/:id/files[]", getFilesForModel);
router.get("/download/:filename", downloadFile);
router.delete("/:modelName/:id/file/:filename", deleteFileFromModel);

export default router;