import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./Index.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import Header from "./Header.jsx";
import AdminDashboard from "./AdminDashboard.jsx";
import StudentDashboard from "./StudentDashboard.jsx";
import CourseList from "./CourseList.jsx";
import ScheduleBuilder from "./ScheduleBuilder.jsx";
import Registration from "./Registration.jsx";
import ManageCourses from "./ManageCourses.jsx";
import AddedCourseList from "./AddedCourseList.jsx";
import RemovedCourseList from "./RemovedCourseList.jsx";
import AdminTimetable from "./AdminTimetable.jsx";
import StudentTimetable from "./StudentTimetable.jsx";


export default function Apple() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
<Route path="/student-dashboard" element={<StudentDashboard />} />

        <Route path="/courses" element={<CourseList />} />
        <Route path="/schedule-builder" element={<ScheduleBuilder />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/manage-courses" element={<ManageCourses />} />
      <Route path="/added-course-list" element={<AddedCourseList />} />
        <Route path="/removed-course-list" element={<RemovedCourseList />} />
        <Route path="/admin-timetable" element={<AdminTimetable />} />
<Route path="/student-timetable" element={<StudentTimetable />} />

      </Routes>
    </Router>
  );
}
