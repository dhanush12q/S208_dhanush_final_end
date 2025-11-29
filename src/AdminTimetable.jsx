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

export default function AdminTimetable() {
  const navigate = useNavigate();
  const TIMES = useMemo(() => generateTimes(9, 17, 30, 30), []);
  const [courses, setCourses] = useState([]);
  const [timetable, setTimetable] = useState({});

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
  }, []);

  const handleChange = (day, time, code) => {
    setTimetable(prev => {
      const updated = { ...prev };
      if (!updated[day]) updated[day] = {};
      // store empty string as null-like
      updated[day][time] = code || "";
      try {
        localStorage.setItem("adminTimetable", JSON.stringify(updated));
      } catch (err) {
        console.warn("Could not save timetable:", err);
      }
      return updated;
    });
  };

  return (
    <div className="timetable-page enhanced">
      <header className="header">
        <h1>🗂️ Edit Master Timetable</h1>
        <div className="header-actions">
          <button className="btn secondary" onClick={() => navigate("/admin-dashboard")}>⬅ Admin Dashboard</button>
        </div>
      </header>

      <main>
        <div className="timetable-wrapper">
          <div className="table-scroll">
            <table className="timetable-table enhanced-table" role="grid" aria-label="Master timetable editor">
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
                      const value = (timetable[day] && timetable[day][time]) || "";
                      return (
                        <td key={time}>
                          <select
                            aria-label={`${day} ${time} select course`}
                            value={value}
                            onChange={e => handleChange(day, time, e.target.value)}
                          >
                            <option value="">— None —</option>
                            {courses.map(c => (
                              <option key={c.code} value={c.code}>
                                {c.name} {c.code ? `(${c.code})` : ""}
                              </option>
                            ))}
                          </select>
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
