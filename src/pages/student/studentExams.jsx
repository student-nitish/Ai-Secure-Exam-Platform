import { useEffect, useState } from "react";
import { apiConnector } from "../../servicse/apiConnector";
import { useNavigate } from "react-router-dom";

const StudentResults = () => {
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const fetchResults = async () => {
    const res = await apiConnector("GET", "/exams/student");
    // console.log("after fetching result", res.data);

    setResults(res.data.results);
  };

  useEffect(() => {
    fetchResults();
  }, []);

  return (
    <div className="p-6 text-white">

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-8">
        My Exam Results
      </h1>

      {/* RESULT CARDS */}
      <div className="grid md:grid-cols-2 gap-6">

        {results.map((r) => {
          const percent = r.percentage;

          return (
            <div
              key={r._id}
              className="bg-[#0f172a] rounded-2xl p-6 shadow-lg hover:shadow-blue-500/10 transition"
            >

              {/* EXAM TITLE + STATUS */}
              <div className="flex justify-between items-center mb-4">

                <h2 className="text-lg font-semibold">
                  {r.exam.title}
                </h2>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    r.status === "pass"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {r.status.toUpperCase()}
                </span>

              </div>

              {/* SCORE */}
              <p className="text-gray-400 text-sm mb-1">
                Score
              </p>

              <p className="text-xl font-bold mb-4">
                {r.score} / {r.totalMarks}
              </p>

              {/* PROGRESS BAR */}
              <div className="w-full bg-gray-700 h-2 rounded mb-4">

                <div
                  className={`h-2 rounded ${
                    percent >= 50
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${percent}%` }}
                />

              </div>

              {/* FOOTER */}
              <div className="flex justify-between items-center">

                <p className="text-blue-400 font-semibold">
                  {percent}%
                </p>

                <button
                  onClick={() =>
                    navigate(`/student/results/${r.attempt}`)
                  }
                  className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition"
                >
                  View Analysis
                </button>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
};

export default StudentResults;