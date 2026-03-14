import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiConnector } from "../../servicse/apiConnector";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function EditExam() {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [exam, setExam] = useState({
    title: "",
    description: "",
    duration: "",
    startDate: "",
    endDate: "",
    passingMarks: "",
    thumbnail: null,
  });

  // ⭐ Fetch exam details
  useEffect(() => {
    fetchExam();
  }, []);

  const fetchExam = async () => {
    try {
      setLoading(true);

      const res = await apiConnector(
        "GET",
        `/exams/${examId}`
      );

      const data = res.data.exam;

      setExam({
        ...data,
        startDate: data.startDate?.slice(0, 16),
        endDate: data.endDate?.slice(0, 16),
      });

    } catch (err) {
      console.error(err);
      toast.error("Failed to load exam");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setExam({
      ...exam,
      [name]: files ? files[0] : value,
    });
  };

  // ⭐ Update exam
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      Object.entries(exam).forEach(([key, value]) => {
        formData.append(key, value);
      });

      await apiConnector(
        "PUT",
        `/exams/update/${examId}`,
        formData
      );

      toast.success("Exam updated successfully");

      navigate("/admin/all/exams");

    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-[#020617] min-h-screen text-white">
     <button onClick={()=> navigate("/admin/all/exams")} className= " items-center justify-center flex gap-1.5 text-center mb-5 ml-2 bg-gray-800 rounded-3xl w-20 font-semibold">
        <ArrowLeft size={18}/>
        Back
      </button>
      <h1 className="text-3xl font-bold mb-8">
        Edit Exam
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl space-y-6"
      >
        {/* Title */}
        <input
          name="title"
          value={exam.title}
          onChange={handleChange}
          placeholder="Exam Title"
          className="input"
          required
        />

        {/* Description */}
        <textarea
          name="description"
          value={exam.description}
          onChange={handleChange}
          placeholder="Description"
          className="input"
        />

        {/* Duration */}
        <input
          type="number"
          name="duration"
          value={exam.duration}
          onChange={handleChange}
          placeholder="Duration (mins)"
          className="input"
        />

        {/* Dates */}
        <input
          type="datetime-local"
          name="startDate"
          value={exam.startDate}
          onChange={handleChange}
          className="input"
        />

        <input
          type="datetime-local"
          name="endDate"
          value={exam.endDate}
          onChange={handleChange}
          className="input"
        />

        {/* Passing Marks */}
        <input
          type="number"
          name="passingMarks"
          value={exam.passingMarks}
          onChange={handleChange}
          placeholder="Passing Marks"
          className="input"
        />

        {/* Thumbnail */}
        <input
          type="file"
          name="thumbnail"
          onChange={handleChange}
          className="input"
        />

        <button
          disabled={loading}
          className="bg-yellow-500 text-black px-6 py-3 rounded-lg"
        >
          {loading ? "Updating..." : "Update Exam"}
        </button>
      </form>
    </div>
  );
}
