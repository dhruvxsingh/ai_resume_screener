import React, { useState } from "react";
import axios from "axios";
import './index.css';


function App() {
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
    formData.append("resume", file);
    formData.append("job_description", jobDesc);

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
      <h1 className="text-4xl font-bold mb-6 text-center">AI Resume Screener</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded shadow-md">
        <div>
          <label className="block mb-2 font-semibold">Upload Resume (PDF)</label>
          <input type="file" accept=".pdf" onChange={handleFileChange} className="border border-gray-300 rounded px-3 py-2 w-full" />
        </div>

        <div>
          <label className="block mb-2 font-semibold">Job Description</label>
          <textarea
            rows={6}
            value={jobDesc}
            onChange={handleJDChange}
            placeholder="Paste the job description here"
            className="border border-gray-300 rounded px-3 py-2 w-full resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 font-semibold text-white rounded ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {loading ? "Processing..." : "Submit"}
        </button>
      </form>

      {result && (
        <div className="mt-8 p-6 bg-gray-50 rounded shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Results</h2>
          <p className="font-semibold mb-2">Match Score: {result.match_score}%</p>
          <h3 className="font-semibold mb-2">Parsed Resume:</h3>
          <pre className="bg-white p-4 rounded border border-gray-300 overflow-auto max-h-72 text-sm whitespace-pre-wrap">
            {JSON.stringify(result.parsed_resume, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default App;
