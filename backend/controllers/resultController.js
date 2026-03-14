
const ExamAttempt = require("../models/ExamAttempt");
const Result = require("../models/Result");
const { getIO } = require("../socket/socket");
const Notification = require("../models/notification");


exports.getPendingEvaluations = async (req, res) => {
  try {

    const attempts = await ExamAttempt.find({
      evaluationStatus: "pending",
      status: "submitted"
    })
      .populate("student", "name email")
      .populate("exam", "title");

    res.json({
      success: true,
      attempts
    });

  } catch (error) {
    res.status(500).json({
      success:false,
      message:"Failed to fetch attempts"
    });
  }
};

exports.getAttemptDetails = async (req,res)=>{
  try{

    const {attemptId} = req.params;

    const attempt = await ExamAttempt.findById(attemptId)
      .populate("student","name email")
      .populate("exam","title totalMarks")
      .populate({
        path:"answers.question",
        model:"Question"
      });

    res.json({
      success:true,
      attempt
    });

  }catch(error){
    res.status(500).json({
      success:false,
      message:"Failed to fetch attempt"
    });
  }
};

exports.evaluateAttempt = async (req,res)=>{
  try{

    const {attemptId} = req.params;
    const {answers} = req.body;

    const attempt = await ExamAttempt.findById(attemptId)
      .populate("exam");

    let totalMarksObtained =  0;

    answers.forEach(update => {

      const ans = attempt.answers.find(
        a => a.question.toString() === update.questionId
      );

      if(ans){
        ans.marksObtained = update.marksObtained;        
      }


    });

       // recalculate total marks safely
    attempt.answers.forEach(ans => {
      totalMarksObtained += ans.marksObtained || 0;
    });

    attempt.totalMarksObtained = totalMarksObtained;
    attempt.evaluationStatus = "evaluated";

    await attempt.save();

    res.json({
      success:true,
      message:"Evaluation saved"
    });

  }catch(error){
    res.status(500).json({
      success:false,
      message:"Evaluation failed"
    });
  }
};

exports.publishResult = async (req,res)=>{
  try{

    const {attemptId} = req.params;

    const attempt = await ExamAttempt.findById(attemptId)
      .populate("exam");

    const totalMarks = attempt.exam.totalMarks;
    const score = attempt.totalMarksObtained;

    const percentage = (score/totalMarks)*100;

    const status = score >=attempt.exam.passingMarks  ? "pass" : "fail";

    const result = await Result.create({
      exam:attempt.exam._id,
      student:attempt.student,
      attempt:attemptId,
      score,
      totalMarks,
      percentage,
      status
    });

    // 🔔 Save notification in DB
    await Notification.create({
      user: attempt.student,
      message: `Your result for ${attempt.exam.title} has been published`,
      type: "RESULT_PUBLISHED"
    });

    // 📡 Emit real-time notification
    const io = getIO();

    io.to(attempt.student.toString()).emit("resultPublished", {
      message: `Your result for ${attempt.exam.title} has been published`,
      examId: attempt.exam._id,
      resultId: result._id
    });

    res.json({
      success:true,
      result
    });

  }catch(error){
    res.status(500).json({
      success:false,
      message:"Result publish failed"
    });
  }
};





