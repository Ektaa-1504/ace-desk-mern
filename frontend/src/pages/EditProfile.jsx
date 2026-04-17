/**
 * ============================================
 * EDIT PROFILE - Update Name, Description, Photo
 * ============================================
 * Uses FormData to send multipart/form-data (for file upload - photoUrl)
 * POST /api/user/updateprofile → backend updates user, returns new user obj
 * dispatch(setUserData(result.data)) updates Redux so Nav/Profile show new data
 */

import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from '../App'
import { setUserData } from '../redux/userSlice'
import { toast } from 'react-toastify'
import { ClipLoader } from 'react-spinners'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeftLong } from "react-icons/fa6";

function EditProfile() {
     let {userData} = useSelector(state=>state.user)
     let [name,setName] = useState(userData.name || "")
     let [description,setDescription] = useState(userData.description || "")
     let [photoUrl,setPhotoUrl] = useState(null)
     let dispatch = useDispatch()
     let [loading,setLoading] = useState(false)
     let navigate = useNavigate()

      const formData = new FormData()
      formData.append("name",name)
      formData.append("description",description)
      formData.append("photoUrl",photoUrl)



     const updateProfile = async () => {
      setLoading(true)
      try {
        const result = await axios.post(serverUrl + "/api/user/updateprofile" ,formData , {withCredentials:true} )
        console.log(result.data)
        dispatch(setUserData(result.data))
        navigate("/")
        setLoading(false)
      
        toast.success("Profile Update Successfully")
        

        
      } catch (error) {
        console.log(error)
        toast.error("Profile Update Error")
        setLoading(false)
      }
      
     }
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4 py-10 text-[var(--text)]">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-lg p-8 max-w-xl w-full relative">
        <FaArrowLeftLong  className='absolute top-[5%] left-[5%] w-[22px] h-[22px] cursor-pointer text-[var(--text)]' onClick={()=>navigate("/profile")}/>
        <h2 className="text-2xl font-bold text-center text-[var(--text)] mb-6">Edit Profile</h2>

        <form  className="space-y-5" onSubmit={(e)=>e.preventDefault()}>
          {/* Profile Photo */}
          
           <div className="flex flex-col items-center text-center">
          {userData.photoUrl ? <img
            src={userData?.photoUrl}
            alt=""
            className="w-24 h-24 rounded-full object-cover border-4 border-[black]"
          /> : <div className='w-24 h-24 rounded-full text-white flex items-center justify-center text-[30px] border-2 bg-black  border-white cursor-pointer'>
         {userData?.name.slice(0,1).toUpperCase()}
          </div>}
          </div>
          <div>
            <label className="text-sm font-medium text-[var(--muted)]">Select Avatar</label>
            <input
              type="file"
              name="photoUrl"
            
              placeholder="Photo URL"
              className="w-full px-4 py-2 border border-[var(--border)] rounded-md text-sm bg-[var(--bg)] text-[var(--text)]"
              onChange={(e)=>setPhotoUrl(e.target.files[0])}
            />
          </div>

          {/* Name */}
          <div>
            <label className="text-sm font-medium text-[var(--muted)]">Full Name</label>
            <input
              type="text"
              name="name"
              
              className="w-full mt-1 px-4 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] placeholder:text-[var(--muted)] bg-[var(--bg)] text-[var(--text)]"
              placeholder={userData.name}
              onChange={(e)=>setName(e.target.value)}
              value={name}
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="text-sm font-medium text-[var(--muted)]">Email</label>
            <input
              type="email"
              
              readOnly
              className="w-full mt-1 px-4 py-2 bg-slate-900/60 border border-[var(--border)] rounded-md text-[var(--muted)] placeholder:text-[var(--muted)]"
              placeholder={userData.email}
            />
          </div>

         

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-[var(--muted)]">Description</label>
            <textarea
              name="description"
             
              className="w-full mt-1 px-4 py-2 border border-[var(--border)] rounded-md resize-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--bg)] text-[var(--text)]"
              rows={3}
              placeholder="Tell us about yourself"
              onChange={(e)=>setDescription(e.target.value)}
              value={description}
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full bg-[black] active:bg-[#454545] text-white py-2 rounded-md font-medium transition cursor-pointer" disabled={loading} onClick={updateProfile}
          >
            {loading ? <ClipLoader size={30} color='white'/> : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditProfile
