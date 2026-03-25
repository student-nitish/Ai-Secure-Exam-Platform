import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiConnector } from "../../servicse/apiConnector";
import { toast } from "sonner";

export default function CreateExam() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    duration: "",
    startDate: "",
    endDate: "",
    passingMarks: "",
    thumbnail: null,
    maxAttempt:""
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setForm({ ...form, [name]: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) =>
        formData.append(k, v)
      );

      const response = await apiConnector(
        "POST",
        "/exams/create",
        formData
      );

      // console.log("after exam creation", response.data);

      const examId = response.data.exam._id;

      toast.success("Exam created successfully ✅");

      navigate(`/admin/exam/${examId}/questions`);
    } catch (err) {
      console.error(err);
      toast.error("Error creating exam");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex justify-center items-start p-6">
      <div className="w-full max-w-4xl">

        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold font-serif">
            Create Exam
          </h1>

          <button
            onClick={() => navigate(-1)}
            className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 shadow-lg">

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* Title */}
            <div>
              <label className="block mb-2 text-sm text-gray-300">
                Exam Title
              </label>

              <input
                name="title"
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>

            {/* Duration + Passing Marks */}
            <div className="grid md:grid-cols-3 gap-4">

              <div>
                <label className="block mb-2 text-sm text-gray-300">
                  Duration (Minutes)
                </label>

                <input
                  type="number"
                  name="duration"
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-gray-300">
                  Passing Marks (Optional)
                </label>

                <input
                  type="number"
                  name="passingMarks"
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

               <div>
                <label className="block mb-2 text-sm text-gray-300">
                  maxAttempt
                </label>

                <input
                  type="number"
                  name="maxAttempt"
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

            </div>

            {/* Start + End Date */}
            <div className="grid md:grid-cols-2 gap-6">

              <div>
                <label className="block mb-2 text-sm text-gray-300">
                  Start Date
                </label>

                <input
                  type="datetime-local"
                  name="startDate"
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-gray-300">
                  End Date
                </label>

                <input
                  type="datetime-local"
                  name="endDate"
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>

            </div>

            {/* Thumbnail Upload */}
            <div>
              <label className="block mb-2 text-sm text-gray-300">
                Exam Thumbnail
              </label>

              <input
                type="file"
                accept="image/*"
                name="thumbnail"
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2"
              />

              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  className="mt-4 w-48 rounded-lg border border-slate-700"
                />
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block mb-2 text-sm text-gray-300">
                Description
              </label>

              <textarea
                name="description"
                rows="4"
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-4">

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="bg-slate-700 hover:bg-slate-600 px-6 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                disabled={loading}
                className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-400 disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Exam"}
              </button>

            </div>

          </form>

        </div>
      </div>
    </div>
  );
}