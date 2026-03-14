import {useParams} from "react-router-dom";
import {useEffect,useState} from "react";
import {apiConnector} from "../../servicse/apiConnector";
import ResultAnalytics from "./ResultAnalytics";

const ResultAnalysis = ()=>{

  const {attemptId} = useParams();
  const [attempt,setAttempt] = useState(null);

  const fetchAnalysis = async ()=>{

    const res = await apiConnector(
      "GET",
      `/exams/analysis/${attemptId}`
    );

    setAttempt(res.data.attempt);
  };

  useEffect(()=>{
    fetchAnalysis();
  },[]);

  if(!attempt) return null;

  return(

    <div className="p-6 text-white">

      <h1 className="text-2xl font-serif font-bold mb-6">
        {attempt.exam.title} Analysis
      </h1>

      <ResultAnalytics attempt={attempt} />

      <div className="space-y-6">

        {attempt.answers.map((ans,i)=>{

          const q = ans.question;

          return(
            <div key={q._id} className="bg-[#0f172a] p-6 rounded-xl">

              <p className="text-blue-400 mb-2">
                Question {i+1}
              </p>

              <h3>{q.questionText}</h3>

              <p className={
                ans.isCorrect
                ? "text-green-400"
                : "text-red-400"
              }>
                Student Answer: {ans.answer}
              </p>

              {q.questionType==="mcq" && (
                <p className="text-blue-300">
                  Correct Answer: {q.correctAnswer}
                </p>
              )}

              <p>
                Marks: {ans.marksObtained}/{q.marks}
              </p>

            </div>
          )

        })}

      </div>

    </div>
  );
};

export default ResultAnalysis;