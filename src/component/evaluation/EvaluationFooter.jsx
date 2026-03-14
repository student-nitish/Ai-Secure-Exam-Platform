import React from "react";
import { useParams } from "react-router-dom";
import { apiConnector } from "../../servicse/apiConnector";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const EvaluationFooter = ({ attempt, marks }) => {
  const { attemptId } = useParams();
  const navigate=useNavigate();

  /* ================= SCORE CALCULATION ================= */

  let mcqScore = 0;
  let mcqTotal = 0;

  let subjectiveScore = 0;
  let subjectiveTotal = 0;

  attempt.answers.forEach((ans) => {
    const q = ans.question;

    if (q.questionType === "mcq") {
      mcqScore += ans.marksObtained || 0;
      mcqTotal += q.marks;
    }

    if (q.questionType === "subjective") {
      subjectiveScore += Number(marks[q._id] || 0);
      subjectiveTotal += q.marks;
    }
  });

  const totalScore = mcqScore + subjectiveScore;
  const totalMarks = attempt.exam.totalMarks;

  /* ================= SAVE EVALUATION ================= */

  const handleSave = async () => {
    try {
      const payload = Object.entries(marks).map(
        ([questionId, marksObtained]) => ({
          questionId,
          marksObtained: Number(marksObtained),
        })
      );

      await apiConnector(
        "POST",
        `/results/evaluate/${attemptId}`,
        { answers: payload }
      );

      toast.success("Evaluation saved");
    } catch {
      toast.error("Save failed");
    }
  };

  /* ================= PUBLISH RESULT ================= */

  const handlePublish = async () => {
    try {
      await apiConnector(
        "POST",
        `/results/publish/${attemptId}`
      );

      toast.success("Result published");
     setTimeout(() => {
      navigate(`/admin/evaluate`);
    }, 2000); 

    } catch {
      toast.error("Publish failed");
    }
  };

  return (
  <div className="rounded-2xl mt-2 -ml-5 -mr-6 bg-[#0f172a] border-t border-gray-700 px-4 sm:px-10 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

    {/* ===== SCORES ===== */}

    <div className="flex flex-wrap gap-6 sm:gap-10 text-sm w-full sm:w-auto">

      <div>
        <p className="text-gray-400 text-xs sm:text-sm">MCQ Score</p>
        <p className="text-base sm:text-lg font-semibold">
          {mcqScore} / {mcqTotal}
        </p>
      </div>

      <div>
        <p className="text-gray-400 text-xs sm:text-sm">Subjective</p>
        <p className="text-base sm:text-lg font-semibold">
          {subjectiveScore} / {subjectiveTotal}
        </p>
      </div>

      <div>
        <p className="text-gray-400 text-xs sm:text-sm">Total</p>
        <p className="text-base sm:text-lg font-semibold text-blue-400">
          {totalScore} / {totalMarks}
        </p>
      </div>

    </div>

    {/* ===== ACTION BUTTONS ===== */}

    <div className="flex flex-wrap gap-3 sm:gap-4 w-full sm:w-auto">

      <button
        onClick={handleSave}
        className="bg-indigo-600 hover:bg-indigo-500 px-4 sm:px-6 py-2 rounded-xl flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
      >
        💾 Save Evaluation
      </button>

      <button
        onClick={handlePublish}
        className="bg-green-600 hover:bg-green-500 px-4 sm:px-6 py-2 rounded-xl flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
      >
        ✈ Publish Result
      </button>

    </div>

  </div>
);
};

export default EvaluationFooter;