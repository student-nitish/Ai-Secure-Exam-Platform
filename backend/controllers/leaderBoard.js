const Result = require("../models/Result");

exports.getGlobalLeaderboard = async (req, res) => {
  try {

    const leaderboard = await Result.aggregate([

      {
        $group: {
          _id: "$student",
          avgScore: { $avg: "$percentage" },
          examsAttempted: { $sum: 1 }
        }
      },

      {
        $sort: { avgScore: -1 }
      },

      {
        $limit: 10
      },

      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "student"
        }
      },

      { $unwind: "$student" },

      {
        $project: {
          _id: 0,
          studentId: "$student._id",
          name: "$student.name",
          email: "$student.email",
          avgScore: { $round: ["$avgScore", 2] },
          examsAttempted: 1,
          image:"$student.image"
        }
      }

    ]);

    res.json({
      success: true,
      leaderboard
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch leaderboard"
    });

  }
};