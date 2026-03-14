const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema(
  {
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    answers: [
    {
      question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },

      answer: String,

      isCorrect: {
        type: Boolean,
        default: null,
      },

      marksObtained: {
        type: Number,
        default: 0,
      },
    },
  ],

   totalMarksObtained: {
    type: Number,
    default: 0,
  },

    startedAt: Date,
    submittedAt: Date,

evaluationStatus: {
  type: String,
  enum: ["pending", "evaluated"],
  default: "pending",
},
   violations: [
    {
      type: String,      
    }
    ],

    status: {
      type: String,
      enum: ["in-progress", "submitted"],
      default: "in-progress",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ExamAttempt", attemptSchema);
