import { useEffect, useState } from "react";
import { apiConnector } from "../../servicse/apiConnector";
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner';

export default function AdminExams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ================= FETCH EXAMS =================
  const fetchExams = async () => {
    try {
      setLoading(true);

      const res = await apiConnector(
        "GET",
        "/exams/admin-exams"
      );
      console.log("all",res.data);

      setExams(res.data.exams);

    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch exams");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  // ================= PUBLISH EXAM =================
  const publishExam = async (examId) => {
    
    try {
      toast.loading("Publishing exam...", { id: "publish" });

      await apiConnector(
        "PUT",
        "/exams/publish",
         {examId}
      );

      toast.success("Exam published ✅", {
        id: "publish",
      });

      fetchExams();

    } catch (err) {
      toast.error("Publish failed", { id: "publish" });
    }
  };

  return (
    <div className="p-4 bg-[#020617] min-h-screen text-white">
      <h1 className="text-3xl pl-6 font-bold mb-8">
        All Exams 
      </h1>

      {loading ? (
        <p>Loading exams...</p>
      ) : exams.length === 0 ? (
        <p>No exams created yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  {exams.map((exam) => (
    <div
      key={exam._id}
      className="bg-[#0f172a] rounded-xl overflow-hidden
      shadow-lg hover:shadow-xl transition
      border border-white/10"
    >
      {/* Thumbnail */}
      <img
        src={
          exam.examThumbnail ||
          "https://via.placeholder.com/400x200?text=Exam"
        }
        alt="Exam"
        className="w-full h-40 object-cover"
      />

      {/* Card Body */}
      <div className="p-5 space-y-3">
        <h2 className="text-lg font-semibold text-white">
          {exam.title}
        </h2>

        <p className="text-gray-400 text-sm">
          Duration: {exam.duration} mins
        </p>

        {/* Status Badge */}
        <span
          className={`inline-block px-3 py-1 text-xs rounded-full
          ${
            exam.status === "published"
              ? "bg-green-500/20 text-green-400"
              : "bg-yellow-500/20 text-yellow-400"
          }`}
        >
          {exam.status}
        </span>

        {/* Actions */}
        <div className="flex gap-2 pt-3">
          <button
            onClick={() =>
              navigate(`/admin/edit-exam/${exam._id}`)
            }
            className="flex-1 bg-blue-600 py-2 rounded-lg text-sm hover:bg-blue-500"
          >
            Edit
          </button>

          <button
            onClick={() =>
              navigate(`/admin/exam/${exam._id}/questions`)
            }
            className="flex-1 bg-purple-600 py-2 rounded-lg text-sm hover:bg-purple-500"
          >
            Add Questions
          </button>

          {exam.status === "draft" && (
            <button
              onClick={() => publishExam(exam._id)}
              className="flex-1 bg-green-600 py-2 rounded-lg text-sm hover:bg-green-500"
            >
              Publish
            </button>
          )}
        </div>
      </div>
    </div>
  ))}
</div>

      )}
    </div>
  );
}
