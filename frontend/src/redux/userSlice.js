/**
 * ============================================
 * USER SLICE - Redux State for Logged-in User
 * ============================================
 * Holds userData: { name, email, role, photoUrl, enrolledCourses, ... }
 * 
 * USED BY: Login, SignUp, Nav (logout), Profile, EditProfile, getCurrentUser hook
 * 
 * setUserData(payload): Call dispatch(setUserData(result.data)) after login/signup
 *                       or dispatch(setUserData(null)) on logout
 */

import { createSlice } from "@reduxjs/toolkit"

const userSlice = createSlice({
    name: "user",
    initialState: {
        userData: null ,
        isLoading: true   // null = logged out
    },
    reducers: {
        // action.payload = user object from API (or null for logout)
        setUserData: (state, action) => {
            state.userData = action.payload
            state.isLoading = false
        }
    }
})

export const { setUserData } = userSlice.actions
export default userSlice.reducer
