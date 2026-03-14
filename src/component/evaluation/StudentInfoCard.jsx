import React from "react";

const StudentInfoCard = ({ attempt }) => {

 return (
  <div className="bg-[#0f172a] rounded-xl p-6 mb-6 flex flex-wrap md:flex-nowrap gap-6 justify-between">

    <div className="w-full sm:w-[45%] md:w-auto">
      <p className="text-gray-400 text-sm">Student Name</p>
      <p className="font-semibold">{attempt.student.name}</p>
    </div>

    <div className="w-full sm:w-[45%] md:w-auto">
      <p className="text-gray-400 text-sm">Email</p>
      <p>{attempt.student.email}</p>
    </div>

    <div className="w-full sm:w-[45%] md:w-auto">
      <p className="text-gray-400 text-sm">Exam Title</p>
      <p>{attempt.exam.title}</p>
    </div>

    <div className="w-full sm:w-[45%] md:w-auto">
      <p className="text-gray-400 text-sm">Attempt ID</p>
      <p>{attempt._id}</p>
    </div>

  </div>
);
};

export default StudentInfoCard;