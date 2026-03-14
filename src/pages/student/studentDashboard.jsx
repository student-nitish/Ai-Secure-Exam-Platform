import { useEffect, useState } from "react";
import { apiConnector } from "../../servicse/apiConnector";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

const StudentDashboard = () => {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    const res = await apiConnector("GET", "/dashboard/student");
    setDashboard(res.data);
  };

  if (!dashboard) return null;

  const { summary, examScores, accuracyDistribution } = dashboard;

  const pieData = [
    { name: "Correct", value: accuracyDistribution.correct },
    { name: "Wrong", value: accuracyDistribution.wrong },
    { name: "Unattempted", value: accuracyDistribution.unattempted },
  ];

  const COLORS = ["#22c55e", "#ef4444", "#64748b"];

  return (
    <div className="p-6 md:p-10   text-white space-y-10">

      {/* PAGE TITLE */}

      <h1 className="text-3xl font-bold">
        Performance Dashboard
      </h1>

      {/* SUMMARY CARDS */}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-[#0f172a] p-6 rounded-xl">
          <p className="text-gray-400 text-sm">Exams Attempted</p>
          <h2 className="text-2xl font-bold text-blue-400">
            {summary.totalExams}
          </h2>
        </div>

        <div className="bg-[#0f172a] p-6 rounded-xl">
          <p className="text-gray-400 text-sm">Average Score</p>
          <h2 className="text-2xl font-bold text-green-400">
            {summary.averageScore}%
          </h2>
        </div>

        <div className="bg-[#0f172a] p-6 rounded-xl">
          <p className="text-gray-400 text-sm">Pass Rate</p>
          <h2 className="text-2xl font-bold text-yellow-400">
            {summary.passRate}%
          </h2>
        </div>

        <div className="bg-[#0f172a] p-6 rounded-xl">
          <p className="text-gray-400 text-sm">Best Score</p>
          <h2 className="text-2xl font-bold text-purple-400">
            {summary.bestScore}%
          </h2>
        </div>

      </div>

      {/* CHART SECTION */}

      <div className="grid lg:grid-cols-2 gap-8">

        {/* SCORE TREND */}

        <div className="bg-[#0f172a] p-6 rounded-xl">

          <h2 className="text-lg font-semibold mb-4">
            Score Trend
          </h2>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={examScores}>
              <CartesianGrid stroke="#1e293b" />
              <XAxis dataKey="exam" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="percentage"
                stroke="#3b82f6"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>

        </div>

        {/* ACCURACY PIE */}

        <div className="bg-[#0f172a] p-6 rounded-xl">

          <h2 className="text-lg font-semibold mb-4">
            Accuracy Distribution
          </h2>

          <div className="flex justify-center">

            <ResponsiveContainer width={250} height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"                 
                  outerRadius={100}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index]}
                    />
                  ))}
                </Pie>

                <Tooltip />

              </PieChart>
            </ResponsiveContainer>

          </div>

        </div>

      </div>

      {/* BAR CHART */}

      <div className="bg-[#0f172a] p-6 rounded-xl">

        <h2 className="text-lg font-semibold mb-4">
          Score Per Exam
        </h2>

        <ResponsiveContainer width="100%" height={300}>

          <BarChart data={examScores}>

            <CartesianGrid stroke="#1e293b" />

            <XAxis dataKey="exam" stroke="#94a3b8" />

            <YAxis stroke="#94a3b8" />

            <Tooltip />

            <Bar
              dataKey="percentage"
              fill="#22c55e"
              radius={[6, 6, 0, 0]}
            />

          </BarChart>

        </ResponsiveContainer>

       
      </div>
       <div className="bg-[#0f172a] p-6 rounded-xl">

<h2 className="text-lg font-semibold mb-4">
Performance Insights
</h2>

<ul className="space-y-2 text-gray-300">

{dashboard.insights.map((insight, index) => (

<li key={index} className="flex items-center gap-2">

<span>{insight}</span>

</li>

))}

</ul>

       </div>

    </div>
  );
};

export default StudentDashboard;