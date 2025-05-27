import React from "react";

function RecruiterDashboard() {
  // Dummy data; replace with fetched data from backend
  const jobDescriptions = [
    { id: 1, title: "Software Engineer", responses: 5 },
    { id: 2, title: "Data Analyst", responses: 3 },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4">Recruiter Dashboard</h2>
      {jobDescriptions.map((jd) => (
        <div key={jd.id} className="border p-4 rounded mb-4">
          <h3 className="font-semibold">{jd.title}</h3>
          <p>Responses: {jd.responses}</p>
        </div>
      ))}
    </div>
  );
}

export default RecruiterDashboard;
