import path from "path";
import fs from "fs";
import mongoose from "mongoose";

const uploadsDir = path.resolve("uploads");

// Ensure upload directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Load model dynamically
const getModel = (modelName) => {
  try {
    return mongoose.model(modelName);
  } catch (err) {
    throw new Error(`Model "${modelName}" not found`);
  }
};

export const uploadFilesForModel = async (req, res) => {
  const { modelName, id } = req.params;
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }
  


  try {
    const Model = getModel(modelName); // You need to have this getModel
    
    const document = await Model.find({ job_id: id}).exec();
    // console.log("SUMAKSES KA E 1")
    // console.log(id)
    if (!document) return res.status(404).json({ message: "Document not found" });
    // console.log(document)
    // console.log("SUMAKSES KA E 2")
    const filesMetadata = files.map((file) => ({
      name: file.originalname,
      size: file.size,
      type: file.mimetype,
      serverFilename: file.filename, // Multer provides this
      lastModified: Date.now()
    }));
    // console.log(filesMetadata)
    if (!Array.isArray(document.files)) document.files = [];
    document.files.push(...filesMetadata);
    // await document.save();

    res.status(200).json({ message: "Files uploaded", files: filesMetadata });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getFilesForModel = async (req, res) => {
  const { modelName, id } = req.params;

  try {
    const Model = getModel(modelName);
    const document = await Model.find({ job_id: id}).exec();
    if (!document) return res.status(404).json({ message: "Document not found" });

    res.json({ files: document.files || [] });
  } catch (err) {
    console.error("Get files error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const downloadFile = (req, res) => {
  const filepath = path.join(uploadsDir, req.params.filename);
  if (fs.existsSync(filepath)) return res.download(filepath);
  res.status(404).json({ error: "File not found" });
};

export const deleteFileFromModel = async (req, res) => {
  const { modelName, id, filename } = req.params;

  try {
    const Model = getModel(modelName);
    const document = await Model.findById(id);
    if (!document) return res.status(404).json({ message: "Document not found" });

    document.files = document.files.filter(f => f.serverFilename !== filename);
    await document.save();

    const filepath = path.join(uploadsDir, filename);
    if (fs.existsSync(filepath)) fs.unlinkSync(filepath);

    res.json({ message: "File deleted" });
  } catch (err) {
    console.error("Delete file error:", err);
    res.status(500).json({ error: err.message });
  }
};