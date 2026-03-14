import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { apiConnector } from "../../servicse/apiConnector";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react"; 

export default function AddQuestions() {
  const { examId } = useParams();
  const navigate = useNavigate();

  /* ================= EXISTING QUESTIONS ================= */
  const [existingQuestions, setExistingQuestions] = useState([]);
  const [loadingExisting, setLoadingExisting] = useState(false);

  const fetchQuestions = async () => {
    try {
      setLoadingExisting(true);
      const res = await apiConnector(
        "GET",
        `/exams/${examId}/questions`
      );
      setExistingQuestions(res.data.questions || []);
    } catch (err) {
      console.error("Fetch questions error:", err);
    } finally {
      setLoadingExisting(false);
    }
  };

  useEffect(() => {
    if (examId) fetchQuestions();
  }, [examId]);

  const deleteQuestion = async (id) => {
    try {
      await apiConnector("DELETE", `/exams/questions/${id}`);
      toast.error("question deleted");
      fetchQuestions();
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  /* ================= NEW QUESTIONS STATE ================= */
  const [questions, setQuestions] = useState([
    {
      questionText: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      marks: 1,
      questionType: "mcq",
    },
  ]);

  const [aiTopic, setAiTopic] = useState("");
  const [aiCount, setAiCount] = useState(10);
  const [loading, setLoading] = useState(false);
   const [aiLoading, setaiLoading] = useState(false);
 

  const [currentPage, setCurrentPage] = useState(1);
   const questionsPerPage = 5; // change as needed

 

  /* ================= QUESTION HANDLING ================= */
  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, opIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[opIndex] = value;
    setQuestions(updated);
  };

  const handleTypeChange = (index, value) => {
    const updated = [...questions];
    updated[index].questionType = value;

    if (value === "subjective") {
      updated[index].options = [];
      updated[index].correctAnswer = "";
    } else {
      updated[index].options = ["", "", "", ""];
    }

    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        marks: 1,
        questionType: "mcq",
      },
    ]);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  /* ================= SAVE QUESTIONS ================= */
  const saveManualQuestions = async () => {
    try {
      setLoading(true);

      const formattedQuestions = questions.map((q) => ({
        questionText: q.questionText,
        options: q.questionType === "mcq" ? q.options : [],
        correctAnswer:
          q.questionType === "mcq" ? q.correctAnswer : "",
        marks: q.marks,
        questionType: q.questionType,
      }));

      await apiConnector("POST", "/exams/add-questions", {
        examId,
        questions: formattedQuestions,
      });

      toast.success("Questions added successfully");
      setQuestions([
        {
          questionText: "",
          options: ["", "", "", ""],
          correctAnswer: "",
          marks: 1,
          questionType: "mcq",
        },
      ]);

      fetchQuestions();
      navigate("/admin/all/exams");

    } catch (err) {
      console.error(err);
      alert("Error saving questions");
    } finally {
      setLoading(false);
    }
  };

  /* ================= AI GENERATION ================= */
  const generateAIQuestions = async () => {
    try {
      setaiLoading(true);

      const res = await apiConnector("POST", "/ai/generate-questions", {
        examId,
        topic: aiTopic,
        count: aiCount,
        type: "mcq",
      });
      console.log("after generaing",res.data);
      const formatted = res.data.questions.map((q) => ({
     questionText: q.questionText ?? "",
     options:
      Array.isArray(q.options) && q.options.length === 4
      ? q.options
      : ["", "", "", ""],
     correctAnswer:
      typeof q.correctAnswer === "string"
      ? q.correctAnswer
      : "",
     marks: 1,
      questionType:
      q.options && q.options.length ? "mcq" : "subjective",
       }));

       toast.success("Questions generated successfully! 🪄")
      setQuestions(formatted);
    } catch (err) {
      console.error(err);
      alert("AI generation failed");
    } finally {
      setaiLoading(false);
    }
  };

  const indexOfLast = currentPage * questionsPerPage;
  const indexOfFirst = indexOfLast - questionsPerPage;

const currentQuestions = existingQuestions.slice(
  indexOfFirst,
  indexOfLast
);

