const ExamInstructions = ({ startExam }) => {

  return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center">

      <div className="bg-[#0f172a] p-10 rounded-2xl max-w-xl w-full">

        <h1 className="text-2xl font-bold mb-6">
          Exam Instructions
        </h1>

        <ul className="space-y-3 text-gray-300 mb-8">

          <li>📷 Camera must remain ON during the exam</li>
          <li>🖥 Exam will run in FULLSCREEN mode</li>
          <li>⚠ Switching tabs will count as a violation</li>
          <li>👥 Multiple faces detected will be flagged</li>
          <li>🚫 Copy paste and right click are disabled</li>

        </ul>

        <button
          onClick={startExam}
          className="w-full bg-blue-600 py-3 rounded-xl hover:bg-blue-500"
        >
          Start Exam
        </button>

      </div>

    </div>
  );
};

export default ExamInstructions;