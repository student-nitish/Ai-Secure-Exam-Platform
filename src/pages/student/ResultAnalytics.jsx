import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";

const ResultAnalytics = ({ attempt }) => {
  const totalQuestions = attempt.exam.questions.length;

  const correct = attempt.answers.filter((a) => a.isCorrect).length;

  const wrong = attempt.answers.filter((a) => a.answer && !a.isCorrect).length;

  const unattempted = totalQuestions - correct - wrong;

  const accuracy = ((correct / totalQuestions) * 100).toFixed(1);

  const timeTaken = (() => {
    const start = new Date(attempt.startedAt);
    const end = new Date(attempt.submittedAt);

    const diff = Math.floor((end - start) / 1000);

    const min = Math.floor(diff / 60);
    const sec = diff % 60;

    return `${min}m ${sec}s`;
  })();

  const data = [
    { name: "Correct", value: correct },
    { name: "Wrong", value: wrong },
    { name: "Unattempted", value: unattempted },
  ];

  const COLORS = ["#22c55e", "#ef4444", "#64748b"];

  /* ===== animated bars ===== */

  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 200);
  }, []);

  const CustomTooltip = ({ active, payload, coordinate }) => {
  if (!active || !payload) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: coordinate.x - 40,
        top: coordinate.y - 70, // move tooltip above slice
        background: "#020617",
        border: "1px solid #334155",
        padding: "6px 10px",
        borderRadius: "8px",
        color: "white",
        fontSize: "13px",
        pointerEvents: "none",
      }}
    >
      {payload[0].name}: {payload[0].value}
    </div>
  );
};

  return (
    <div className="space-y-10 mb-10">
      {/* ===== TOP ANALYTICS CARDS ===== */}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-[#0f172a] p-6 rounded-xl">
          <p className="text-gray-400 text-sm">Score</p>
          <h2 className="text-2xl font-bold text-blue-400">
            {attempt.totalMarksObtained} / {attempt.exam.totalMarks}
          </h2>
        </div>

        <div className="bg-[#0f172a] p-6 rounded-xl">
          <p className="text-gray-400 text-sm">Accuracy</p>
          <h2 className="text-2xl font-bold text-green-400">{accuracy}%</h2>
        </div>

        <div className="bg-[#0f172a] p-6 rounded-xl">
          <p className="text-gray-400 text-sm">Time Spent</p>
          <h2 className="text-2xl font-bold text-yellow-400">{timeTaken}</h2>
        </div>
      </div>

      {/* ===== ANSWER DISTRIBUTION ===== */}

      <div className="bg-[#0f172a] rounded-2xl p-8">
        <h2 className="text-lg font-semibold mb-8 text-gray-200">
          Answer Distribution
        </h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* ===== PIE CHART ===== */}

          <div className="relative flex justify-center">
            <ResponsiveContainer width={250} height={250}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  outerRadius={90}
                  innerRadius={60}
                >
                  {data.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>

                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* CENTER LABEL */}

            <div className="absolute flex flex-col items-center justify-center h-full">
              <span className="text-2xl font-bold text-green-400">
                {accuracy}%
              </span>

              <span className="text-xs text-gray-400">Accuracy</span>
            </div>
          </div>

          {/* ===== PROGRESS STATS ===== */}

          <div className="space-y-6">
            {/* CORRECT */}

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-green-400 font-medium">Correct</span>
                <span>{correct}</span>
              </div>

              <div className="w-full bg-gray-700 h-2 rounded">
                <div
                  style={{
                    width: animate
                      ? `${(correct / totalQuestions) * 100}%`
                      : "0%",
                  }}
                  className="bg-green-500 h-2 rounded transition-all duration-700"
                />
              </div>
            </div>

            {/* WRONG */}

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-red-400 font-medium">Wrong</span>
                <span>{wrong}</span>
              </div>

              <div className="w-full bg-gray-700 h-2 rounded">
                <div
                  style={{
                    width: animate
                      ? `${(wrong / totalQuestions) * 100}%`
                      : "0%",
                  }}
                  className="bg-red-500 h-2 rounded transition-all duration-700"
                />
              </div>
            </div>

            {/* UNATTEMPTED */}

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400 font-medium">Unattempted</span>
                <span>{unattempted}</span>
              </div>

              <div className="w-full bg-gray-700 h-2 rounded">
                <div
                  style={{
                    width: animate
                      ? `${(unattempted / totalQuestions) * 100}%`
                      : "0%",
                  }}
                  className="bg-gray-400 h-2 rounded transition-all duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultAnalytics;
