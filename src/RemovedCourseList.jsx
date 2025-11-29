import React, { useEffect, useState } from "react";
import "./RemovedCourseList.css";
import { useNavigate } from "react-router-dom";

export default function RemovedCourseList() {
  const REMOVED_KEY = "removedCourses";
  const [removedCourses, setRemovedCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const arr = JSON.parse(localStorage.getItem(REMOVED_KEY) || "[]");
    setRemovedCourses(arr);
  }, []);

  return (
    <div className="removed-courses-container">

      {/* Header with Buttons */}
      <div className="removed-header">
        <h2>Removed Course List</h2>

        <div className="header-buttons">
          <button className="btn back-btn" onClick={() => navigate("/admin-dashboard")}>
            ← Back
          </button>

          <button
            className="btn back-btn"
            style={{ marginLeft: "10px" }}
            onClick={() => navigate("/admin-dashboard")}
          >
            Admin Dashboard
          </button>
        </div>
      </div>

      {/* Table */}
      {removedCourses.length ? (
        <table className="removed-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Course Name</th>
              <th>Course Code</th>
            </tr>
          </thead>
          <tbody>
            {removedCourses.map((c, index) => (
              <tr key={c.code}>
                <td>{index + 1}</td>
                <td>{c.name}</td>
                <td>{c.code}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-course">No courses removed.</p>
      )}
    </div>
  );
}
