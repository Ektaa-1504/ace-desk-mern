/**
 * ============================================
 * REVIEW SLICE - Redux State for Reviews
 * ============================================
 * allReview: All course reviews (from getAllReviews hook)
 * 
 * USED BY: ReviewPage, ReviewCard - displays "Real Reviews from Real Learners"
 */

import { createSlice } from "@reduxjs/toolkit"

const reviewSlice = createSlice({
    name: "review",
    initialState: {
        allReview: []
    },
    reducers: {
        setAllReview: (state, action) => {
            state.allReview = action.payload
        }
    }
})

export const { setAllReview } = reviewSlice.actions
export default reviewSlice.reducer