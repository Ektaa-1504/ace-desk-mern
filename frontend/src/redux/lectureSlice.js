/**
 * ============================================
 * LECTURE SLICE - Redux State for Lectures
 * ============================================
 * Holds lectureData - used for course lectures (e.g. in CreateLecture, EditLecture)
 * 
 * ViewLecture gets lectures from courseData.lectures, not from this slice directly.
 */

import { createSlice } from "@reduxjs/toolkit"

const lectureSlice = createSlice({
    name: "lecture",
    initialState: {
        lectureData: []
    },
    reducers: {
        setLectureData: (state, action) => {
            state.lectureData = action.payload
        }
    }
})

export const { setLectureData } = lectureSlice.actions
export default lectureSlice.reducer