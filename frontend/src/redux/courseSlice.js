/**
 * ============================================
 * COURSE SLICE - Redux State for Courses
 * ============================================
 * - courseData: All published courses (from getCouseData hook)
 * - creatorCourseData: Courses created by logged-in educator (from getCreatorCourseData)
 * - selectedCourseData: Single course when viewing ViewCourse page
 * 
 * USED BY: Cardspage, AllCouses, ViewCourse, Dashboard, CreateCourse, etc.
 */

import { createSlice } from "@reduxjs/toolkit"

const courseSlice = createSlice({
    name: "course",
    initialState: {
        creatorCourseData: [],   // Educator's own courses
        courseData: [],          // All published courses
        selectedCourseData: null // Current course in ViewCourse
    },
    reducers: {
        setCreatorCourseData: (state, action) => {
            state.creatorCourseData = action.payload
        },
        setCourseData: (state, action) => {
            state.courseData = action.payload
        },
        setSelectedCourseData: (state, action) => {
            state.selectedCourseData = action.payload
        }
    }
})

export const { setCreatorCourseData } = courseSlice.actions
export const { setCourseData } = courseSlice.actions
export const { setSelectedCourseData } = courseSlice.actions
export default courseSlice.reducer