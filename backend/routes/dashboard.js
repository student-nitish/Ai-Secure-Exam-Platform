const express = require("express");
const router = express.Router();

const { getStudentDashboard,getAdminDashboard } = require("../controllers/dashboard");
const { auth } = require("../middleware/auth");

router.get("/student",auth,getStudentDashboard);
router.get("/admin", auth,getAdminDashboard);

module.exports = router;