const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controlers/userControler");
const { protect } = require("../middleware/authmiddleware");
const fs = require("fs");
const path = require("path");

const destinationPath = path.resolve(__dirname, "./../../front/src/img");

// Create the directory if it doesn't exist
if (!fs.existsSync(destinationPath)) {
  fs.mkdirSync(destinationPath, { recursive: true });
}
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

const router = express.Router();

router
  .route("/")
  .post(upload.single("pic"), registerUser) // Assuming registerUser is your controller function for user registration
  .get(protect, allUsers);

router.post("/login", authUser);

// router.route('/').get(protect, allUsers);

module.exports = router;
