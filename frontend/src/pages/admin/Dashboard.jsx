/**
 * ============================================
 * DASHBOARD - Educator Analytics
 * ============================================
 * Educator-only (route guarded in App.jsx by userData?.role === "educator")
 * Gets creatorCourseData from Redux - charts: lectures per course, enrolled students
 * totalEarnings = sum of (course.price * enrolledStudents) for each course
 */

import React from 'react'
import { useSelector } from "react-redux";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import img from "../../assets/empty.jpg"; // fallback photo
import { useNavigate } from 'react-router-dom';
import { FaArrowLeftLong } from "react-icons/fa6";
function Dashboard() {
  const navigate = useNavigate()
  const { userData } = useSelector((state) => state.user);
  const { creatorCourseData } = useSelector((state) => state.course);
  // update based on your store

  // Sample data - Replace with real API/course data
  const courseProgressData = creatorCourseData?.map(course => ({
    name: course.title.slice(0, 10) + "...",
    lectures: course.lectures.length || 0
  })) || [];

  const enrollData = creatorCourseData?.map(course => ({
    name: course.title.slice(0, 10) + "...",
    enrolled: course.enrolledStudents?.length || 0
  })) || [];

  const totalEarnings = creatorCourseData?.reduce((sum, course) => {
    const studentCount = course.enrolledStudents?.length || 0;
    const courseRevenue = course.price ? course.price * studentCount : 0;
    return sum + courseRevenue;
  }, 0) || 0;

  return (
    <div className="flex min-h-screen bg-[var(--bg)] text-[var(--text)] justify-center px-4">
      <div className="w-full max-w-6xl py-10 space-y-10">
        <FaArrowLeftLong className='w-[22px] h-[22px] cursor-pointer mb-4' onClick={() => navigate("/")} />
        {/* Welcome Section */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-md p-6 flex flex-col md:flex-row items-center gap-6 backdrop-blur-md">
          <img
            src={userData?.photoUrl || img}
            alt="Educator"
            className="w-28 h-28 rounded-full object-cover border-2 border-[var(--border)] shadow-md"
          />
          <div className="text-center md:text-left space-y-1">
            <h1 className="text-2xl font-bold text-[var(--text)]">
              Welcome, {userData?.name || "Educator"}
            </h1>
            <h1 className='text-xl font-semibold text-[var(--text)]'>Total Earning : <span className='font-light text-[var(--primary2)]'>₹{totalEarnings.toLocaleString()}</span>  </h1>
            <p className="text-[var(--muted)] text-sm">
              {userData?.description || "Start creating amazing courses for your students!"}
            </p>
            <h1 className='px-[14px] text-center py-[10px] border border-[var(--primary)] bg-[var(--primary)] text-white rounded-[999px] text-[15px] font-medium flex items-center justify-center gap-2 cursor-pointer hover:bg-[var(--primary2)] shadow-sm' onClick={() => navigate("/courses")}>Create Courses</h1>
          </div>
        </div>

        {/* Graphs Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Course Progress Chart */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-md p-6 backdrop-blur-md">
            <h2 className="text-lg font-semibold mb-4">Course Progress (Lectures)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={courseProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="lectures" fill="var(--primary)" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Enrolled Students Chart */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-md p-6 backdrop-blur-md">
            <h2 className="text-lg font-semibold mb-4">Student Enrollment</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={enrollData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="enrolled" fill="var(--primary2)" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
