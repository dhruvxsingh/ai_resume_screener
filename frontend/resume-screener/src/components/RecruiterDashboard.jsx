import { useState, useEffect } from "react";
import axios from "axios";

function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [newJobTitle, setNewJobTitle] = useState("");
  const [newJobDesc, setNewJobDesc] = useState("");
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get("http://localhost:8000/jobs/");
      setJobs(res.data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  const handleNewJobSubmit = async (e) => {
    e.preventDefault();
    if (!newJobTitle || !newJobDesc) {
      alert("Please fill both title and description.");
      return;
    }

    try {
      await axios.post("http://localhost:8000/jobs/", {
        title: newJobTitle,
        description: newJobDesc,
      });
      setNewJobTitle("");
      setNewJobDesc("");
      fetchJobs();
    } catch (err) {
      console.error("Error adding job:", err);
    }
  };

  const handleJobSelect = async (jobId) => {
    setSelectedJobId(jobId);
    try {
      // Replace this URL with your actual API to get candidates by job ID
      const res = await axios.get(`http://localhost:8000/jobs/${jobId}/candidates/`);
      setCandidates(res.data);
    } catch (err) {
      console.error("Error fetching candidates:", err);
      setCandidates([]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4">Recruiter Dashboard</h2>

      <form onSubmit={handleNewJobSubmit} className="space-y-4 bg-white p-4 rounded shadow mb-6">
        <input
          type="text"
          placeholder="Job Title"
          value={newJobTitle}
          onChange={(e) => setNewJobTitle(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <textarea
          placeholder="Job Description"
          value={newJobDesc}
          onChange={(e) => setNewJobDesc(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">
          Add New Job
        </button>
      </form>

      <h3 className="text-2xl font-semibold mb-2">Existing Jobs</h3>
      <ul className="bg-gray-700 rounded p-4 space-y-2 max-h-64 overflow-y-auto">
        {jobs.map((job) => (
          <li
            key={job.id}
            className={`p-2 cursor-pointer ${selectedJobId === job.id ? "bg-blue-500": "hover:bg-blue-300"}`}
            onClick={() => handleJobSelect(job.id)}
          >
            {job.title}
          </li>
        ))}
      </ul>

      {selectedJobId && (
        <div className="mt-4 bg-gray-500 p-4 rounded shadow">
          <h3 className="text-lg font-semibold">
            Candidates for "{jobs.find((j) => j.id === selectedJobId)?.title}"
          </h3>
          {candidates.length > 0 ? (
            <ul className="space-y-2">
              {candidates.map((candidate) => (
                <li key={candidate.id} className="border p-2 rounded">
                  <p>
                    <strong>Name:</strong> {candidate.name}
                  </p>
                  <p>
                    <strong>Score:</strong> {candidate.match_score}%
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No candidates applied yet.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default RecruiterDashboard;
