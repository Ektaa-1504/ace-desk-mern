/**
 * ============================================
 * APP.JSX - Main Router & Layout
 * ============================================
 * Defines all routes and runs global data-fetching hooks on every page load.
 * 
 * FLOW:
 * 1. useSelector gets userData from Redux - used for protected routes
 * 2. Custom hooks (getCurrentUser, getCouseData, etc.) run on mount - they fetch data and put it in Redux
 * 3. Routes check userData - if null, redirect to /signup; if educator, show dashboard routes
 */

import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import { ToastContainer} from 'react-toastify';
import ForgotPassword from './pages/ForgotPassword'
import getCurrentUser from './customHooks/getCurrentUser'
import { useSelector } from 'react-redux'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'
import Dashboard from './pages/admin/Dashboard'
import Courses from './pages/admin/Courses'
import AllCouses from './pages/AllCouses'
import AddCourses from './pages/admin/AddCourses'
import CreateCourse from './pages/admin/CreateCourse'
import CreateLecture from './pages/admin/CreateLecture'
import EditLecture from './pages/admin/EditLecture'

import getCouseData from './customHooks/getCouseData'
import ViewCourse from './pages/ViewCourse'
import ScrollToTop from './components/ScrollToTop'
import getCreatorCourseData from './customHooks/getCreatorCourseData'
import EnrolledCourse from './pages/EnrolledCourse'
import ViewLecture from './pages/ViewLecture'
import SearchWithAi from './pages/SearchWithAi'
import getAllReviews from './customHooks/getAllReviews'

// Backend API base URL - used by axios in all API calls
export const serverUrl = "https://ace-desk-mern-1.onrender.com"

function App() {
  // useSelector: reads from Redux store. state.user comes from userSlice
  let {userData} = useSelector(state=>state.user)

  // These hooks run on every route - they fetch and populate Redux
  getCurrentUser()        // Checks if user has valid session cookie, sets userData
  getCouseData()          // Fetches all published courses → courseSlice
  getCreatorCourseData()  // Fetches educator's own courses → courseSlice.creatorCourseData
  getAllReviews()         // Fetches all reviews → reviewSlice
  return (
    <>
      <ToastContainer />  {/* Toast notifications - toast.success(), toast.error() come from react-toastify */}
      <ScrollToTop/>      {/* Scrolls to top when route changes */}
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        {/* Protected routes: !userData means if logged out, show SignUp; if logged in, redirect to Home */}
        <Route path='/signup' element={!userData?<SignUp/>:<Navigate to={"/"}/>}/>
        {/* userData? = if logged in show Profile, else redirect to signup */}
        <Route path='/profile' element={userData?<Profile/>:<Navigate to={"/signup"}/>}/>
        <Route path='/allcourses' element={userData?<AllCouses/>:<Navigate to={"/signup"}/>}/>
        <Route path='/viewcourse/:courseId' element={userData?<ViewCourse/>:<Navigate to={"/signup"}/>}/>
        <Route path='/editprofile' element={userData?<EditProfile/>:<Navigate to={"/signup"}/>}/>
        <Route path='/enrolledcourses' element={userData?<EnrolledCourse/>:<Navigate to={"/signup"}/>}/>
         <Route path='/viewlecture/:courseId' element={userData?<ViewLecture/>:<Navigate to={"/signup"}/>}/>
         <Route path='/searchwithai' element={userData?<SearchWithAi/>:<Navigate to={"/signup"}/>}/>
        
        
        {/* Educator-only routes: only if userData.role === "educator" */}
        <Route path='/dashboard' element={userData?.role === "educator"?<Dashboard/>:<Navigate to={"/signup"}/>}/>
        <Route path='/courses' element={userData?.role === "educator"?<Courses/>:<Navigate to={"/signup"}/>}/>
        <Route path='/addcourses/:courseId' element={userData?.role === "educator"?<AddCourses/>:<Navigate to={"/signup"}/>}/>
        <Route path='/createcourses' element={userData?.role === "educator"?<CreateCourse/>:<Navigate to={"/signup"}/>}/>
        <Route path='/createlecture/:courseId' element={userData?.role === "educator"?<CreateLecture/>:<Navigate to={"/signup"}/>}/>
        <Route path='/editlecture/:courseId/:lectureId' element={userData?.role === "educator"?<EditLecture/>:<Navigate to={"/signup"}/>}/>
        <Route path='/forgotpassword' element={<ForgotPassword/>}/>
         </Routes>

         </>
   
  )
}

export default App
