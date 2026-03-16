import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiConnector } from "../servicse/apiConnector";
import { toast } from "sonner";
import FaceProctor from "../component/faceProctor";
import ExamInstructions from "../component/examInstruction";
import { useRef } from "react";

const MAX_VIOLATIONS = 5;

const StudentExam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const isSubmittingRef = useRef(false);
  const attemptIdRef = useRef(null);
  const hasStartedRef = useRef(false);
  const lastViolationRef = useRef({});
  const answersRef = useRef({});
  const violationsRef = useRef([]);

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [attemptId, setAttemptId] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [violations, setViolations] = useState(0);
  const [examStarted, setExamStarted] = useState(false);
  const [violationList, setViolationList] = useState([]);
  const [markedForReview, setMarkedForReview] = useState({});
  const [loading,setloading]=useState(false);

  /* ================= START EXAM ================= */

  useEffect(() => {
    if (examId && !hasStartedRef.current) {
      hasStartedRef.current = true;
      startAttempt();
    }
  }, [examId]);

  useEffect(() => {
    attemptIdRef.current = attemptId;
  }, [attemptId]);

  const startAttempt = async () => {
    try {
      const res = await apiConnector("POST", "/exams/start", { examId });

      setExam(res.data.exam);
      setQuestions(res.data.questions || []);
      setAttemptId(res.data.attemptId);

      setTimeLeft(res.data.exam.duration * 60);

      /* START FULLSCREEN */

      document.documentElement.requestFullscreen().catch(() => {
        toast.error("Fullscreen permission required for exam");
      });
    } catch (err) {
      toast.error("Failed to start exam");
    }
  };

  /* ================= TIMER ================= */

  useEffect(() => {
    if (!timeLeft) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);

          if (!isSubmittingRef.current) {
            handleSubmit();
          }

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = () => {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  /* ================= TAB SWITCH DETECTION ================= */

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setViolations((prev) => prev + 1);
        setViolationList((prev) => [...prev, "Tab switch detected"]);
        toast.warning("Tab switch detected!");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  /* ================= FULLSCREEN EXIT ================= */

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !isSubmittingRef.current) {
        toast.error("Fullscreen exited. Exam submitted!");
        handleSubmit();
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  /* ================= AUTO SUBMIT ON VIOLATIONS ================= */

  useEffect(() => {
    if (violations >= MAX_VIOLATIONS && !isSubmittingRef.current) {
      toast.error("Too many violations. Exam submitted!");

      handleSubmit();
    }
  }, [violations]);

  /* ================= DISABLE COPY / RIGHT CLICK ================= */

  useEffect(() => {
    const disableContextMenu = (e) => e.preventDefault();

    const disableKeys = (e) => {
      if (e.ctrlKey && (e.key === "c" || e.key === "v" || e.key === "x")) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", disableContextMenu);
    document.addEventListener("keydown", disableKeys);

    return () => {
      document.removeEventListener("contextmenu", disableContextMenu);
      document.removeEventListener("keydown", disableKeys);
    };
  }, []);

  /* ================= PROCTOR FLAG ================= */

  const handleViolation = (reason) => {
    const now = Date.now();
    const lastTime = lastViolationRef.current[reason] || 0;

    // Ignore duplicate within 4 seconds
    if (now - lastTime < 4000) return;

    lastViolationRef.current[reason] = now;

    // Increase violation counter
    setViolations((prev) => prev + 1);

    // Store violation reason
    setViolationList((prev) => {
      const updated = [...prev, reason];
      violationsRef.current = updated; // sync ref
      return updated;
    });
    // Show toast
    toast.warning(`Violation: ${reason}`);
  };
  /* ================= ANSWERS ================= */

  const handleAnswerSelect = (questionId, option) => {
    const updatedAnswers = {
      ...answersRef.current,
      [questionId]: option,
    };

    setAnswers(updatedAnswers);
    answersRef.current = updatedAnswers;

    // remove from review when answered
    setMarkedForReview((prev) => {
      const updated = { ...prev };
      delete updated[questionId];
      return updated;
    });
  };

  const handleClearResponse = () => {
    const questionId = questions[currentQuestionIndex]._id;

    const updatedAnswers = { ...answersRef.current };
    delete updatedAnswers[questionId];

    setAnswers(updatedAnswers);
    answersRef.current = updatedAnswers;
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    // prevent duplicate submissions
    if (isSubmittingRef.current) return;
    const currentAttemptId = attemptIdRef.current;

    if (!currentAttemptId) {
      console.log("Submit blocked: attemptId missing");
      return;
    }

    isSubmittingRef.current = true;
     setloading(true);

    try {
      const attempted = Object.keys(answersRef.current).length;
      const totalQuestions = questions.length;
     
      const res = await apiConnector("POST", "/exams/submit", {
        attemptId: currentAttemptId,
        answers: Object.entries(answersRef.current).map(([q, a]) => ({
          questionId: q,
          answer: a,
        })),
        violations: violationsRef.current,
      });

      toast.success("Exam submitted successfully");
      // exit fullscreen safely
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }

      navigate(`/exam-submitted/${currentAttemptId}`, {
        state: {
          summary: res.data.summary,
        },
      });
    } catch (error) {
      console.error(error);
      toast.error("Submission failed");
      isSubmittingRef.current = false;
    }
     finally {

    setloading(false);

  }
  };

  if (!questions.length) return null;
  if (!examStarted) {
    return <ExamInstructions startExam={() => setExamStarted(true)} />;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-[#020617] text-white mt-12">
      {/* ================= HEADER ================= */}

      <div className="flex justify-between items-center px-10 py-4 border-b border-gray-800">
        <div>
          <h1 className="text-lg font-semibold">Exam #{exam?.title}</h1>
          <p className="text-sm text-gray-400">
            {Object.keys(answers).length} / {questions.length} Answered
          </p>
        </div>

        <div className="bg-[#1e293b] px-5 py-2 rounded-xl text-blue-400 font-semibold">
          ⏳ {formatTime()}
        </div>

        <div className="bg-yellow-500/10 text-yellow-400 px-4 py-2 rounded-lg">
          ⚠ {violations} Violations
        </div>

        {/* SUBMIT BUTTON */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 transition px-5 py-2 rounded-xl font-semibold"
        >
        {loading?"Submitting":"Submit Exam"}
        </button>
      </div>

      {/* ================= MAIN LAYOUT ================= */}

      <div className="grid grid-cols-3 gap-6 p-8">
        {/* ================= QUESTION AREA ================= */}

        <div className="col-span-2 bg-[#0f172a] p-8 rounded-2xl min-h-[70vh]">
          <p className="text-blue-400 mb-2">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>

          <h2 className="text-xl font-semibold mb-6">
            {currentQuestion.questionText}
          </h2>

          {currentQuestion.questionType === "mcq" && (
            <div>
              {currentQuestion.options?.map((opt, i) => (
                <div
                  key={i}
                  onClick={() => handleAnswerSelect(currentQuestion._id, opt)}
                  className={`p-4 rounded-xl mb-3 cursor-pointer transition ${
                    answers[currentQuestion._id] === opt
                      ? "bg-blue-600"
                      : "bg-[#1e293b] hover:bg-[#334155]"
                  }`}
                >
                  {opt}
                </div>
              ))}
            </div>
          )}

          {/* ================= SUBJECTIVE QUESTIONS ================= */}

          {currentQuestion.questionType === "subjective" && (
            <div className="mt-4">
              <p className="text-sm text-yellow-400 mb-2">
                Subjective Question — Write your answer below
              </p>

              <textarea
                placeholder="Type your answer here..."
                value={answers[currentQuestion._id] || ""}
                onChange={(e) =>
                  handleAnswerSelect(currentQuestion._id, e.target.value)
                }
                className="w-full min-h-[140px] bg-[#1e293b] p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          )}

         <div className="flex flex-col gap-4 mt-10">

     {/* ROW 1 — NAVIGATION */}
     <div className="flex justify-between">
    <button
      disabled={currentQuestionIndex === 0}
      onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
      className="bg-gray-700 px-6 py-2 rounded-xl disabled:cursor-not-allowed"
    >
      Previous
    </button>

    <button
      onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
      disabled={currentQuestionIndex === questions.length - 1}
      className="bg-blue-600 px-7 py-3 rounded-xl disabled:cursor-not-allowed disabled:bg-gray-500"
    >
      Next
    </button>
  </div>

  {/* ROW 2 — ACTIONS */}
  <div className="flex justify-center gap-6 flex-wrap">
    <button
      onClick={() => {
        setMarkedForReview((prev) => ({
          ...prev,
          [questions[currentQuestionIndex]._id]:
            !prev[questions[currentQuestionIndex]._id],
        }));
      }}
      className="bg-yellow-500 text-black px-5 py-2 rounded-lg"
    >
      Mark for Review
    </button>

    <button
      onClick={handleClearResponse}
      disabled={currentQuestion.questionType === "subjective"}
      className="bg-red-500 px-5 py-2 rounded-xl disabled:cursor-not-allowed disabled:bg-gray-500"
    >
      Clear Response
    </button>

    <button
      onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
      disabled={currentQuestionIndex === questions.length - 1}
      className="bg-green-600 px-7 py-3 rounded-xl font-semibold disabled:cursor-not-allowed disabled:bg-gray-500"
    >
      Save & Next
    </button>
  </div>

        </div>


        </div>

        {/* ================= RIGHT PANEL ================= */}

        <div className="space-y-6">
          <div className="bg-[#0f172a] p-5 rounded-2xl">
            <h3 className="mb-4 font-semibold flex items-center gap-2">
              📷 Live Monitoring
            </h3>

            <div className="h-[200px] bg-black rounded-xl flex items-center justify-center">
              <FaceProctor onFlag={handleViolation} />
            </div>
          </div>

          {/* ================= QUESTION NAVIGATOR ================= */}

          <div className="bg-[#0f172a] p-5 rounded-2xl">
            <h3 className="mb-4 font-semibold">Question Navigator</h3>

            <div className="grid grid-cols-5 gap-3">
              {questions.map((q, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`p-3 rounded-lg ${
                    index === currentQuestionIndex
                      ? "bg-blue-600"
                      : answers[q._id]
                        ? "bg-green-600"
                        : markedForReview[q._id]
                          ? "bg-yellow-500"
                          : "bg-[#1e293b]"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-blue-600"></span>
              Current Question
            </div>

            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-green-600"></span>
              Answered
            </div>

            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-yellow-500"></span>
              Marked for Review
            </div>

            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-[#1e293b]"></span>
              Not Visited
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentExam;
