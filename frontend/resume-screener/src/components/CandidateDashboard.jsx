import { useState, useEffect } from "react";
import axios from "axios";

function CandidateDashboard() {
  const [jobs, setJobs] = useState([]);
  const [file, setFile] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch jobs from backend
  useEffect(() => {
    axios.get("http://localhost:8000/jobs/")
      .then(response => setJobs(response.data))
      .catch(error => console.error("Error fetching jobs:", error));
  }, []);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !selectedJob) {
      alert("Please select a job and upload a resume.");
      return;
    }
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("jd", selectedJob.description);
    formData.append("job_id", selectedJob.id);  // 🆕 Added job_id field

    try {
      const res = await axios.post("http://localhost:8000/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
    } catch (err) {
      console.error("Error during upload:", err);
      alert("Failed to process. Is backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4">Candidate Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map(job => (
          <div key={job.id} className="border p-4 rounded shadow">
            <h3 className="font-bold text-lg">{job.title}</h3>
            <p>{job.description}</p>
            <button 
              onClick={() => setSelectedJob(job)} 
              className={`mt-2 px-4 py-2 rounded ${selectedJob?.id === job.id ? "bg-blue-700 text-white" : "bg-blue-500 text-white"}`}>
              {selectedJob?.id === job.id ? "Selected" : "Select Job"}
            </button>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 bg-white p-4 rounded shadow">
        <input type="file" accept=".pdf" onChange={handleFileChange} className="border p-2 w-full rounded" />
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