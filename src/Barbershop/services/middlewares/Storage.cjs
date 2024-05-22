const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure the 'uploads' directory exists two levels up from the current directory
const uploadDir = path.join(__dirname, '../../..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, uploadDir);
    },
    filename: (req, file, callback) => {
        const time = new Date().getTime();
        callback(null, `${time}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

module.exports = upload;
