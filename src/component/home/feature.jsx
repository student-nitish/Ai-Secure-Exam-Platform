import React from 'react'
import {
  Shield,
  Zap,
  Bell,
  BarChart3,
  Lock,
  FileCheck,
} from "lucide-react";


const feature = () => {
  return (
    <div>
        {/* FEATURES SECTION */}
<section id='feature' className=" py-20 px-4 sm:px-6 lg:px-8
bg-slate-50 dark:bg-[#0B1120]">

  <div className="max-w-7xl mx-auto">

    {/* Heading */}
    <div className="text-center mb-16">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl
      font-semibold text-slate-900 dark:text-white mb-4">
        Powerful Features
      </h2>

      <p className="text-slate-600 dark:text-slate-400
      max-w-2xl mx-auto">
        Everything you need to conduct secure, efficient,
        and transparent online examinations
      </p>
    </div>

    {/* Feature Cards */}
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

      {[
        {
          icon: Shield,
          title: "AI Proctoring",
          desc: "Real-time face detection, tab monitoring, and cheating prevention with advanced AI algorithms.",
          color: "from-indigo-500 to-purple-500"
        },
        {
          icon: Zap,
          title: "Auto Evaluation",
          desc: "Instant grading for MCQs and automated assessment with detailed performance analytics.",
          color: "from-cyan-500 to-teal-500"
        },
        {
          icon: Bell,
          title: "Real-time Alerts",
          desc: "Instant notifications for violations, tab switches, and suspicious activities during exams.",
          color: "from-amber-500 to-orange-500"
        },
        {
          icon: BarChart3,
          title: "Analytics Dashboard",
          desc: "Comprehensive insights on exam performance, cheating probability, and student analytics.",
          color: "from-emerald-500 to-green-500"
        },
        {
          icon: Lock,
          title: "Secure Authentication",
          desc: "End-to-end encryption, secure login systems, and role-based access control.",
          color: "from-indigo-500 to-blue-500"
        },
        {
          icon: FileCheck,
          title: "Exam Management",
          desc: "Easy exam creation, scheduling, question bank management, and result tracking.",
          color: "from-pink-500 to-rose-500"
        },
      ].map((feature, i) => (
        <div
          key={i}
          className="group p-8 rounded-2xl
          bg-white dark:bg-white/5
          border border-slate-200 dark:border-white/10
          backdrop-blur-lg
          hover:shadow-xl hover:-translate-y-1
          transition-all"
        >
          {/* Icon */}
          <div
            className={`w-14 h-14 rounded-xl mb-6
            bg-gradient-to-br ${feature.color}
            flex items-center justify-center
            group-hover:scale-110 transition`}
          >
            <feature.icon className="w-7 h-7 text-white" />
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold
          text-slate-900 dark:text-white mb-3">
            {feature.title}
          </h3>

          {/* Description */}
          <p className="text-slate-600 dark:text-slate-400">
            {feature.desc}
          </p>
        </div>
      ))}

    </div>
  </div>
</section>

    </div>
  )
}

export default feature