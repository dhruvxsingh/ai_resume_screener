import { useState } from "react";
import axios from "axios";

function CandidateDashboard() {
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleJDChange = (e) => setJobDesc(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !jobDesc) {
      alert("Please upload a resume and enter a job description.");
      return;
    }
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("jd", jobDesc);

    try {
      const res = await axios.post("http://localhost:8000/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
    } catch {
      alert("Failed to process. Is backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4">Candidate Dashboard</h2>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
        <input type="file" accept=".pdf" onChange={handleFileChange} className="border p-2 w-full rounded" />
        <textarea value={jobDesc} onChange={handleJDChange} placeholder="Paste Job Description" rows={4} className="border p-2 w-full rounded" />
        <button type="submit" disabled={loading} className={`w-full py-2 ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"} text-white rounded`}>
          {loading ? "Processing..." : "Submit Application"}
        </button>
      </form>

      {result && (
        <div className="mt-4 p-4 bg-gray-50 rounded shadow">
          <p><strong>Match Score:</strong> {result.match_score}%</p>
          <pre className="text-sm">{JSON.stringify(result.parsed_resume, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default CandidateDashboard;
