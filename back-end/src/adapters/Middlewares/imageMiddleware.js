const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({
    limits: { fileSize: 5 * 1024 * 1024 }, 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Only image files are allowed!"), false);
        }
        cb(null, true);
    },
});

module.exports = upload;
