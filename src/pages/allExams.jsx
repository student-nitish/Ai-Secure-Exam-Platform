import React, { useEffect, useState } from "react";
import { apiConnector } from "../servicse/apiConnector";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AllExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);

      const res = await apiConnector("GET", "/exams/available");
      console.log("all exmas", res.data.exams);

      setExams(res.data.exams || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load exams");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-10 mt-10 text-center ">
        Explore Exams
      </h1>

      {/* Loading State */}
      {loading && (
        <div className="text-center text-gray-400">Loading exams...</div>
      )}

      {/* Empty State */}
      {!loading && exams.length === 0 && (
        <div className="text-center text-gray-500">
          No exams available right now.
        </div>
      )}

      {/* Exam Grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {exams.map((exam) => (
          <div
            key={exam._id}
            className="bg-[#0f172a] rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 flex flex-col"
          >
            {/* Thumbnail */}
            {exam.examThumbnail && (
              <img
                src={exam.examThumbnail}
                alt="exam thumbnail"
                className="h-48 w-full object-cover"
              />
            )}

            <div className="p-6 flex flex-col flex-grow">
              {/* Title */}
              <h2 className="text-xl font-semibold mb-2">{exam.title}</h2>

              {/* Description */}
              <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                {exam.description || "No description provided."}
              </p>

              {/* Info */}
              <div className="text-sm text-gray-300 space-y-1 mb-4">
                <p>⏱ Duration: {exam.duration} mins</p>
                <p>📅 Ends: {new Date(exam.endDate).toLocaleString()}</p>
              </div>

              {/* Exam Stats */}
              <div className="grid grid-cols-2 gap-3 text-sm text-gray-300 mb-4">
                <p>📝 {exam.questions?.length || 0} Questions</p>
                <p>🎯 {exam.totalMarks} Marks</p>

                <p>🏆 Pass: {exam.passingMarks}</p>
                 <p className="text-sm text-gray-400">
                🔁 Attempts Left: {exam.attemptsLeft}/{exam.maxAttempts}
                 </p>
              </div>

              {/* Status Badge */}
              <span className="inline-block bg-green-600 text-xs px-3 py-1 rounded-full w-fit mb-4">
                Live
              </span>

        

              {/* Spacer */}
              <div className="flex-grow"></div>

              {/* Start Button */}
              <button
                disabled={exam.attemptsLeft <= 0}
                onClick={() => navigate(`/student/exam/${exam._id}`)}
                className={`w-full py-2 rounded-lg font-semibold transition
           ${
          exam.attemptsLeft <= 0
        ? "bg-gray-600 text-gray-300 cursor-not-allowed"
        : "bg-yellow-500 text-black hover:bg-yellow-400"
        }
      `}
              >
                {exam.attemptsLeft <= 0 ? "Attempts Over" : "Start Exam"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllExams;
