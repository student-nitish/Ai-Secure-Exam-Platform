const Result = require("../models/Result");
const ExamAttempt = require("../models/ExamAttempt");
const Exam = require("../models/Exam");
const User = require("../models/UserSchema");

exports.getStudentDashboard = async (req, res) => {
  try {

    const studentId = req.user.id;

    /* ================= GET RESULTS ================= */

    const results = await Result.find({ student: studentId })
      .populate("exam", "title totalMarks");

    /* ================= KEEP BEST ATTEMPT PER EXAM ================= */

    const bestResultsMap = {};

    results.forEach((r) => {

      const examId = r.exam._id.toString();

      if (
        !bestResultsMap[examId] ||
        r.percentage > bestResultsMap[examId].percentage
      ) {
        bestResultsMap[examId] = r;
      }

    });

    const bestResults = Object.values(bestResultsMap);

    /* ================= BASIC STATS ================= */

    const totalExams = bestResults.length;

    let totalPercentage = 0;
    let passCount = 0;
    let bestScore = 0;

    const examScores = [];

    bestResults.forEach((r) => {

      totalPercentage += r.percentage;

      if (r.status === "pass") passCount++;

      if (r.percentage > bestScore) {
        bestScore = r.percentage;
      }

      examScores.push({
        exam: r.exam.title,
        percentage: r.percentage,
      });

    });

    const averageScore =
      totalExams > 0 ? (totalPercentage / totalExams).toFixed(1) : 0;

    const passRate =
      totalExams > 0
        ? ((passCount / totalExams) * 100).toFixed(1)
        : 0;

    /* ================= ACCURACY DISTRIBUTION ================= */

    const attempts = await ExamAttempt.find({
      student: studentId,
      status: "submitted",
    }).populate("exam");

   let correct = 0;
let wrong = 0;
let unattempted = 0;

attempts.forEach((attempt) => {

  const totalQuestions = attempt.exam.questions.length;

  const attempted = attempt.answers.filter(a => a.answer).length;

  const correctAnswers = attempt.answers.filter(a => a.isCorrect).length;

  const wrongAnswers = attempted - correctAnswers;

  correct += correctAnswers;
  wrong += wrongAnswers;
  unattempted += totalQuestions - attempted;

});

const attempted = correct + wrong;
const totalQuestions = correct + wrong + unattempted;

const completionRate =
  totalQuestions > 0
    ? ((attempted / totalQuestions) * 100).toFixed(1)
    : 0;

          /* ================= GENERATE INSIGHTS ================= */ 

    const insights = [];

    if (bestScore >= 80) {
      insights.push(`✔ Strong performance with best score ${bestScore}%`);
    }

    if (passRate < 50) {
      insights.push(`⚠ Pass rate is low (${passRate}%), consider more practice`);
    }

    if (completionRate >= 80) {
      insights.push(`✔ Excellent completion rate: ${completionRate}%`);
    }
    if (completionRate <= 80) {
      insights.push(`⚠ Poor completion rate: ${completionRate}% Improve This`);
    }


    if (examScores.length >= 3) {

      const last3 = examScores.slice(-3);

      const trend =
        last3[last3.length - 1].percentage -
        last3[0].percentage;

      if (trend > 0) {
        insights.push(`✔ Accuracy improved by ${trend.toFixed(1)}% in last 3 exams`);
      }

    }


    res.json({
      success: true,

      summary: {
        totalExams,
        averageScore,
        passRate,
        bestScore,
      },

      examScores,

      accuracyDistribution: {
        correct,
        wrong,
        unattempted,
      },

      completionRate,

      insights
    });

  } catch (error) {

    console.error("Dashboard error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard",
    });

  }
};

exports.getAdminDashboard = async (req, res) => {
  try {

    /* ================= BASIC COUNTS ================= */

    const totalExams = await Exam.countDocuments();

    const totalStudents = await User.countDocuments({
      role: "student",
    });

    const totalAttempts = await ExamAttempt.countDocuments({
      status: "submitted",
    });

    const pendingEvaluations = await ExamAttempt.countDocuments({
      evaluationStatus: "pending",
      status: "submitted",
    });

    /* ================= PASS / FAIL STATS ================= */

    const passCount = await Result.countDocuments({
      status: "pass",
    });

    const failCount = await Result.countDocuments({
      status: "fail",
    });

    /* ================= ATTEMPT TREND (LAST 7 DAYS) ================= */

    const last7DaysAttempts = await ExamAttempt.aggregate([
      {
        $match: {
          status: "submitted",
          submittedAt: {
            $gte: new Date(
              new Date().setDate(new Date().getDate() - 7)
            ),
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$submittedAt",
            },
          },
          attempts: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    /* ================= MOST POPULAR EXAMS ================= */

    const popularExams = await ExamAttempt.aggregate([
      {
        $group: {
          _id: "$exam",
          attempts: { $sum: 1 },
        },
      },
      {
        $sort: { attempts: -1 },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: "exams",
          localField: "_id",
          foreignField: "_id",
          as: "exam",
        },
      },
      {
        $unwind: "$exam",
      },
      {
        $project: {
          title: "$exam.title",
          attempts: 1,
        },
      },
    ]);

    /* ================= VIOLATION STATS ================= */

    const violationStats = await ExamAttempt.aggregate([
      { $unwind: "$violations" },
      {
        $group: {
          _id: "$violations",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          violation: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    /* ================= RESPONSE ================= */

    res.json({
      success: true,

      overview: {
        totalExams,
        totalStudents,
        totalAttempts,
        pendingEvaluations,
      },

      passFailStats: {
        pass: passCount,
        fail: failCount,
      },

      attemptsTrend: last7DaysAttempts,

      popularExams,

      violationStats,
    });

  } catch (error) {
    console.error("Admin dashboard error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load admin dashboard",
    });
  }
};