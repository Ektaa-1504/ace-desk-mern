/**
 * ============================================
 * getAllReviews - Fetch All Course Reviews
 * ============================================
 * Runs on app load. Fetches GET /api/review/allReview
 * Puts in Redux reviewSlice.allReview
 * Used by: ReviewPage (displays "Real Reviews from Real Learners")
 */

import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { serverUrl } from '../App'
import { setAllReview } from '../redux/reviewSlice'
import axios from 'axios'

const getAllReviews = () => {
   const dispatch = useDispatch()

  useEffect(() => {
    const getAllReviews = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/review/allReview" , {withCredentials:true})
        console.log(result.data)
        dispatch(setAllReview(result.data))
        
      } catch (error) {
        console.log(error)
      }
    }
    getAllReviews()
  },[])
  
}

export default getAllReviews
