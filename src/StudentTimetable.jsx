import React, { useEffect, useState, useMemo } from "react";
import "./Timetable.css";
import { useNavigate } from "react-router-dom";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function generateTimes(startHour = 9, endHour = 17, endMinute = 30, stepMinutes = 30) {
  const times = [];
  let hour = startHour;
  let minute = 0;
  while (hour < endHour || (hour === endHour && minute <= endMinute)) {
    const hh = String(hour).padStart(2, "0");
    const mm = String(minute).padStart(2, "0");
    times.push(`${hh}:${mm}`);
    minute += stepMinutes;
    if (minute >= 60) {
      minute = minute - 60;
      hour += 1;
    }
  }
  return times;
}

export default function StudentTimetable() {
  const navigate = useNavigate();
  const TIMES = useMemo(() => generateTimes(9, 17, 30, 30), []);
  const [courses, setCourses] = useState([]);
  const [timetable, setTimetable] = useState({});
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    try {
      const c = JSON.parse(localStorage.getItem("coursesList") || "[]");
      setCourses(Array.isArray(c) ? c : []);
    } catch (err) {
      console.warn("Could not load courses:", err);
      setCourses([]);
    }

    try {
      const t = JSON.parse(localStorage.getItem("adminTimetable") || "{}");
      setTimetable(t && typeof t === "object" ? t : {});
    } catch (err) {
      console.warn("Could not load timetable:", err);
      setTimetable({});
    }

    try {
      const r = JSON.parse(localStorage.getItem("studentRegistrations") || "[]");
      // store only codes for quick check
      setRegistrations(Array.isArray(r) ? r.map(item => item.code).filter(Boolean) : []);
    } catch (err) {
      setRegistrations([]);
    }
  }, []);

  const findCourseName = code => {
    const course = courses.find(c => c.code === code);
    return course ? course.name : "";
  };

  return (
    <div className="timetable-page enhanced">
      <header className="header">
        <h1>🗂️ Your Timetable</h1>
        <div className="header-actions">
          <button className="btn secondary" onClick={() => navigate("/student-dashboard")}>⬅ Back to Dashboard</button>
        </div>
      </header>

      <main>
        <div className="timetable-wrapper">
          <div className="table-scroll">
            <table className="timetable-table enhanced-table" role="grid" aria-label="Student timetable">
              <thead>
                <tr>
                  <th className="sticky-col first-col">Day / Time</th>
                  {TIMES.map(time => (
                    <th key={time}>{time}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {DAYS.map(day => (
                  <tr key={day}>
                    <td className="sticky-col daycell">{day}</td>
                    {TIMES.map(time => {
                      const code = (timetable[day] && timetable[day][time]) || "";
                      const show = code && registrations.includes(code);
                      return (
                        <td key={time}>
                          {show ? (
                            <>
                              <div className="cell-course">{findCourseName(code)}</div>
                              <div className="cell-code">({code})</div>
                            </>
                          ) : (
                            <span className="cell-empty" aria-hidden>—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
