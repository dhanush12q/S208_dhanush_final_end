import React, { useEffect, useState } from "react";
import "./ScheduleBuilder.css";
import { useNavigate } from "react-router-dom";

export default function ScheduleBuilder() {
  const [courses, setCourses] = useState([]);
  const [selected, setSelected] = useState([]);
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

  const handleToggle = (code) => {
    setSelected(prev => (prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]));
  };

  const handleRemoveFromSchedule = (code) => {
    setSelected(prev => prev.filter(c => c !== code));
  };

  const getCourseName = (code) => {
    const c = courses.find(course => course.code === code);
    return c ? c.name : code;
  };

  const filtered = courses.filter(c =>
    (c.name || "").toLowerCase().includes(query.toLowerCase()) ||
    (c.code || "").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="sb-page">
      <header className="sb-header">
        <div className="sb-title">
          <h1>🗓️ Schedule Builder</h1>
          <p className="sb-sub">Select courses to add to your schedule — changes are immediate locally.</p>
        </div>

        <div className="sb-controls">
          <input
            className="sb-search"
            placeholder="Search by name or code..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            aria-label="Search courses"
          />
          <button className="dash-btn" onClick={() => navigate("/student-dashboard")}>⬅ Dashboard</button>
        </div>
      </header>

      <main className="sb-main">
        <section className="sb-panel">
          <h3>Available Courses</h3>

          {filtered.length ? (
            <div className="table-wrapper">
              <table className="sb-table" aria-label="Available courses">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Course Name</th>
                    <th>Course Code</th>
                    <th>Include</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((course, idx) => (
                    <tr key={course.code || idx}>
                      <td data-label="S.No">{idx + 1}</td>
                      <td data-label="Course Name">{course.name}</td>
                      <td data-label="Course Code">{course.code || "—"}</td>
                      <td data-label="Include">
                        <label className="checkbox-wrap">
                          <input
                            type="checkbox"
                            checked={selected.includes(course.code)}
                            onChange={() => handleToggle(course.code)}
                            aria-label={`Include ${course.name}`}
                          />
                          <span className="checkmark" />
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">No courses available.</div>
          )}
        </section>

        <section className="sb-panel">
          <h3>Your Schedule</h3>

          {selected.length ? (
            <div className="table-wrapper">
              <table className="sb-table small" aria-label="Your schedule">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Course Name</th>
                    <th>Course Code</th>
                    <th>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {selected.map((code, i) => (
                    <tr key={code}>
                      <td data-label="S.No">{i + 1}</td>
                      <td data-label="Course Name">{getCourseName(code)}</td>
                      <td data-label="Course Code">{code}</td>
                      <td data-label="Remove">
                        <button className="remove-small" onClick={() => handleRemoveFromSchedule(code)}>
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">No courses scheduled yet.</div>
          )}
        </section>
      </main>
    </div>
  );
}
