import { useEffect, useState } from "react";
import { apiConnector } from "../servicse/apiConnector";
import { FileText, Users, ClipboardList, Clock } from "lucide-react";
import KpiCard from "../component/kpiCard";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

const COLORS = ["#22c55e", "#ef4444"];

const AdminDashboard = () => {

  const [data,setData] = useState(null);

  const fetchDashboard = async () => {

    const res = await apiConnector(
      "GET",
      "/dashboard/admin"
    );

    setData(res.data);
  };

  useEffect(()=>{
    fetchDashboard();
  },[]);

  if(!data) return null;

  const { overview, attemptsTrend, passFailStats, popularExams, violationStats } = data;

  const passFailData = [
    { name:"Pass", value:passFailStats.pass },
    { name:"Fail", value:passFailStats.fail }
  ];

  const total = passFailStats.pass + passFailStats.fail;
const passPercentage = total
  ? ((passFailStats.pass / total) * 100).toFixed(0)
  : 0;

const renderCenterLabel = () => (
  <text
    x="50%"
    y="50%"
    textAnchor="middle"
    dominantBaseline="middle"
  >
    <tspan
      x="50%"
      dy="-6"
      className="fill-green-400 text-xl font-bold"
    >
      {passPercentage}%
    </tspan>

    <tspan
      x="50%"
      dy="18"
      className="fill-gray-400 text-sm"
    >
      Pass Rate
    </tspan>
  </text>
);

  return (

  <div className="p-6 md:p-10 text-white space-y-10">

    {/* PAGE TITLE */}

    <h1 className="text-3xl font-bold">
      Admin Dashboard
    </h1>


    {/* KPI CARDS */}

   <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

  <KpiCard
    title="Total Exams"
    value={overview.totalExams}
    icon={FileText}
  />

  <KpiCard
    title="Students"
    value={overview.totalStudents}
    icon={Users}
    color="text-blue-400"
  />

  <KpiCard
    title="Attempts"
    value={overview.totalAttempts}
    icon={ClipboardList}
    color="text-green-400"
  />

  <KpiCard
    title="Pending Evaluation"
    value={overview.pendingEvaluations}
    icon={Clock}
    color="text-yellow-400"
  />

   </div>


    {/* CHART SECTION */}

    <div className="grid md:grid-cols-2 gap-8">

      {/* ATTEMPT TREND */}

      <div className="bg-[#0f172a] p-6 rounded-xl">

        <h2 className="text-lg font-semibold mb-4">
          Attempts (Last 7 Days)
        </h2>

        <ResponsiveContainer width="100%" height={250}>

          <LineChart data={attemptsTrend}>

            <CartesianGrid stroke="#1e293b" />

            <XAxis dataKey="_id" stroke="#94a3b8"/>

            <YAxis stroke="#94a3b8"/>

            <Tooltip />

            <Line
              type="monotone"
              dataKey="attempts"
              stroke="#3b82f6"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>


      {/* PASS FAIL CHART */}

      <div className="bg-[#0f172a] p-3 rounded-xl">

  <h2 className="text-lg font-semibold mb-6 pt-3">
    Candidate Status
  </h2>

  <div className="flex flex-col items-center">

    {/* DONUT CHART */}

    <ResponsiveContainer width={220} height={220}>

      <PieChart>

        <Pie
          data={passFailData}
          dataKey="value"
          innerRadius={70}
          outerRadius={90}
          paddingAngle={4}
          label={renderCenterLabel}
        >
          <Cell fill="#10b981" /> 
          <Cell fill="#ef4444" />
        </Pie>

        <Tooltip />

      </PieChart>

    </ResponsiveContainer>


    {/* LEGEND */}

    <div className="w-full mt-6 space-y-3">

      {/* PASS */}

      <div className="flex justify-between items-center text-sm">

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span className="text-gray-300">Pass</span>
        </div>

        <span className="text-white font-semibold">
          {passFailStats.pass}
        </span>

      </div>


      {/* FAIL */}

      <div className="flex justify-between items-center text-sm">

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span className="text-gray-300">Fail</span>
        </div>

        <span className="text-white font-semibold">
          {passFailStats.fail}
        </span>

      </div>

    </div>

  </div>

</div>

    </div>


    {/* SECOND ROW */}

    <div className="grid md:grid-cols-2 gap-8">

      {/* POPULAR EXAMS */}

      <div className="bg-[#0f172a] p-6 rounded-xl">

        <h2 className="text-lg font-semibold mb-4">
          Most Attempted Exams
        </h2>

        <ResponsiveContainer width="100%" height={250}>

          <BarChart data={popularExams}>

            <CartesianGrid stroke="#1e293b"/>

            <XAxis dataKey="title" stroke="#94a3b8"/>

            <YAxis stroke="#94a3b8"/>

            <Tooltip/>

            <Bar
              dataKey="attempts"
              fill="#3b82f6"
              radius={[6,6,0,0]}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>


      {/* VIOLATION STATS */}

      <div className="bg-[#0f172a] p-6 rounded-xl">

        <h2 className="text-lg font-semibold mb-4">
          Proctoring Violations
        </h2>

        <div className="space-y-4">

          {violationStats.map((v,index)=>(

            <div key={index}>

              <div className="flex justify-between text-sm mb-1">
                <span>{v.violation}</span>
                <span>{v.count}</span>
              </div>

              <div className="w-full bg-gray-700 h-2 rounded">

                <div
                  style={{
                    width:`${v.count*5}%`
                  }}
                  className="bg-red-500 h-2 rounded"
                />

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  </div>

  );

};

export default AdminDashboard;