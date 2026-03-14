const express = require("express");
const router = express.Router();

const {
  generateQuestionsAI,
} = require("../controllers/aiQuestionController");

router.post("/generate-questions", generateQuestionsAI);

module.exports = router;
