import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiConnector } from "../../servicse/apiConnector";
import StudentInfoCard from "../../component/evaluation/StudentInfoCard";
import ViolationsPanel from "../../component/evaluation/ViolationsPanel";
import QuestionCard from "../../component/evaluation/QuestionCard";
import EvaluationFooter from "../../component/evaluation/EvaluationFooter";

const AdminEvaluateExam = () => {

  const { attemptId } = useParams();

  const [attempt,setAttempt] = useState(null);
  const [marks,setMarks] = useState({});

  const fetchAttempt = async () => {
    const res = await apiConnector(
      "GET",
      `/results/evaluation/${attemptId}`
    );

    setAttempt(res.data.attempt);
    // console.log("AFTER FETCHING",res.data.attempt);

    const initial = {};
    res.data.attempt.answers.forEach(a=>{
      initial[a.question._id] = a.marksObtained || 0;
    });

    setMarks(initial);
  };

  useEffect(()=>{
    fetchAttempt();
  },[]);

  if(!attempt) return null;

  return (
    <div className="min-h-screen bg-[#020617] text-white p-10">

      <h1 className="text-2xl font-bold mb-6">
        Exam Evaluation
      </h1>

      <StudentInfoCard attempt={attempt} />

      <ViolationsPanel violations={attempt.violations} />

      <div className="space-y-6 mt-6">
        {attempt.answers.map((ans,index)=>(
          <QuestionCard
            key={ans.question._id}
            ans={ans}
            index={index}
            marks={marks}
            setMarks={setMarks}
          />
        ))}
      </div>



      <EvaluationFooter
        attempt={attempt}
        marks={marks}
        />
      

    </div>

    
  );
  
};

export default AdminEvaluateExam;