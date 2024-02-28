const express = require("express");
const {
  allMessages,
  sendMessage,
} = require('../controlers/messageControler');
const { protect } = require("../middleware/authmiddleware");

const router = express.Router();

router.route("/:chatId").get(protect, allMessages);
router.route("/").post(protect, sendMessage);

module.exports = router;