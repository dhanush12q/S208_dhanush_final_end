import React, { useEffect, useState } from "react";
import "./Registration.css";
import { useNavigate } from "react-router-dom";

export default function Registration() {
  const [courses, setCourses] = useState([]);
  const [selectedCourseIndex, setSelectedCourseIndex] = useState("");
  const [registrations, setRegistrations] = useState([]);
  const navigate = useNavigate();
  const STORAGE_KEY = "studentRegistrations";

  // safe load from localStorage
  useEffect(() => {
    try {
      const data = localStorage.getItem("coursesList");
      if (data) setCourses(JSON.parse(data));
      else setCourses([]);

      const regData = localStorage.getItem(STORAGE_KEY);
      if (regData) {
        const parsed = JSON.parse(regData);
        if (Array.isArray(parsed)) setRegistrations(parsed);
        else setRegistrations([]);
      } else {
        setRegistrations([]);
      }
    } catch (err) {
      console.warn("Error reading localStorage:", err);
      setCourses([]);
      setRegistrations([]);
    }
  }, []);

  // helper to save immediately (call after calculating newRegistrations)
  const saveRegistrations = (newRegistrations) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newRegistrations));
    } catch (err) {
      console.warn("Could not save registrations:", err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedCourseIndex === "") {
      alert("⚠ Please select a course.");
      return;
    }

    const idx = Number(selectedCourseIndex);
    if (!Number.isFinite(idx) || !courses[idx]) {
      alert("⚠ Invalid course selection.");
      return;
    }

    const regCourse = {
      course: courses[idx].name,
      code: courses[idx].code || ""
    };

    // check duplicate
    if (registrations.find(r => r.code === regCourse.code && r.course === regCourse.course)) {
      alert("You already registered for this course.");
      return;
    }

    // compute new array, update state and persist immediately
    const newRegs = [...registrations, regCourse];
    setRegistrations(newRegs);
    saveRegistrations(newRegs);

    alert(`✅ Registered for ${regCourse.course}!`);
    setSelectedCourseIndex("");
  };

  const handleRemove = (code) => {
    if (!window.confirm("Remove this registration?")) return;
    const newRegs = registrations.filter(r => r.code !== code);
    setRegistrations(newRegs);
    saveRegistrations(newRegs);
  };

  return (
    <div className="reg-page">
      <header className="reg-header">
        <div className="reg-title">
          <h1>📘 Course Registration</h1>
          <p className="reg-sub">Select a course to register. Your registrations are saved locally.</p>
        </div>

        <div className="reg-actions">
          <button className="dash-btn" onClick={() => navigate("/student-dashboard")}>⬅ Dashboard</button>
        </div>
      </header>

      <main className="reg-main">
        <section className="reg-panel">
          <h2 className="panel-title">Register for a Course</h2>

          <form className="reg-form" onSubmit={handleSubmit} aria-label="Course registration form">
            <table className="form-table">
              <tbody>
                <tr>
                  <th>
                    <label htmlFor="course-select">Select Course</label>
                  </th>
                  <td>
                    <select
                      id="course-select"
                      value={selectedCourseIndex}
                      onChange={e => setSelectedCourseIndex(e.target.value)}
                      aria-required="true"
                    >
                      <option value="">-- Select a Course --</option>
                      {courses.map((course, idx) => (
                        <option value={idx} key={course.code || idx}>
                          {course.name} {course.code ? `(${course.code})` : ""}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>

                <tr>
                  <th />
                  <td className="form-actions-td">
                    <button className="btn primary-btn" type="submit">Register</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </section>

        <section className="reg-panel">
          <h2 className="panel-title">Your Registered Courses</h2>

          {registrations.length ? (
            <div className="table-wrapper">
              <table className="reg-table" aria-label="Registered courses">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Course Name</th>
                    <th>Course Code</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((r, i) => (
                    <tr key={`${r.code}-${i}`}>
                      <td data-label="S.No">{i + 1}</td>
                      <td data-label="Course Name">{r.course}</td>
                      <td data-label="Course Code">{r.code || "—"}</td>
                      <td data-label="Action">
                        <button className="remove-small" onClick={() => handleRemove(r.code)}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">You haven't registered for any courses yet.</div>
          )}
        </section>
      </main>
    </div>
  );
}
