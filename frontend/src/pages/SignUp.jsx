/**
 * ============================================
 * SIGNUP PAGE - Create New Account
 * ============================================
 * Two signup methods:
 * 1. Email/Password - sends to backend /api/auth/signup
 * 2. Google - uses signInWithPopup (Firebase), then backend /api/auth/googlesignup
 * 
 * Both store user in Redux via setUserData and redirect to Home
 */

import React, { useState } from "react";
import logo from "../assets/acedesk-logo.png";
import google from "../assets/google.jpg";
import axios from "axios";
import { serverUrl } from "../App";
import { MdOutlineRemoveRedEye } from "react-icons/md";

import { MdRemoveRedEye } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";  // Opens Google popup for OAuth
import { auth, provider } from "../../utils/Firebase";  // Firebase auth + Google provider
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");  // student | educator - affects access to dashboard
  const navigate = useNavigate();
  let [show, setShow] = useState(false);  // Toggle password visibility (eye icon)
  const [loading, setLoading] = useState(false);
  let dispatch = useDispatch();  // To call setUserData and update Redux

  // Email/password signup - backend creates user in DB and sets session cookie
  const handleSignUp = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/auth/signup",
        { name, email, password, role },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));

      navigate("/");
      toast.success("SignUp Successfully");
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };
  /**
   * signInWithPopup(auth, provider):
   * - Opens a popup window for Google OAuth (user picks Google account)
   * - Firebase handles the OAuth flow, returns UserCredential
   * - response.user = { displayName, email, photoURL, uid, ... }
   * - We don't store password - Google handles that. Backend creates/finds user by email.
   */
  const googleSignUp = async () => {
    try {
      const response = await signInWithPopup(auth, provider);  // Firebase Google popup
      console.log(response);
      let user = response.user;
      let name = user.displayName;
      let email = user.email;

      const result = await axios.post(
        serverUrl + "/api/auth/googlesignup",
        { name, email, role },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
      navigate("/");
      toast.success("SignUp Successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="bg-[var(--bg)] w-[100vw] h-[100vh] flex items-center justify-center flex-col gap-3 text-[var(--text)]">
      <form
        className="w-[90%] md:w-200 h-150 bg-[var(--surface)] border border-[var(--border)] shadow-xl rounded-2xl flex"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="md:w-[50%] w-[100%] h-[100%] flex flex-col items-center justify-center gap-3 ">
          <div>
            <h1 className="font-semibold text-[var(--text)] text-2xl">
              Let's get Started
            </h1>
            <h2 className="text-[var(--muted)] text-[18px]">Create your account</h2>
          </div>
          <div className="flex flex-col gap-1 w-[80%] items-start justify-center px-3">
            <label htmlFor="name" className="font-semibold">
              Name
            </label>
            <input
              id="name"
              type="text"
              className="border w-[100%] h-[40px] border-[var(--border)] bg-[var(--bg)] text-[15px] px-[20px] rounded-md"
              placeholder="Your name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
          <div className="flex flex-col gap-1 w-[80%] items-start justify-center px-3">
            <label htmlFor="email" className="font-semibold">
              Email
            </label>
            <input
              id="email"
              type="text"
              className="border w-[100%] h-[40px] border-[var(--border)] bg-[var(--bg)] text-[15px] px-[20px] rounded-md"
              placeholder="Your email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className="flex flex-col gap-1 w-[80%] items-start justify-center px-3 relative">
            <label htmlFor="password" className="font-semibold">
              Password
            </label>
            <input
              id="password"
              type={show ? "text" : "password"}
              className="border w-[100%] h-[40px] border-[var(--border)] bg-[var(--bg)] text-[15px] px-[20px] rounded-md"
              placeholder="***********"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            {!show && (
              <MdOutlineRemoveRedEye
                className="absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[18%] text-[var(--muted)]"
                onClick={() => setShow((prev) => !prev)}
              />
            )}
            {show && (
              <MdRemoveRedEye
                className="absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[18%] text-[var(--muted)]"
                onClick={() => setShow((prev) => !prev)}
              />
            )}
          </div>
          <div className="flex md:w-[50%] w-[70%] items-center justify-between">
            <span
              className={`px-[10px] py-[5px] border-[1px] border-[#e7e6e6] rounded-2xl  cursor-pointer ${
                role === "student" ? "border-[var(--primary)] bg-slate-950/60 text-[var(--text)]" : "border-slate-600 text-[var(--muted)]"
              }`}
              onClick={() => setRole("student")}
            >
              Student
            </span>
            <span
              className={`px-[10px] py-[5px] border-[1px] border-[#e7e6e6] rounded-2xl  cursor-pointer ${
                role === "educator" ? "border-[var(--primary)] bg-slate-950/60 text-[var(--text)]" : "border-slate-600 text-[var(--muted)]"
              }`}
              onClick={() => setRole("educator")}
            >
              Educator
            </span>
          </div>
          <button
            className="w-[80%] h-[42px] bg-[var(--primary)] hover:bg-[var(--primary2)] text-white cursor-pointer flex items-center justify-center rounded-md shadow-sm"
            disabled={loading}
            onClick={handleSignUp}
          >
            {loading ? <ClipLoader size={30} color="white" /> : "Sign Up"}
          </button>

          <div className="w-[80%] flex items-center gap-2">
            <div className="w-[25%] h-[0.5px] bg-slate-700"></div>
            <div className="w-[50%] text-[15px] text-[var(--muted)] flex items-center justify-center ">
              Or continue with
            </div>
            <div className="w-[25%] h-[0.5px] bg-slate-700"></div>
          </div>
          <div
            className="w-[80%] h-[42px] border border-[var(--border)] rounded-md flex items-center justify-center bg-slate-950/60 cursor-pointer hover:bg-slate-900  "
            onClick={googleSignUp}
          >
            <img src={google} alt="" className="w-[25px]" />
            <span className="text-[16px] text-[var(--muted)] ml-2">Continue with Google</span>{" "}
          </div>
          <div className="text-[var(--muted)] text-sm mt-2">
            Already have an account?{" "}
            <span
              className="underline underline-offset-1 text-[var(--primary2)] cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </div>
        </div>
        <div className="w-[50%] h-[100%] rounded-r-2xl bg-[linear-gradient(135deg,#2563EB,#60A5FA)] md:flex items-center justify-center flex-col hidden">
          <div className="px-6 py-5 rounded-2xl bg-white/10 border border-white/20 shadow-2xl backdrop-blur-lg flex flex-col items-center justify-center gap-3">
            <img src={logo} className="w-30 shadow-2xl rounded-lg" alt="AceDesk logo" />
            <span className="text-[white] text-2xl font-semibold tracking-wide">AceDesk</span>
            <p className="text-xs text-white/70 text-center max-w-[220px]">
              Join thousands of learners leveling up with AI.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
