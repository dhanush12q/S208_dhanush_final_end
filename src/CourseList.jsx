import React, { useEffect, useState } from "react";
import "./CourseList.css";
import { useNavigate } from "react-router-dom";

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem("coursesList");
    if (data) {
      try {
        setCourses(JSON.parse(data));
      } catch (err) {
        console.warn("Could not parse coursesList:", err);
        setCourses([]);
      }
    } else {
      setCourses([]);
    }
  }, []);

  const filtered = courses.filter(c =>
    (c.name || "").toLowerCase().includes(query.toLowerCase()) ||
    (c.code || "").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="course-page">
      <header className="course-header">
        <div>
          <h1>📘 Available Courses</h1>
          <p className="subtitle">Browse courses offered — search by name or code.</p>
        </div>

        <div className="controls">
          <input
            aria-label="Search courses"
            className="search"
            placeholder="Search courses or code..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />

          {/* DASHBOARD BUTTON */}
          <button
            className="dash-btn"
            onClick={() => navigate("/student-dashboard")}
          >
            ⬅ Dashboard
          </button>
        </div>
      </header>

      <main className="course-main">
        {filtered.length ? (
          <div className="table-wrapper" role="region" aria-labelledby="courses-table">
            <table className="courses-table" id="courses-table">
              <thead>
                <tr>
                  <th scope="col">S.No</th>
                  <th scope="col">Course Name</th>
                  <th scope="col">Course Code</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((course, idx) => (
                  <tr key={course.code || idx}>
                    <td data-label="S.No">{idx + 1}</td>
                    <td data-label="Course Name">{course.name}</td>
                    <td data-label="Course Code">{course.code || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-card">
              <div className="empty-emoji">📭</div>
              <div className="empty-text">
                {courses.length ? "No courses match your search." : "No courses available."}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
