const Question = require("../models/Question");
const Exam = require("../models/Exam");

 exports.addQuestion = async (req, res) => {
  try {
    const { examId, questions } = req.body;

    if (!examId || !questions?.length) {
      return res.status(400).json({
        success: false,
        message: "Exam ID and questions required",
      });
    }

    // ⭐ Check exam exists
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({
        message: "Exam not found",
      });
    }

    const questionIds = [];
    let addedMarks = 0;

    for (const q of questions) {
      if (!q.questionText) continue;

      const question = await Question.create({
        exam: examId,
        questionText: q.questionText,
        options: q.options || [],
        correctAnswer: q.correctAnswer || "",
        marks: q.marks || 1,
        questionType: q.questionType || "mcq",
      });

      questionIds.push(question._id);
      addedMarks += question.marks;
    }

    // ⭐ Update exam
    exam.questions.push(...questionIds);
    exam.totalMarks += addedMarks;

    await exam.save();

    res.json({
      success: true,
      message: "Questions added successfully",
      totalQuestionsAdded: questionIds.length,
    });

  } catch (error) {
    console.error("Add manual questions error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add questions",
    });
  }
};


 exports.getExamQuestions = async (req, res) => {
  try {
    const { examId } = req.params;

    // Check exam exists
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    // Fetch questions linked to exam
    const questions = await Question.find({ exam: examId });

    res.status(200).json({
      success: true,
      questions,
    });
  } catch (error) {
    console.error("Fetch Questions Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch questions",
    });
  }
};


exports.deleteQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;

    // 1️⃣ Find question first
    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // 2️⃣ Remove question from exam
    await Exam.findByIdAndUpdate(
      question.exam,
      {
        $pull: { questions: questionId },
        $inc: { totalMarks: -question.marks },
      },
      { new: true }
    );

    // 3️⃣ Delete question
    await Question.findByIdAndDelete(questionId);

    res.json({
      success: true,
      message: "Question deleted successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error deleting question",
    });
  }
};




