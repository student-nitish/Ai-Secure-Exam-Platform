import React from 'react'
import { Shield,ArrowRight ,AlertTriangle } from "lucide-react";
import Feature from "../component/home/feature"
import HowitWork from '../component/home/howitWork';
import AiProctor from '../component/home/AiProctor';
import DashboardSection from '../component/home/dashboardSection';
import Footer from '../component/footer';
import { useNavigate } from 'react-router-dom';


const home = () => {
  const navigate=useNavigate();
  return (
    <div>
{/* HERO SECTION */}
<section
  className="relative pt-28 md:pt-32 pb-16 md:pb-24 px-4 sm:px-6 overflow-hidden
  bg-gradient-to-br
  from-slate-50 via-white to-slate-100
  dark:from-[#020617] dark:via-[#0f172a] dark:to-[#01283e]"
>

  {/* Glow background */}
  <div className="absolute top-10 md:top-20 left-5 md:left-10
  w-[300px] md:w-[500px] h-[300px] md:h-[500px]
  bg-indigo-500/10 blur-[100px] md:blur-[120px] rounded-full" />

  <div className="absolute bottom-10 md:bottom-20 right-5 md:right-10
  w-[300px] md:w-[500px] h-[300px] md:h-[500px]
  bg-teal-500/10 blur-[100px] md:blur-[120px] rounded-full" />

  <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">

    {/* LEFT SIDE */}
    <div>

      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2
      rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
        <Shield className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
        <span className="text-sm text-indigo-700 dark:text-indigo-300">
          AI-Powered Proctoring
        </span>
      </div>

      {/* Heading */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl
      font-semibold text-slate-900 dark:text-white
      leading-tight mb-6">
        Secure Online Exams with{" "}
        <span className="bg-gradient-to-r
        from-indigo-500 to-teal-400
        bg-clip-text text-transparent">
          AI Proctoring
        </span>
      </h1>

      {/* Subtext */}
      <p className="text-base sm:text-lg
      text-slate-600 dark:text-slate-300
      mb-8 max-w-lg">
        Prevent cheating, automate evaluation, and monitor exams
        in real-time with cutting-edge artificial intelligence
        technology.
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        <button
          onClick={() => navigate("/allexams")}
          className="px-8 py-4 rounded-xl
          bg-gradient-to-r from-indigo-600 to-teal-500
          text-white flex items-center justify-center gap-2
          hover:scale-105 transition"
        >
          Explore Exam <ArrowRight size={18} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
        {[
          { v: "50K+", l: "Exams Conducted" },
          { v: "99.9%", l: "Uptime" },
          { v: "500+", l: "Universities" },
          { v: "1M+", l: "Students" },
        ].map((s, i) => (
          <div key={i}>
            <div className="text-xl sm:text-2xl font-semibold
            bg-gradient-to-r from-indigo-500 to-teal-400
            bg-clip-text text-transparent">
              {s.v}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {s.l}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* RIGHT SIDE DASHBOARD MOCK */}
    <div className="relative mt-10 lg:mt-0">

      <div className="rounded-2xl border
      border-slate-200 dark:border-white/10
      bg-white/70 dark:bg-white/5
      backdrop-blur-xl p-6 shadow-2xl">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-3 items-center">
            <div className="w-10 h-10 rounded-full
            bg-gradient-to-br from-indigo-500 to-teal-500" />

            <div>
              <p className="text-slate-900 dark:text-white text-sm">
                Live Exam Session
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-xs">
                Mathematics Final
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2
          bg-teal-500/20 px-3 py-1 rounded-full text-xs
          text-teal-600 dark:text-teal-300">
            <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
            Active
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">

          <div className="p-4 rounded-xl border
          border-teal-400/20 bg-teal-500/10">
            <p className="text-xs text-teal-700 dark:text-teal-300 mb-1">
              Face Detected
            </p>
            <p className="text-teal-800 dark:text-teal-200 text-lg">
              Active
            </p>
          </div>

          <div className="p-4 rounded-xl border
          border-indigo-400/20 bg-indigo-500/10">
            <p className="text-xs text-indigo-700 dark:text-indigo-300 mb-1">
              Focus Status
            </p>
            <p className="text-indigo-800 dark:text-indigo-200 text-lg">
              Normal
            </p>
          </div>
        </div>

        {/* Activity bars */}
        <div className="bg-slate-100 dark:bg-black/30
        rounded-xl p-4 mb-4">
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
            Activity Timeline
          </p>

          <div className="flex gap-2 items-end h-20">
            {[40,60,50,75,55,80,65,70].map((h,i)=>(
              <div key={i}
                style={{height:`${h}%`}}
                className="flex-1 rounded-t
                bg-gradient-to-t
                from-indigo-500 to-teal-400 opacity-80"
              />
            ))}
          </div>
        </div>

        {/* Warning */}
        <div className="flex gap-3 p-3 rounded-xl
        border border-amber-400/20 bg-amber-500/10">
          <AlertTriangle className="text-amber-500" size={18}/>
          <div>
            <p className="text-amber-700 dark:text-amber-300 text-sm">
              0 Violations Detected
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400">
              All monitoring systems active
            </p>
          </div>
        </div>

      </div>
    </div>

  </div>
</section>

<Feature/>

<HowitWork/>

<AiProctor/>

<DashboardSection/>

<Footer/>
  
  

 


    </div>
  )
}

export default home