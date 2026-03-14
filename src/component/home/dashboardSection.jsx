import React from 'react'
import { useNavigate } from 'react-router-dom'

const dashboardSection = () => {
  const navigate=useNavigate();
  return (
    <div>
  {/* ANALYTICS DASHBOARD SECTION */}
  <section
    className="py-24 px-6
    bg-gradient-to-br
    from-white via-slate-50 to-slate-100
    dark:from-[#020617] dark:via-[#0f172a] dark:to-[#01283e]
    text-slate-900 dark:text-white"
  >
    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

      {/* LEFT CONTENT */}
      <div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-6">
          Powerful Analytics Dashboard
        </h2>

        <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-lg">
          Get comprehensive insights on exam performance, cheating probability,
          and detailed student analytics.
        </p>

        {/* Features List */}
        <div className="space-y-6 mb-10">
          {[
            {
              title: "Performance Graphs",
              desc: "Visual representation of student performance trends and patterns",
            },
            {
              title: "Cheating Probability Insights",
              desc: "AI-powered analysis to identify potential integrity issues",
            },
            {
              title: "Exam Difficulty Stats",
              desc: "Detailed metrics on question difficulty and performance correlation",
            },
          ].map((item, i) => (
            <div key={i} className="flex gap-3 items-start">

              {/* Tick Icon */}
              <div
                className="mt-1 w-6 h-6 rounded-full
                bg-teal-500/20 dark:bg-teal-500/30
                flex items-center justify-center"
              >
                ✓
              </div>

              <div>
                <h4 className="font-semibold">{item.title}</h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          className="px-8 py-4 rounded-xl
          bg-gradient-to-r from-indigo-600 to-teal-500
          text-white flex items-center gap-2
          hover:scale-105 transition"

          onClick={()=>navigate("/student")}
        >
      
          View Dashboard →
        </button>
      </div>

      {/* RIGHT SIDE DASHBOARD MOCK */}
      <div className="relative">
        <div
          className="rounded-2xl border
          border-slate-200 dark:border-white/10
          bg-white dark:bg-white/5
          backdrop-blur-xl p-6 shadow-2xl"
        >
          <div className="flex justify-between mb-6">
            <h4 className="text-lg">Exam Performance</h4>
            📊
          </div>

          {/* Progress Bars */}
          {[
            { label: "Average Score", value: "78%" },
            { label: "Completion Rate", value: "94%" },
            { label: "Violation Rate", value: "2.3%" },
          ].map((item, i) => (
            <div key={i} className="mb-5">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-500 dark:text-slate-400">
                  {item.label}
                </span>
                <span>{item.value}</span>
              </div>

              <div className="h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                <div
                  style={{ width: item.value }}
                  className="h-full rounded-full
                  bg-gradient-to-r from-indigo-500 to-teal-400"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  </section>
</div>

  )
}

export default dashboardSection