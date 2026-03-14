import { FileCheck, Eye, TrendingUp } from "lucide-react";
import React from 'react'

const howitWork = () => {
  return (
    <div>{/* HOW IT WORKS SECTION */}
<section id="How It Works" className="py-20 px-4 sm:px-6 lg:px-8
bg-gradient-to-br
from-slate-50 via-white to-slate-100
dark:from-[#020617] dark:via-[#0f172a] dark:to-[#01283e]">

  <div className="max-w-7xl mx-auto">

    {/* Heading */}
    <div className="text-center mb-16">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl
      font-semibold text-slate-900 dark:text-white mb-4">
        How It Works
      </h2>

      <p className="text-slate-600 dark:text-slate-400">
        Three simple steps to conduct secure AI-proctored examinations
      </p>
    </div>

    {/* Timeline Cards */}
    <div className="relative grid md:grid-cols-2 lg:grid-cols-3 gap-8">

      {/* Timeline line desktop */}
      <div className="hidden lg:block absolute
      top-1/2 left-0 right-0 h-[2px]
      bg-gradient-to-r from-indigo-500 via-teal-500 to-green-500
      opacity-20 -translate-y-1/2" />

      {[
        {
          step: "01",
          icon: FileCheck,
          title: "Admin Creates Exam",
          desc: "Set up questions, configure proctoring rules, and schedule exams with advanced settings."
        },
        {
          step: "02",
          icon: Eye,
          title: "Students Attempt with AI Monitoring",
          desc: "Real-time face detection, tab monitoring, and violation tracking throughout the exam."
        },
        {
          step: "03",
          icon: TrendingUp,
          title: "AI Evaluates & Generates Analytics",
          desc: "Instant evaluation, detailed analytics, and comprehensive performance reports."
        }
      ].map((item, i) => (
        <div
          key={i}
          className="relative z-10 p-8 rounded-2xl
          bg-white dark:bg-white/5
          border border-slate-200 dark:border-white/10
          backdrop-blur-lg
          hover:shadow-xl transition"
        >

          {/* Step number */}
          <div className="flex justify-between items-center mb-6">

            <div className="text-5xl font-bold
            bg-gradient-to-r from-indigo-500 to-teal-400
            bg-clip-text text-transparent opacity-40">
              {item.step}
            </div>

            <div className="w-12 h-12 rounded-xl
            bg-gradient-to-br from-indigo-500 to-teal-500
            flex items-center justify-center">
              <item.icon className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold
          text-slate-900 dark:text-white mb-3">
            {item.title}
          </h3>

          {/* Description */}
          <p className="text-slate-600 dark:text-slate-400">
            {item.desc}
          </p>

        </div>
      ))}
    </div>
  </div>
</section>
</div>
  )
}

export default howitWork