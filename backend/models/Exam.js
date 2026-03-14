const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    examThumbnail: {
  type: String,
  default: "",
},

    duration: {
      type: Number, 
      required: true,
    },

    totalMarks: {
      type: Number,
      default: 0,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    maxAttempts: {
      type: Number,
      default: 1,
    },

    passingMarks: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["draft", "published", "completed"],
      default: "draft",
    },

   
    proctorSettings: {
      enableProctoring: {
        type: Boolean,
        default: false,
      },
      maxWarnings: {
        type: Number,
        default: 3,
      },
      autoSubmitOnViolation: {
        type: Boolean,
        default: true,
      },
    },

   
    resultPublishDate: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exam", examSchema);
