/**
 * ============================================
 * REDUX STORE - Global State Container
 * ============================================
 * Single source of truth for app-wide data.
 * Each slice manages its own part of the state.
 * 
 * STATE SHAPE:
 * - state.user     → userData (logged-in user info)
 * - state.course   → courseData, creatorCourseData, selectedCourseData
 * - state.lecture  → lectureData
 * - state.review   → allReview
 * 
 * ACCESS: useSelector(state => state.user) or useDispatch() to dispatch actions
 */

import { configureStore } from "@reduxjs/toolkit"
import userSlice from "./userSlice"
import courseSlice from "./courseSlice"
import lectureSlice from "./lectureSlice"
import reviewSlice from "./reviewSlice"

export const store = configureStore({
    reducer:{
        user: userSlice,    // Login, profile, roles
        course: courseSlice,
        lecture: lectureSlice,
        review: reviewSlice
    }
})