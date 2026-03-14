const { GoogleGenerativeAI } = require("@google/generative-ai");
const Question = require("../models/Question");
const Exam = require("../models/Exam");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

exports.generateQuestionsAI = async (req, res) => {
  try {
    const {  topic, count, type } = req.body;

    if ( !topic) {
      return res.status(400).json({
        success: false,
        message: "topic required",
      });
    }

    // const exam = await Exam.findById(examId);
    // if (!exam) {
    //   return res.status(404).json({
    //     message: "Exam not found",
    //   });
    // }

    const numQuestions = Math.min(count || 5, 40);
    const qType = type || "mcq";

    // ⭐ AI Prompt (Adjusted to your schema)
    const prompt = `
You are an expert exam creator.

Generate ${numQuestions} ${qType} questions about "${topic}".

Return ONLY valid JSON array with structure:

[
  {
    "questionText": "Question string",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A"
  }
]

Rules:
1. If type = subjective → options should be [] and correctAnswer "".
2. No markdown.
3. Only JSON response.
`;

    const result = await model.generateContent(prompt);

    const text = result.response
      .text()
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let aiQuestions;

    try {
      aiQuestions = JSON.parse(text);
    } catch (err) {
      console.error("AI parse error:", text);
      return res.status(500).json({
        success: false,
        message: "AI JSON parse failed",
      });
    }

    // ⭐ Save to DB
    // const savedIds = [];
    // let addedMarks = 0;

    // for (const q of aiQuestions) {
    //   const question = await Question.create({
    //     exam: examId,
    //     questionText: q.questionText,
    //     options: q.options || [],
    //     correctAnswer: q.correctAnswer || "",
    //     marks: 1,
    //     questionType: qType,
    //   });

    //   savedIds.push(question._id);
    //   addedMarks += 1;
    // }

    // // exam.questions.push(...savedIds);
    // // exam.totalMarks += addedMarks;

    //  await exam.save();

    return res.json({
      success: true,
      message: "AI questions generated successfully",
      questions: aiQuestions,
    });

  } catch (error) {
    console.error("AI generation error:", error);
    return res.status(500).json({
      success: false,
      message: "AI generation failed",
    });
  }
};
