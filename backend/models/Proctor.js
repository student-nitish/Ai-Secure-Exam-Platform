const mongoose = require("mongoose");

const proctorLogSchema = new mongoose.Schema(
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

    violations: [
      {
        type: {
          type: String,
          required: true,
        },

        timestamp: {
          type: Date,
          default: Date.now,
        },

        confidenceScore: Number,

        description: String,
      },
    ],

    warningsCount: {
      type: Number,
      default: 0,
    },

    autoSubmitted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProctorLog", proctorLogSchema);
