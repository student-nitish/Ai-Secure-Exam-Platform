const cron = require("node-cron");
const Exam = require("../models/Exam");

cron.schedule("*/2 * * * *", async () => {
  try {
    const now = new Date();

    await Exam.updateMany(
      {
        endDate: { $lt: now },
        status: "published",
      },
      { status: "completed" }
    );

     // Re-open exams if endDate moved forward
     await Exam.updateMany(
    { endDate: { $gt: now }, status: "completed" },
    { status: "published" }
    );

    console.log("Exam status auto updated");
  } catch (err) {
    console.error("Cron error:", err);
  }
});
