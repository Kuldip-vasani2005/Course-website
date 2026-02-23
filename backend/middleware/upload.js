const multer = require("multer");

// Use memory storage (NO local uploads folder)
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "thumbnail") {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Thumbnail must be an image"), false);
    }
  } else if (file.fieldname === "video") {
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Video must be a video file"), false);
    }
  } else {
    cb(new Error("Unexpected field"), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 300 * 1024 * 1024, // 300MB
  },
  fileFilter,
});

module.exports = upload;