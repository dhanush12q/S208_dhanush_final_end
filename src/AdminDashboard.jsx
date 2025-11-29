import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();


  const defaultItems = [
    { id: "home", label: "Home", icon: "🏠", route: null },
    { id: "manage", label: "Manage Courses", icon: "🛠️", route: "/manage-courses" },
    { id: "added", label: "Newly Added Course List", icon: "➕", route: "/added-course-list" },
    { id: "removed", label: "Removed Course List", icon: "🗑️", route: "/removed-course-list" },
    { id: "timetable", label: "Admin Timetable", icon: "🗓️", route: "/admin-timetable" },
  ];

  const [sidebarItems, setSidebarItems] = useState(defaultItems);
  const [activeId, setActiveId] = useState("home");


  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem("adminSidebarCollapsed") === "true";
    } catch {
      return false;
    }
  });

 
  const toggleCollapsed = () => {
    setCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem("adminSidebarCollapsed", next ? "true" : "false");
      } catch (err) {
        console.warn("Could not persist sidebar state:", err);
      }
      return next;
    });
  };

  const handleClick = (item) => {
    setActiveId(item.id);
    if (item.route) navigate(item.route);
  };

 
  const moveUp = (index) => {
    if (index <= 0) return;
    setSidebarItems(prev => {
      const arr = [...prev];
      [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
      return arr;
    });
  };
  const moveDown = (index) => {
    setSidebarItems(prev => {
      if (index >= prev.length - 1) return prev;
      const arr = [...prev];
      [arr[index + 1], arr[index]] = [arr[index], arr[index + 1]];
      return arr;
    });
  };

 
  useEffect(() => {
    
  }, []);


  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "adminSidebarCollapsed") {
        setCollapsed(e.newValue === "true");
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <div className="admin-dashboard-wrap">
      <aside className={`admin-sidebar ${collapsed ? "collapsed" : "expanded"}`} aria-label="Admin navigation">
        <div className="sidebar-top">
          <div className="brand">
            <span className="brand-icon" aria-hidden>🧭</span>
            {!collapsed && <span className="brand-text">Admin Panel</span>}
          </div>

          <button
            className="collapse-btn"
            onClick={toggleCollapsed}
            aria-pressed={collapsed}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? "➡️" : "⬅️"}
          </button>
        </div>

        <ul className="sidebar-list" role="menu">
          {sidebarItems.map((item, i) => (
            <li key={item.id} className={`sidebar-item ${activeId === item.id ? "active" : ""}`} role="none">
              <div className="item-left">
                <button
                  className="item-button"
                  onClick={() => handleClick(item)}
                  title={item.label}
                  role="menuitem"
                >
                  <span className="item-icon" aria-hidden>{item.icon}</span>
                  {!collapsed && <span className="item-label">{item.label}</span>}
                </button>
              </div>

              {!collapsed && (
                <div className="item-controls" aria-hidden>
                  <button className="small-btn" onClick={() => moveUp(i)} disabled={i === 0} title="Move up">▲</button>
                  <button className="small-btn" onClick={() => moveDown(i)} disabled={i === sidebarItems.length - 1} title="Move down">▼</button>
                </div>
              )}
            </li>
          ))}
        </ul>

        <div className="sidebar-foot">
          {!collapsed && <div className="hint">Tip: reorder using ▲ / ▼ — collapse to save space</div>}
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-header">
          <h2 className="admin-title">Admin Dashboard</h2>
          <div className="admin-actions">
            <button className="btn back-btn" onClick={() => navigate("/")}>← Home</button>
          </div>
        </div>

        <section className="admin-content">
          {activeId === "home" ? (
            <div className="home-card">
              <h3>About this Admin Page</h3>
              <p>
                This Admin Dashboard gives you quick access to admin tools:
              </p>
              <ul>
                <li><strong>Manage Courses</strong> — Add or remove courses (removed items will appear in the Removed Course List).</li>
                <li><strong>Newly Added Course List</strong> — Shows courses added during use (persisted to local storage).</li>
                <li><strong>Removed Course List</strong> — Shows courses that were removed.</li>
                <li><strong>Admin Timetable</strong> — Manage or view the master timetable.</li>
              </ul>

              <p className="note">
                Use the arrow on the sidebar to collapse it (saves state). Reorder items using ▲ / ▼. Clicking a list item will navigate if that item has a route.
              </p>
            </div>
          ) : (
            <div className="placeholder-card">
              <h3>{sidebarItems.find(it => it.id === activeId)?.label}</h3>
              <p>
                You selected <strong>{sidebarItems.find(it => it.id === activeId)?.label}</strong>.
                If this item has a route configured, clicking it will navigate you there.
              </p>
              <p className="muted">Route: {sidebarItems.find(it => it.id === activeId)?.route || "—"}</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
