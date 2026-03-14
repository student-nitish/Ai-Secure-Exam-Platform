import React from 'react'

const footer = () => {
  return (
    <div>
        <footer className="bg-[#020617] text-slate-300 py-14 px-6">

  <div className="max-w-7xl mx-auto">

    {/* Top Footer */}
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-15">

      {/* Brand */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl
          bg-gradient-to-br from-indigo-600 to-teal-500
          flex items-center justify-center text-white">
            🔒
          </div>

          <h3 className="text-xl font-semibold
          bg-gradient-to-r from-indigo-400 to-teal-400
          bg-clip-text text-transparent">
            ExamSecure AI
          </h3>
        </div>

        <p className="text-sm text-slate-400 mb-6">
          AI-powered examination platform for secure and efficient online assessments.
        </p>

        {/* Social Icons */}
        <div className="flex gap-3">
          {["F", "T", "L"].map((item, i) => (
            <div key={i}
              className="w-9 h-9 rounded-lg bg-slate-800
              hover:bg-slate-700 flex items-center justify-center
              cursor-pointer transition">
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Product */}
      <div>
        <h4 className="text-white mb-4 font-semibold">Product</h4>
        <ul className="space-y-2 text-sm">
          <li onClick={() => {
       document.getElementById("feature")?.scrollIntoView({
        behavior: "smooth"
       });
            }} className="hover:text-white cursor-pointer">Features</li>
          <li onClick={() => {
       document.getElementById("How It Works")?.scrollIntoView({
        behavior: "smooth"
       });
            }} className="hover:text-white cursor-pointer">How It Works</li>
          <li className="hover:text-white cursor-pointer">Analytics</li>
         
        </ul>
      </div>

    

      {/* Contact */}
      <div>
        <h4 className="text-white mb-4 font-semibold">Contact</h4>

        <ul className="space-y-3 text-sm">
          <li>support@examsecure.ai</li>
          <li>(+91) 6205576935</li>
          <li>IIIT Gothapatna Bbsr Odisha</li>
        </ul>
      </div>
    </div>

    {/* Bottom Bar */}
    <div className="border-t border-slate-800 mt-12 pt-6 text-center text-sm text-slate-400">
      © 2026 ExamSecure AI. All rights reserved. Built with AI-powered proctoring technology.
    </div>

  </div>
</footer>

    </div>
  )
}

export default footer