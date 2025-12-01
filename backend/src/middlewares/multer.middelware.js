import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../public/temp/images");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  console.log("File fieldname:", file.fieldname);
  if (file.fieldname === "profilePic") {
    if (["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  } else if (file.fieldname === "thumbnail") {
    if (["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  } else if (file.fieldname === "videos") {
    if (["video/mp4", "video/mkv", "video/avi"].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only video files are allowed"), false);
    }
  } else {
    cb(new Error("Invalid field"), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter }).fields([
  { name: "profilePic", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
  { name: "videos", maxCount: 1000 },
]);

export default upload;
