const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam",
     required: true,
  },

  questionText: {
    type: String,
    required: true,
  },

  options: [String],

  correctAnswer: String,

  marks: {
    type: Number,
    default: 1,
  },

  questionType: {
    type: String,
    enum: ["mcq", "subjective"],
    default: "mcq",
  },
});

module.exports = mongoose.model("Question", questionSchema);
