import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ExamSubmitted = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // summary passed from exam submit page
  const summary = location.state?.summary;

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center mt-17 px-4 text-white">

      <div className="bg-[#0f172a] max-w-xl w-full p-10 rounded-2xl shadow-lg text-center">

        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center text-3xl">
            ✓
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Exam Submitted Successfully
        </h1>

        <p className="text-gray-400 mb-6">
          Your responses have been recorded and sent for evaluation.
        </p>

        {/* Attempt Summary */}
        {summary && (
          <div className="grid grid-cols-2 gap-4 mb-6">

            <div className="bg-[#1e293b] p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Total Questions</p>
              <p className="text-xl font-semibold">
                {summary.totalQuestions}
              </p>
            </div>

            <div className="bg-[#1e293b] p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Attempted</p>
              <p className="text-green-400 text-xl font-semibold">
                {summary.attempted}
              </p>
            </div>

            <div className="bg-[#1e293b] p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Unattempted</p>
              <p className="text-red-400 text-xl font-semibold">
                {summary.unattempted}
              </p>
            </div>

            <div className="bg-[#1e293b] p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Time Taken</p>
              <p className="text-blue-400 text-xl font-semibold">
                {summary.timeTaken}
              </p>
            </div>

            <div className="bg-[#1e293b] p-4 rounded-lg">
               <p className="text-gray-400 text-sm">Violations</p>
                <p className="text-yellow-400 text-xl font-semibold">
                  {summary.violations}
              </p>
           </div>

          </div>
        )}

        {/* Result Pending Card */}
        <div className="bg-yellow-500/10 border border-yellow-500 rounded-xl p-5 mb-6">

          <h3 className="text-yellow-400 font-semibold mb-2">
            Result Under Review
          </h3>

          <p className="text-sm text-gray-300">
            Your exam will be evaluated by our AI system and instructors.
            The final result will be declared soon.
          </p>

        </div>

        {/* Notification */}
        <div className="bg-[#1e293b] p-4 rounded-lg text-sm text-gray-300 mb-6">
          📩 You will receive a notification once your result
          is published.
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4">

          <button
            onClick={() => navigate("/allexams")}
            className="flex-1 bg-gradient-to-r from-blue-600 to-green-500 py-3 rounded-lg font-semibold hover:opacity-90"
          >
            Back to Exams
          </button>

          <button
            onClick={() => navigate("/student")}
            className="flex-1 bg-gray-700 py-3 rounded-lg hover:bg-gray-600"
          >
            Go to Dashboard
          </button>

        </div>

        <p className="text-xs text-gray-500 mt-6">
          Note: If subjective questions are present, evaluation may take additional time.
        </p>

      </div>
    </div>
  );
};

export default ExamSubmitted;