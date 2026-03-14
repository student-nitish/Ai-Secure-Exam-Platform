const Exam = require("../models/Exam");
const { cloudinary } = require("../config/cloudinary");
const path=require("path");
const ExamAttempt=require("../models/ExamAttempt");
const Notification = require("../models/notification");
const User=require("../models/UserSchema");
const { getIO } = require("../socket/socket");

 exports.createExam = async (req, res) => {
  try {
    const {
      title,
      description,
      duration,
      startDate,
      endDate,
      passingMarks,
      resultPublishDate,
      maxAttempts,
      proctorSettings,
    } = req.body;

    console.log("aatempts",maxAttempts);

    // Basic validation
    if (!title || !duration || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    // ⭐ Upload Thumbnail (Cloudinary)
    let thumbnailUrl = "";

    if (req.files?.thumbnail) {
      const filePath = path.resolve(
        req.files.thumbnail.tempFilePath
      );

      const uploadResult =
        await cloudinary.uploader.upload(filePath, {
          folder: "exam-thumbnails",
          resource_type: "auto",
        });

      thumbnailUrl = uploadResult.secure_url;
    }

    // ⭐ Create Exam
    const exam = await Exam.create({
      title,
      description,
      duration,
      startDate,
      endDate,
      passingMarks: passingMarks || 0,
      resultPublishDate,
      maxAttempts: maxAttempts || 1,
      examThumbnail: thumbnailUrl,
      createdBy: req.user.id,
      proctorSettings: proctorSettings || {},
      totalMarks: 0, // will update when questions added
      status: "draft", // default
    });

    return res.status(201).json({
      success: true,
      message: "Exam created successfully",
      exam,
    });

  } catch (error) {
    console.error("Create exam error:", error);

    return res.status(500).json({
      success: false,
      message: "Error creating exam",
      error: error.message,
    });
  }
};


 exports.publishExam = async (req, res) => {
  try {
   
    console.log(req.body);
    const { examId } = req.body;
    

    const exam = await Exam.findByIdAndUpdate(
      examId,
      { status: "published" },
      { new: true }
    );

    const students = await User.find({ role: "student" });

    await Notification.insertMany(
  students.map((student) => ({
    user: student._id,
    message: `New exam available: ${exam.title}`,
    type: "EXAM_CREATED",
  }))
   );

      // Emit socket event
    const io = getIO();

    // Send real-time notification
    io.emit("newExam", {
      message: `New exam available: ${exam.title}`,
      examId: exam._id,
    });

    res.json({
      success: true,
      message: "Exam published",
      exam,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Publish failed",
    });
  }
};


exports.getAdminExams = async (req, res) => {
  const exams = await Exam.find({
    createdBy: req.user.id,
  }).sort({ createdAt: -1 });

  res.json({
    success: true,
    exams,
  });
};

exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.examId);

    res.json({ exam });
  } catch (err) {
    res.status(500).json({ message: "Error fetching exam" });
  }
};


exports.updateExam = async (req, res) => {
  try {
    const { examId } = req.params;

    const {
      title,
      description,
      duration,
      startDate,
      endDate,
      passingMarks,
    } = req.body;

    const exam = await Exam.findById(examId);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    /* ===== Thumbnail Upload (Optional) ===== */
    if (req.files?.thumbnail) {
      const filePath = path.resolve(req.files.thumbnail.tempFilePath);

      const uploadResult = await cloudinary.uploader.upload(
        filePath,
        {
          folder: "exam-thumbnails",
          resource_type: "auto",
        }
      );

      exam.examThumbnail = uploadResult.secure_url;
    }

    /* ===== Update Fields ===== */
    exam.title = title ?? exam.title;
    exam.description = description ?? exam.description;
    exam.duration = duration ?? exam.duration;
    exam.startDate = startDate ?? exam.startDate;
    exam.endDate = endDate ?? exam.endDate;
    exam.passingMarks = passingMarks ?? exam.passingMarks;

    await exam.save();

    res.json({
      success: true,
      message: "Exam updated successfully",
      exam,
    });

  } catch (error) {
    console.error("Update Exam Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update exam",
    });
  }
};

//Student controller

exports.getAvailableExams = async (req, res) => {
  try {
    const now = new Date();
    const studentId = req.user.id;

    const exams = await Exam.find({
      status: "published",
      startDate: { $lte: now },
      endDate: { $gte: now },
    });

    const examsWithAttempts = await Promise.all(
      exams.map(async (exam) => {

        const attemptsUsed = await ExamAttempt.countDocuments({
          exam: exam._id,
          student: studentId,
        });

        return {
          ...exam.toObject(),
          attemptsUsed,
          attemptsLeft: exam.maxAttempts - attemptsUsed,
        };

      })
    );

    res.json({
      success: true,
      exams: examsWithAttempts,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching exams",
    });
  }
};





