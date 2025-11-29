import React, { useEffect, useState } from "react";
import "./AddedCourseList.css";
import { useNavigate } from "react-router-dom";

export default function AddedCourseList() {
  const ADDED_KEY = "addedCourses";
  const [addedCourses, setAddedCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const arr = JSON.parse(localStorage.getItem(ADDED_KEY) || "[]");
    setAddedCourses(arr);
  }, []);

  return (
    <div className="added-courses-container">
      
      {/* Header with buttons */}
      <div className="added-header">
        <h2>Newly Added Course List</h2>

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

      {/* Table Section */}
      {addedCourses.length ? (
        <table className="added-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Course Name</th>
              <th>Course Code</th>
            </tr>
          </thead>
          <tbody>
            {addedCourses.map((c, index) => (
              <tr key={c.code}>
                <td>{index + 1}</td>
                <td>{c.name}</td>
                <td>{c.code}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-course">No new courses added.</p>
      )}
    </div>
  );
}
