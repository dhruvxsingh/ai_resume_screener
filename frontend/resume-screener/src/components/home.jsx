import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-6">
      <h1 className="text-4xl font-bold">Welcome to AI Resume Screener</h1>
      <Link to="/recruiter-login" className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">Recruiter Login</Link>
      <Link to="/candidate-login" className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700">Candidate Login</Link>
    </div>
  );
}

export default Home;
