const express = require("express");
const router = express.Router();

const { getAttemptDetails,getPendingEvaluations,evaluateAttempt,publishResult } = require("../controllers/resultController");
const { auth } = require("../middleware/auth");

router.get("/evaluations", auth,getPendingEvaluations);
router.get("/evaluation/:attemptId",auth,getAttemptDetails);
router.post("/evaluate/:attemptId",auth,evaluateAttempt);
router.post("/publish/:attemptId",auth,publishResult);

module.exports = router;
