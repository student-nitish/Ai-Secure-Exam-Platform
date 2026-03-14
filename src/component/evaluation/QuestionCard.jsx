import React from "react";

const QuestionCard = ({ ans, index, marks, setMarks }) => {
  const q = ans.question;

  const handleMarksChange = (value) => {
    setMarks((prev) => ({
      ...prev,
      [q._id]: value,
    }));
  };

 return (
  <div className="bg-[#0f172a] p-4 sm:p-6 rounded-xl">
    <p className="text-blue-400 mb-2 text-sm sm:text-base">
      Question {index + 1}
    </p>

    <h3 className="font-semibold mb-4 text-sm sm:text-base break-words">
      {q.questionText}
    </h3>

    {q.questionType === "mcq" && (
      <>
        <div
          className={`p-3 sm:p-4 rounded-lg border break-words ${
            ans.answer === q.correctAnswer
              ? "bg-green-500/10 border-green-500"
              : "bg-red-500/10 border-red-500"
          }`}
        >
          <p
            className={`font-semibold text-sm sm:text-base ${
              ans.answer === q.correctAnswer
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            Student Answer: {ans.answer}
          </p>
        </div>

        <p className="font-semibold text-blue-400 mt-2 text-sm sm:text-base break-words">
          Correct Answer: {q.correctAnswer}
        </p>
      </>
    )}

    {q.questionType === "subjective" && (
      <>
        <div className="bg-[#1e293b] p-3 sm:p-4 rounded-lg mb-4 text-sm sm:text-base break-words">
          {ans.answer}
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <input
            type="number"
            value={marks[q._id]}
            onChange={(e) => handleMarksChange(e.target.value)}
            className="bg-[#1e293b] px-3 py-2 rounded w-16 sm:w-20 text-sm sm:text-base"
          />
          <span className="text-gray-400 text-sm sm:text-base">
            / {q.marks}
          </span>
        </div>
      </>
    )}
  </div>
);
};

export default QuestionCard;
