import React from 'react'
import { Eye, AlertTriangle, Bell, Shield } from "lucide-react";


const AiProctor = () => {
  return (
    <div>{/* AI PROCTORING USP SECTION */}
<section className="py-20 px-6
bg-gradient-to-br
from-slate-50 via-white to-slate-100
dark:from-[#020617] dark:via-[#0f172a] dark:to-[#01283e]">

  <div className="max-w-7xl mx-auto">

    {/* Badge */}
    <div className="text-center mb-6">
      <span className="inline-flex items-center gap-2 px-4 py-1.5
      rounded-full text-xs font-medium
      border border-indigo-400/30
      bg-indigo-500/10 text-indigo-500 dark:text-indigo-300">
        Core USP
      </span>
    </div>

    {/* Heading */}
    <div className="text-center mb-14">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl
      font-semibold text-slate-900 dark:text-white mb-3">
        Advanced AI Proctoring
      </h2>

      <p className="text-slate-600 dark:text-slate-400">
        Our AI-powered monitoring system ensures exam integrity and fairness
      </p>
    </div>

    {/* Cards */}
    <div className="grid md:grid-cols-2 gap-8">

      {[
        {
          icon: Eye,
          title: "Face Detection",
          desc: "Continuous facial recognition ensures the right candidate is taking the exam."
        },
        {
          icon: AlertTriangle,
          title: "Tab Switching Alerts",
          desc: "Immediate alerts when candidates switch tabs or leave exam window."
        },
        {
          icon: Bell,
          title: "Violation Warnings",
          desc: "Real-time warnings for suspicious behavior and multiple violation tracking."
        },
        {
          icon: Shield,
          title: "Auto Submission",
          desc: "Automatic exam submission after excessive violations or time expiry."
        }
      ].map((item, i) => (
        <div
          key={i}
          className="flex items-start gap-4 p-6 rounded-2xl
          bg-white dark:bg-white/5
          border border-slate-200 dark:border-white/10
          backdrop-blur-lg
          hover:shadow-xl transition"
        >
          {/* Icon */}
          <div className="w-12 h-12 rounded-xl
          bg-gradient-to-br from-indigo-500 to-teal-500
          flex items-center justify-center flex-shrink-0">
            <item.icon className="text-white w-6 h-6" />
          </div>

          {/* Text */}
          <div>
            <h3 className="text-lg font-semibold
            text-slate-900 dark:text-white mb-1">
              {item.title}
            </h3>

            <p className="text-slate-600 dark:text-slate-400">
              {item.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
</div>
  )
}

export default AiProctor