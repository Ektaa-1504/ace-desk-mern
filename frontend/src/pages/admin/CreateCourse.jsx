/**
 * CreateCourse - Create new course (title, category)
 * POST /api/course/create → redirects to /courses
 */
import axios from "axios";
import React, { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../../App";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
const CreateCourse = () => {
    let navigate = useNavigate()
    let [loading,setLoading]=useState(false)
    const [title,setTitle] = useState("")
    const [category,setCategory] = useState("")

    const CreateCourseHandler = async () => {
        setLoading(true)
        try {
            const result = await axios.post(serverUrl + "/api/course/create" , {title , category} , {withCredentials:true})
            console.log(result.data)
            toast.success("Course Created")
            navigate("/courses")
            setTitle("")
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
            toast.error(error.response.data.message)
        }
        
    }

    return (
        
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4 py-10 text-[var(--text)]">
            <div className="max-w-xl w-[600px] mx-auto p-6 bg-[var(--surface)] shadow-md rounded-md mt-10 relative border border-[var(--border)]">
                <FaArrowLeftLong  className='top-[8%] absolute left-[5%] w-[22px] h-[22px] cursor-pointer text-[var(--text)]' onClick={()=>navigate("/courses")}/>
                <h2 className="text-2xl font-semibold mb-6 text-center text-[var(--text)]">Create Course</h2>

                <form className="space-y-5" onSubmit={(e)=>e.preventDefault()}>
                    {/* Course Title */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--muted)] mb-1">
                            Course Title
                        </label>
                        <input
                            type="text"
                            placeholder="Enter course title"
                            className="w-full border border-[var(--border)] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--bg)] text-[var(--text)]"
                            onChange={(e)=>setTitle(e.target.value)} value={title}
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--muted)] mb-1">
                            Category
                        </label>
                        <select
                            className="w-full border border-[var(--border)] rounded-md px-4 py-2 bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                            onChange={(e)=>setCategory(e.target.value)}
                        >
                            <option value="">Select category</option>
                            <option value="App Development">App Development</option>
                             <option value="AI/ML">AI/ML</option>
                            <option value="AI Tools">AI Tools
                            </option>
                             <option value="Data Science">Data Science</option>
                            <option value="Data Analytics">Data Analytics</option>
                            <option value="Ethical Hacking">Ethical Hacking</option>
                            <option value="UI UX Designing">UI UX Designing</option>
                            <option value="Web Development">Web Development</option>
                            <option value="Others">Others</option>
                        </select>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-[var(--primary)] text-white py-2 px-4 rounded-md hover:bg-[var(--primary2)] transition shadow-sm" disabled={loading} onClick={CreateCourseHandler}
                    >
                        {loading?<ClipLoader size={30} color='white' /> : "Create"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateCourse;
