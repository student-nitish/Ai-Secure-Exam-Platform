import React, { useEffect, useState } from "react";
import { apiConnector } from "../../servicse/apiConnector";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const PendingEvaluations = () => {

  const [attempts, setAttempts] = useState([]);
  const navigate = useNavigate();

  const fetchAttempts = async () => {
    try {

      const res = await apiConnector(
        "GET",
        "/results/evaluations"
      );

      console.log("pending attempts", res.data);

      setAttempts(res.data.attempts);

    } catch (err) {
      toast.error("Failed to load evaluations");
    }
  };

  useEffect(() => {
    fetchAttempts();
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6">

      <h1 className="text-2xl font-bold mb-8">
        Pending Evaluations
      </h1>

      {attempts.length === 0 ? (
        <p className="text-gray-400">
          No pending evaluations
        </p>
      ) : (

        <div className="bg-[#0f172a] rounded-xl overflow-hidden">

          <table className="w-full">

            <thead className="bg-[#1e293b] text-gray-300">

              <tr>
                <th className="p-4 text-left">Student</th>
                <th className="p-4 text-left">Exam</th>
                <th className="p-4 text-left">Violations</th>
                <th className="p-4 text-left">Action</th>
              </tr>

            </thead>

            <tbody>

              {attempts.map((a) => (

                <tr
                  key={a._id}
                  className="border-t border-gray-700"
                >

                  <td className="p-4">
                    {a.student.name}
                  </td>

                  <td className="p-4">
                    {a.exam.title}
                  </td>

                  <td className="p-4">
                    {a.violations?.length || 0}
                  </td>

                  <td className="p-4">

                    <button
                      onClick={() =>
                        navigate(`/admin/evaluate/${a._id}`)
                      }
                      className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg"
                    >
                      Evaluate
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
};

export default PendingEvaluations;