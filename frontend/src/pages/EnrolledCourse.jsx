/**
 * ============================================
 * ENROLLED COURSES - My Purchased Courses
 * ============================================
 * Shows userData.enrolledCourses from Redux
 * Each course has "Watch Now" → /viewlecture/:courseId
 */

import React  from 'react'

import { useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
import { FaArrowLeftLong } from "react-icons/fa6";

function EnrolledCourse() {
  const navigate = useNavigate()

  const { userData } = useSelector((state) => state.user);

     
   
 

  return (
    <div className="min-h-screen w-full px-4 py-16 bg-[var(--bg)] flex flex-col items-center text-[var(--text)]">
      <div className="w-full max-w-5xl">
        <FaArrowLeftLong  className='w-[22px] h-[22px] cursor-pointer mb-4 text-[var(--text)]' onClick={()=>navigate("/")}/>
        <h1 className="text-3xl text-center font-bold text-[var(--text)] mb-8">
          My Enrolled Courses
        </h1>

        {userData.enrolledCourses.length === 0 ? (
          <p className="text-[var(--muted)] text-center w-full">You haven’t enrolled in any course yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userData.enrolledCourses.map((course) => (
              <div
                key={course._id}
                className="bg-[var(--surface)] rounded-2xl shadow-md overflow-hidden border border-[var(--border)]"
              >
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-[var(--text)]">{course.title}</h2>
                  <p className="text-sm text-[var(--muted)] mb-1">{course.category}</p>
                  <p className="text-xs text-[var(--faint)] uppercase tracking-wide">{course.level}</p>
                  <h1 className='mt-4 px-[10px] text-center py-[10px] border-2 bg-black border-black text-white rounded-[10px] text-[15px] font-light flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-600' onClick={()=>navigate(`/viewlecture/${course._id}`)}>Watch Now</h1>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default EnrolledCourse
