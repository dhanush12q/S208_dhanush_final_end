import React from "react";
import { useNavigate } from "react-router-dom";
import "./Index.css";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="study-bg">
      <header className="study-navbar">
        <div className="study-logo">
          <span role="img" aria-label="logo">📚</span> Course Selection & Scheduling
        </div>
        <div className="study-nav-btns">
          <button className="signup" onClick={() => navigate("/register")}>Sign Up</button>
          <button className="login" onClick={() => navigate("/login")}>Log in</button>
        </div>
      </header>

      {/* Left-only content now */}
      <main className="study-hero single-column">
        <section className="left-cell">
          <h1 className="hero-title">Course Selection & Scheduling Platform</h1>

          <p className="hero-desc">
            Welcome to your smart solution for planning your academic journey!
            This intuitive platform empowers students to easily search and select
            courses, register for classes, and build conflict-free schedules
            for each semester. View all course offerings in one place, create
            your personalized timetable, and receive instant feedback on your
            selections. Designed for flexibility and ease-of-use, our system
            streamlines the entire course selection and scheduling process—
            helping you stay organized, make timely choices, and focus on your
            goals. Ready to start?
          </p>

          <div className="hero-actions">
            <button className="cta-btn" onClick={() => navigate("/courses")}>
              Browse Courses
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
