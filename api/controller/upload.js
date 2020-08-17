const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

const upload = multer({
  //dest: "uploads/",
  storage,
  limits: {
    fileSize: 1024 * 1024 * 4, //unitl 2gb
  },
});

module.exports = upload;