const totalPages = Math.ceil(
  existingQuestions.length / questionsPerPage
);


  return (
    <div className="p-8 bg-[#020617] min-h-screen text-white">
     <button onClick={()=> navigate("/admin/all/exams")} className= " items-center justify-center flex gap-1.5 text-center mb-5 ml-2 bg-gray-800 rounded-3xl w-20 font-semibold">
        <ArrowLeft size={18}/>
        Back
      </button>
      <h1 className="text-3xl font-bold mb-8">Manage Questions</h1>
     
      {/* EXISTING QUESTIONS */}
     <div className="mb-12">
  <h2 className="text-xl font-semibold mb-4">
    Existing Questions
  </h2>
  <h3>

  </h3>

  {loadingExisting && <p>Loading...</p>}

  {currentQuestions.map((q) => (
    <div
      key={q._id}
      className="bg-[#0f172a] p-4 rounded mb-4"
    >
      <p dangerouslySetInnerHTML={{ __html: q.questionText }} />

      <p className="text-sm text-gray-400">
        Type: {q.questionType} | Marks: {q.marks}
      </p>

      {q.questionType === "mcq" && (
        <ul className="mt-2 text-sm">
          {q.options.map((op, i) => (
            <li key={i}>• {op}</li>
          ))}
        </ul>
      )}

      <button
        onClick={() => deleteQuestion(q._id)}
        className="mt-3 bg-red-600 px-3 py-1 rounded"
      >
        Delete
      </button>
    </div>
  ))}

  {/* Pagination Controls */}
  <div className="flex gap-2 mt-6 justify-center">
    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage(currentPage - 1)}
      className="px-4 py-2 hover:text-amber-300 bg-gray-700 rounded disabled:opacity-50"
    >
      Prev
    </button>

    {[...Array(totalPages)].map((_, i) => (
      <button
        key={i}
        onClick={() => setCurrentPage(i + 1)}
        className={`px-4 py-2 rounded  ${
          currentPage === i + 1
            ? "bg-yellow-500 text-black"
            : "bg-gray-700"
        }`}
      >
        {i + 1}
      </button>
    ))}

    <button
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage(currentPage + 1)}
      className="px-4 py-2 bg-gray-700 hover:text-amber-300 rounded disabled:opacity-50"
    >
      Next
    </button>
  </div>
    </div>
 

      {/* AI SECTION */}
      <div className="mb-10 bg-[#0f172a] p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">
         🤖 AI Question Generator 
        </h2>

        <div className="flex gap-3">
          <input
            placeholder="Topic"
            value={aiTopic}
            onChange={(e) => setAiTopic(e.target.value)}
            className="input"
          />

          <input
            type="number"
            value={aiCount}
            onChange={(e) => setAiCount(e.target.value)}
            className="input w-24"
          />

          <button
            onClick={generateAIQuestions}
            disabled={loading}
            className="bg-purple-600 px-4 py-2 rounded"
          >
            { aiLoading?"Generating...":"Generate"}
          </button>
        </div>
      </div>

      {/* NEW QUESTIONS */}
      {questions.map((q, index) => (
        <div
          key={index}
          className="bg-[#0f172a] p-6 rounded-lg mb-6"
        >
          <div className="flex justify-between">
            <h3>Question {index + 1}</h3>
            <button
              onClick={() => removeQuestion(index)}
              className="text-red-400"
            >
              Remove
            </button>
          </div>

          <textarea
            placeholder="Question Text"
            value={q.questionText || ""}
            onChange={(e) =>
              handleQuestionChange(index, "questionText", e.target.value)
            }
            className="input mt-3"
          />

          <select
            value={q.questionType}
            onChange={(e) =>
              handleTypeChange(index, e.target.value)
            }
            className="input mt-3"
          >
            <option value="mcq">MCQ</option>
            <option value="subjective">Subjective</option>
          </select>

          {q.questionType === "mcq" && (
            <>
              {q.options.map((op, i) => (
                <input
                  key={i}
                  placeholder={`Option ${i + 1}`}
                  value={op || ""}
                  onChange={(e) =>
                    handleOptionChange(index, i, e.target.value)
                  }
                  className="input mt-2"
                />
              ))}

              <input
                placeholder="Correct Answer"
                value={q.correctAnswer || ""}
                onChange={(e) =>
                  handleQuestionChange(
                    index,
                    "correctAnswer",
                    e.target.value
                  )
                }
                className="input mt-2"
              />
            </>
          )}

          {q.questionType === "subjective" && (
            <p className="text-gray-400 mt-2">
              Subjective answer — student will type manually.
            </p>
          )}

          <input
            type="number"
            placeholder="Marks"
            value={q.marks}
            onChange={(e) =>
              handleQuestionChange(index, "marks", e.target.value)
            }
            className="input mt-2"
          />
        </div>
      ))}

      <button
        onClick={addQuestion}
        className="bg-green-600 px-6 py-3 rounded-lg mr-4"
      >
        + Add Question
      </button>

      <button
        onClick={saveManualQuestions}
        disabled={loading}
        className="bg-yellow-500 mt-5 md:mt-0 text-black px-6 py-3 rounded-lg"
      >
        {loading ? "Saving..." : "Save Questions"}
      </button>
    </div>
  );
}
