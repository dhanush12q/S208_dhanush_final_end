import React from "react";
import "./App.css";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();
  return (
    <div>
      <Header />
      <div className="dashboard-menu">
        <button onClick={() => navigate("/login")}>Login</button>
        <button onClick={() => navigate("/admin")}>Admin Dashboard</button>
        <button onClick={() => navigate("/student")}>Student Dashboard</button>
        <button onClick={() => navigate("/courses")}>Course List</button>
        <button onClick={() => navigate("/schedule-builder")}>Schedule Builder</button>
        <button onClick={() => navigate("/registration")}>Registration</button>
               <button onClick={() => navigate("/added-course-list")}>Added Course List</button>
        <button onClick={() => navigate("/removed-course-list")}>Removed Course List</button>
        <button onClick={() => navigate("/admin-timetable")}>Admin Timetable</button>
<button onClick={() => navigate("/student-timetable")}>Student Timetable</button>

      </div>
      <section className="welcome">
        <h2>Welcome!</h2>
        <p>Use the menu above to access each part of the course selection and scheduling system.</p>
      </section>
    </div>
  );
}
