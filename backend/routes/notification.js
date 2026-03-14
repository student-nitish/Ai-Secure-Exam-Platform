const express = require("express");
const router = express.Router();

const {
  getNotifications,
  markAsRead
} = require("../controllers/notification");

const { auth } = require("../middleware/auth");

router.get("/all", auth, getNotifications);
router.patch("/:id",auth,markAsRead);

module.exports = router;