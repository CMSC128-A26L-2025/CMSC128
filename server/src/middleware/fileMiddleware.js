import multer from 'multer';
import fs from 'fs';
import path from 'path';

const uploadsDir = path.resolve('uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Only image files are allowed!'), false); // Reject the file
  }
};


const upload = multer({ storage, fileFilter, limits:{fileSize: 10 * 1024 * 1024} });

export default upload;