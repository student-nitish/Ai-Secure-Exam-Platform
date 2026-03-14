
const express = require("express");
const router = express.Router();

const {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount
} = require("../controllers/userController");

const {auth} = require("../middleware/auth");

router.get("/profile", auth, getProfile);

router.put("/update-profile", auth, updateProfile);

router.put("/change-password", auth, changePassword);

router.delete("/delete-account", auth, deleteAccount);

module.exports = router;