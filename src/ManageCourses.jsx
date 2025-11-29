import React, { useState, useEffect } from "react";
import "./ManageCourses.css";
import { useNavigate } from "react-router-dom";

export default function ManageCourses() {
  const navigate = useNavigate();

  const LOCAL_KEY = "coursesList";
  const ADDED_KEY = "addedCourses";
  const REMOVED_KEY = "removedCourses";

  const loadCourses = () => {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) return JSON.parse(saved);
    return [{ name: "Math 101", code: "MATH101" }];
  };

  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [courses, setCourses] = useState(loadCourses);

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(courses));
  }, [courses]);

  // Sync added/removed for lists
  const addToLocalArray = (key, course) => {
    const arr = JSON.parse(localStorage.getItem(key) || "[]");
    arr.push(course);
    localStorage.setItem(key, JSON.stringify(arr));
  };
  const removeFromLocalArray = (key, courseCode) => {
    const arr = JSON.parse(localStorage.getItem(key) || "[]");
    const filtered = arr.filter(c => c.code !== courseCode);
    localStorage.setItem(key, JSON.stringify(filtered));
  };

  const handleAddCourse = () => {
    if (!courseName || !courseCode) return;
    const newCourse = { name: courseName.trim(), code: courseCode.trim() };

    // prevent exact-duplicate codes
    if (courses.some(c => c.code === newCourse.code)) {
      alert("A course with that code already exists.");
      return;
    }

    setCourses(prev => [...prev, newCourse]);
    addToLocalArray(ADDED_KEY, newCourse); // Add to added list
    removeFromLocalArray(REMOVED_KEY, newCourse.code); // Remove from removed list if exists
    setCourseName("");
    setCourseCode("");
  };

  const handleRemove = code => {
    const removedCourse = courses.find(c => c.code === code);
    if (!removedCourse) return;
    setCourses(prev => prev.filter(c => c.code !== code));
    addToLocalArray(REMOVED_KEY, removedCourse); // Add to removed list
    removeFromLocalArray(ADDED_KEY, code); // Remove from added list if exists
  };

  return (
    <div className="manage-courses">
      <div className="manage-header">
        <h2>Manage Courses</h2>
        <div>
          {/* Back to Admin (keeps existing behavior) */}
          <button className="btn back-btn" onClick={() => navigate("/admin-dashboard")}>← Back</button>

          {/* Admin Dashboard button */}
          <button
            className="btn back-btn"
            style={{ marginLeft: 10 }}
            onClick={() => navigate("/admin-dashboard")}
          >
            Admin Dashboard
          </button>
        </div>
      </div>

      <div className="courses-center">
        <form
          className="add-course-form"
          onSubmit={e => {
            e.preventDefault();
            handleAddCourse();
          }}
        >
          <input
            aria-label="Course Name"
            type="text"
            placeholder="Course Name"
            value={courseName}
            onChange={e => setCourseName(e.target.value)}
          />
          <input
            aria-label="Course Code"
            type="text"
            placeholder="Course Code"
            value={courseCode}
            onChange={e => setCourseCode(e.target.value)}
          />
          <button
            type="submit"
            className="btn add-btn"
          >
            Add Course
          </button>
        </form>

        <h3>Course List</h3>

        {courses.length ? (
          <div className="table-wrapper">
            <table className="courses-table" role="table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Course Name</th>
                  <th>Course Code</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c, index) => (
                  <tr key={c.code}>
                    <td>{index + 1}</td>
                    <td>{c.name}</td>
                    <td>{c.code}</td>
                    <td>
                      <button
                        className="btn remove-btn"
                        onClick={() => handleRemove(c.code)}
                        aria-label={`Remove ${c.name}`}
                        type="button"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-course">No courses available.</p>
        )}
      </div>
    </div>
  );
}
