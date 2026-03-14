const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

     attempt: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ExamAttempt",
  },

    score: Number,
    totalMarks: Number,

    percentage: Number,

    status: {
      type: String,
      enum: ["pass", "fail"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Result", resultSchema);
