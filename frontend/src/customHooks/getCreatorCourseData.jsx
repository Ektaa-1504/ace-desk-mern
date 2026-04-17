/**
 * ============================================
 * getCreatorCourseData - Educator's Courses
 * ============================================
 * Fetches GET /api/course/getcreatorcourses (educator's own courses)
 * Puts in Redux courseSlice.creatorCourseData
 * Used by: Dashboard, Courses, CreateCourse, AddCourses
 * Re-runs when userData changes (e.g. after login)
 */

import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import axios from 'axios'
import { setCreatorCourseData } from '../redux/courseSlice'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

const getCreatorCourseData = () => {
    const dispatch = useDispatch()
    const { userData } = useSelector(state => state.user)
  return (
    useEffect(()=>{
    const getCreatorData = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/course/getcreatorcourses" , {withCredentials:true})
        
         await dispatch(setCreatorCourseData(result.data))

        
        console.log(result.data)
        
      } catch (error) {
        console.log(error)
        toast.error(error.response.data.message)
      }
      
    }
    getCreatorData()
  },[userData])
  )
}

export default getCreatorCourseData
