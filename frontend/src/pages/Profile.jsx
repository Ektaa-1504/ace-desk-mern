/**
 * ============================================
 * PROFILE PAGE - User Profile View
 * ============================================
 * Displays userData from Redux: name, email, role, photoUrl, description, enrolledCourses count
 * Protected route - only shown when userData exists (see App.jsx)
 */

import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeftLong } from "react-icons/fa6";

function Profile() {
  let {userData} = useSelector(state=>state.user)
  let navigate = useNavigate()
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] px-4 py-10 flex items-center justify-center ">
      
      <div className="bg-[var(--surface)] border border-[var(--border)] shadow-lg rounded-2xl p-8 max-w-xl w-full relative backdrop-blur-md">
        <FaArrowLeftLong  className='absolute top-[8%] left-[5%] w-[22px] h-[22px] cursor-pointer text-[var(--text)]' onClick={()=>navigate("/")}/>
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center">
          {userData.photoUrl ? <img
            src={userData?.photoUrl}
            alt=""
            className="w-24 h-24 rounded-full object-cover border-2 border-[var(--border)]"
          /> : <div className='w-24 h-24 rounded-full text-white flex items-center justify-center text-[30px] border-2 bg-black  border-white cursor-pointer'>
         {userData?.name.slice(0,1).toUpperCase()}
          </div>}
          <h2 className="text-2xl font-bold mt-4 text-[var(--text)]">{userData.name}</h2>
          <p className="text-sm text-[var(--muted)]">{userData.role}</p>
        </div>

        {/* Profile Info */}
        <div className="mt-6 space-y-4">
          <div className="text-sm">
            <span className="font-semibold text-[var(--muted)]">Email: </span>
            <span>{userData.email}</span>
          </div>

          <div className="text-sm">
            <span className="font-semibold text-[var(--muted)]">Bio: </span>
            <span>{userData.description}</span>
          </div>

          

          <div className="text-sm">
            <span className="font-semibold text-[var(--muted)]">Enrolled Courses: </span>
            <span>{userData.enrolledCourses.length}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-center gap-4">
          <button className="px-5 py-2 rounded bg-black hover:bg-gray-800 text-white active:bg-gray-900 cursor-pointer transition" onClick={()=>navigate("/editprofile")}>
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile
