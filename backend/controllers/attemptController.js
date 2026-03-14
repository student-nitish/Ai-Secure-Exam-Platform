const ExamAttempt = require("../models/ExamAttempt");
const Exam=require("../models/Exam");
const Question=require("../models/Question");
const Result=require("../models/Result")

exports.startExamAttempt = async (req, res) => {
  try {
    const { examId } = req.body;
    const studentId = req.user.id;

    const exam = await Exam.findById(examId);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    const now = new Date();

    if (exam.status !== "published") {
      return res.status(400).json({
        success: false,
        message: "Exam not published",
      });
    }

    if (exam.startDate > now || exam.endDate < now) {
      return res.status(400).json({
        success: false,
        message: "Exam not active",
      });
    }

    // Check max attempts
    const attemptsCount = await ExamAttempt.countDocuments({
      exam: examId,
      student: studentId,
    });

    if (attemptsCount >= exam.maxAttempts) {
      return res.status(400).json({
        success: false,
        message: "Max attempts reached",
      });
    }

    // Resume existing in-progress attempt
    let attempt = await ExamAttempt.findOne({
      exam: examId,
      student: studentId,
      status: "in-progress",
    });

    if (!attempt) {
      attempt = await ExamAttempt.create({
        exam: examId,
        student: studentId,
        startedAt: new Date(),
        status: "in-progress",
      });
    }

    // Fetch questions without correctAnswer
    const questions = await Question.find({ exam: examId })
      .select("-correctAnswer");

    res.status(200).json({
      success: true,
      exam: {
        _id: exam._id,
        title: exam.title,
        duration: exam.duration,
        totalMarks: exam.totalMarks,
      },
      attemptId: attempt._id,
      questions,
    });

  } catch (error) {
    console.error("Start attempt error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to start exam",
    });
  }
};

exports.submitExam = async (req, res) => {
  try {
    const { attemptId, answers = [], violations = [] } = req.body;
    console.log("Submit exam controller triggered");

    if (!attemptId) {
      return res.status(400).json({
        success: false,
        message: "Attempt ID is required",
      });
    }

    const attempt = await ExamAttempt.findById(attemptId).populate("exam");

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Attempt not found",
      });
    }

    if (attempt.status === "submitted") {
      return res.status(400).json({
        success: false,
        message: "Exam already submitted",
      });
    }

    /* ================= FETCH QUESTIONS ================= */

    const questionIds = answers.map((a) => a.questionId);

    const questions = await Question.find({
      _id: { $in: questionIds },
    });

    const questionMap = {};

    questions.forEach((q) => {
      questionMap[q._id] = q;
    });

    /* ================= AUTO EVALUATE ================= */

    let evaluatedAnswers = [];
    let totalMarksObtained = 0;

    for (const ans of answers) {
      const question = questionMap[ans.questionId];

      if (!question) continue;

      let isCorrect = false;
      let marksObtained = 0;

      if (question.questionType === "mcq") {
        if (ans.answer === question.correctAnswer) {
          isCorrect = true;
          marksObtained = question.marks;
        }
      }
      totalMarksObtained += marksObtained;

      evaluatedAnswers.push({
        question: question._id,
        answer: ans.answer,
        isCorrect,
        marksObtained,
      });
    }

    /* ================= SAVE ATTEMPT ================= */

    attempt.answers = evaluatedAnswers;
    attempt.violations = violations;
    attempt.totalMarksObtained = totalMarksObtained;

    attempt.submittedAt = new Date();
    attempt.status = "submitted";
    attempt.evaluationStatus = "pending"; // subjective pending

    await attempt.save();

    /* ================= SUMMARY ================= */

       const totalQuestions = await Question.countDocuments({
        exam: attempt.exam._id,
      });
    const attempted = evaluatedAnswers.length;
    const unattempted = totalQuestions - attempted;

    /* ================= TIME TAKEN ================= */

    let timeTaken = "0:00";

    if (attempt.startedAt && attempt.submittedAt) {
      const diff = Math.floor(
        (attempt.submittedAt - attempt.startedAt) / 1000
      );

      const minutes = Math.floor(diff / 60);
      const seconds = diff % 60;

      timeTaken = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    }

    /* ================= RESPONSE ================= */

    res.json({
      success: true,
      message:
        "Exam submitted successfully. Result will be published later.",

      summary: {
        totalQuestions,
        attempted,
        unattempted,
        timeTaken,
        violations: violations.length,
        mcqMarksObtained: totalMarksObtained,
      },
    });
  } catch (error) {
    console.error("Submit exam error:", error);

    res.status(500).json({
      success: false,
      message: "Submission failed",
    });
  }
};

exports.getStudentResults = async (req,res)=>{
  try{

    const studentId = req.user.id;

    const results = await Result.find({student:studentId})
      .populate("exam","title totalMarks")
      .sort({createdAt:-1});

    res.json({
      success:true,
      results
    });

  }catch(err){
    res.status(500).json({
      success:false,
      message:"Failed to fetch results"
    });
  }
};

exports.getResultAnalysis = async (req,res)=>{
  try{

    const {attemptId} = req.params;

    const attempt = await ExamAttempt.findById(attemptId)
      .populate("exam","title totalMarks questions")
      .populate({
        path:"answers.question",
        select:"questionText correctAnswer marks questionType"
      });

    res.json({
      success:true,
      attempt
    });

  }catch(err){
    res.status(500).json({
      success:false,
      message:"Failed to fetch analysis"
    });
  }
};


