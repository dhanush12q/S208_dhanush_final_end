import React, { useState, useEffect } from "react";
import "./StudentDashboard.css";
import { useNavigate, useLocation } from "react-router-dom";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const defaultItems = [
    { id: "home", label: "Home", icon: "🏠", route: "/" },
    { id: "courses", label: "Courses", icon: "📚", route: "/courses" },
    { id: "schedule", label: "Schedule Builder", icon: "🗓️", route: "/schedule-builder" },
    { id: "timetable", label: "Timetable", icon: "🕒", route: "/student-timetable" },
    { id: "register", label: "Register", icon: "📝", route: "/registration" },
    { id: "logout", label: "Logout", icon: "🚪", route: "/" },
  ];

  const [items] = useState(defaultItems);

  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem("studentSidebarCollapsed") === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "studentSidebarCollapsed") {
        setCollapsed(e.newValue === "true");
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggle = () => {
    setCollapsed((s) => {
      const next = !s;
      try { localStorage.setItem("studentSidebarCollapsed", next ? "true" : "false"); } catch{ }

      return next;
    });
  };

  // derive activeId from current location pathname (best-effort)
  const activeIdFromPath = () => {
    const p = location.pathname;
    if (p.startsWith("/courses")) return "courses";
    if (p.startsWith("/schedule-builder")) return "schedule";
    if (p.startsWith("/student-timetable")) return "timetable";
    if (p.startsWith("/registration")) return "register";
    if (p === "/") return "home";
    return null;
  };

  const activeId = activeIdFromPath();

  return (
    <div className="student-dashboard-wrap">
      <aside className={`student-sidebar ${collapsed ? "collapsed" : "expanded"}`} aria-label="Student navigation">
        <div className="sidebar-top">
          <div className="brand">
            <span className="brand-icon">🎓</span>
            {!collapsed && <span className="brand-text">Student</span>}
          </div>

          <button
            className="collapse-btn"
            onClick={toggle}
            aria-pressed={collapsed}
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? "➡️" : "⬅️"}
          </button>
        </div>

        <ul className="student-list">
          {items.map(it => (
            <li key={it.id} className={`student-item ${activeId === it.id ? "active" : ""}`}>
              <button
                className="item-btn"
                onClick={() => navigate(it.route)}
                title={it.label}
              >
                <span className="item-icon" aria-hidden>{it.icon}</span>
                {!collapsed && <span className="item-label">{it.label}</span>}
              </button>
            </li>
          ))}
        </ul>

        <div className="sidebar-foot">
          {!collapsed && <small className="hint">Quick links to student tools</small>}
        </div>
      </aside>

      <main className="student-main">
        <header className="student-header">
          <h1 className="page-title">Student Dashboard</h1>
        </header>

        <section className="student-content">
          {/* Home / explanation view. When user clicks other links they navigate away; keep Home content here */}
          <div className="home-card">
            <h2>Welcome to your Student Dashboard</h2>
            <p>
              This area gives you quick access to your courses, schedule builder, timetable, and registration.
              Use the list on the left to navigate between tools. The sidebar can be collapsed for more space.
            </p>

            <div className="home-features">
              <div className="feature">
                <div className="f-icon">📚</div>
                <div className="f-title">Courses</div>
                <div className="f-desc">Browse available courses and view details.</div>
              </div>

              <div className="feature">
                <div className="f-icon">🗓️</div>
                <div className="f-title">Schedule Builder</div>
                <div className="f-desc">Create and manage your weekly schedule.</div>
              </div>

              <div className="feature">
                <div className="f-icon">🕒</div>
                <div className="f-title">Timetable</div>
                <div className="f-desc">View your official timetable and timings.</div>
              </div>

              <div className="feature">
                <div className="f-icon">📝</div>
                <div className="f-title">Registration</div>
                <div className="f-desc">Register for courses and view registration status.</div>
              </div>
            </div>

            <p className="note">Tip: collapse the sidebar to focus on content. Your choice is saved locally.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
