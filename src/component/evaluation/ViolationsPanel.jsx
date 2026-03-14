import React from "react";

const ViolationsPanel = ({ violations }) => {

  return (
  <div className="bg-[#1e1b1b] border border-red-500 rounded-xl p-4 sm:p-6 mb-6">

    <h2 className="text-red-400 font-semibold mb-4 text-lg sm:text-xl">
      Proctoring Violations
    </h2>

    {violations.length === 0 ? (
      <p className="text-gray-400 text-sm sm:text-base">No violations</p>
    ) : (
      violations.map((v, i) => (
        <div
          key={i}
          className="bg-[#2a1f1f] p-3 sm:p-4 rounded-lg mb-2 text-red-300 text-sm sm:text-base break-words"
        >
          {v}
        </div>
      ))
    )}

  </div>
);
};

export default ViolationsPanel;