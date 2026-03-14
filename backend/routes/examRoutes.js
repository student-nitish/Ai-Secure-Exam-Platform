const express = require("express");
const router = express.Router();

const {
  createExam,
  publishExam,
  getAdminExams,
  getExamById,
  updateExam
} = require("../controllers/examController");

const {
  startExamAttempt,
  submitExam,
  getStudentResults,
  getResultAnalysis
} = require("../controllers/attemptController");


const { addQuestion,getExamQuestions ,deleteQuestion} = require("../controllers/questionController");
const { getAvailableExams } = require("../controllers/examController");

const { auth } = require("../middleware/auth");

router.get("/available", auth, getAvailableExams);
router.post("/start", auth, startExamAttempt);
router.post("/submit", auth, submitExam);
router.get("/student", auth, getStudentResults);
 router.get("/analysis/:attemptId",auth, getResultAnalysis);
router.get("/:examId/questions", getExamQuestions);
router.delete("/questions/:questionId", deleteQuestion);


// Admin-only exam routes
router.post("/create", auth, createExam);
router.post("/add-questions", auth, addQuestion);
router.put("/publish", auth, publishExam);
router.get("/admin-exams",auth, getAdminExams);
router.get("/:examId", getExamById);
router.put("/update/:examId", updateExam);



module.exports = router;
