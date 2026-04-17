/**
 * ============================================
 * FORGOT PASSWORD - 3-Step Reset Flow
 * ============================================
 * Step 1: Enter email → POST /api/auth/sendotp (sends OTP to email)
 * Step 2: Enter OTP  → POST /api/auth/verifyotp (validates OTP)
 * Step 3: New password → POST /api/auth/resetpassword (updates password in DB)
 * Uses step state to toggle between 3 UI views
 */

import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { serverUrl } from "../App";
import { toast } from "react-toastify";

function ForgotPassword() {
  let navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [newpassword, setNewPassword] = useState("");
  const [conPassword, setConpassword] = useState("");

  const handleStep1 = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/sendotp`,
        { email },
        { withCredentials: true },
      );
      console.log(result);
      setStep(2);
      toast.success(result.data.message);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };
  const handleStep2 = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/verifyotp`,
        { email, otp },
        { withCredentials: true },
      );
      console.log(result);

      toast.success(result.data.message);
      setLoading(false);
      setStep(3);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };
  const handleStep3 = async () => {
    setLoading(true);
    try {
      if (newpassword !== conPassword) {
        return toast.error("password does not match");
      }
      const result = await axios.post(
        `${serverUrl}/api/auth/resetpassword`,
        { email, password: newpassword },
        { withCredentials: true },
      );
      console.log(result);
      toast.success(result.data.message);
      setLoading(false);
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text)] px-4">
      {step == 1 && (
        <div className="bg-[var(--surface)] border border-[var(--border)] shadow-md rounded-xl p-8 max-w-md w-full backdrop-blur-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-[var(--text)]">
            Forgot Your Password?
          </h2>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--muted)]">
                Enter your email address
              </label>
              <input
                type="email"
                className="mt-1 w-full px-4 py-2 border border-[var(--border)] rounded-md shadow-sm bg-transparent placeholder:text-[var(--faint)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                placeholder="you@example.com"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[var(--primary)] hover:bg-[var(--primary2)] text-white py-2 px-4 rounded-md font-medium cursor-pointer disabled:opacity-60 shadow-sm"
              disabled={loading}
              onClick={handleStep1}
            >
              {loading ? <ClipLoader size={30} color="white" /> : "Send OTP"}
            </button>
          </form>

          <div
            className="text-sm text-center mt-4 text-[var(--muted)] cursor-pointer hover:text-[var(--text)]"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </div>
        </div>
      )}

      {step == 2 && (
        <div className="bg-[var(--surface)] border border-[var(--border)] shadow-lg rounded-xl p-8 max-w-md w-full backdrop-blur-md">
          <h2 className="text-2xl font-bold text-center text-[var(--text)] mb-2">
            Enter OTP
          </h2>

          {/* OTP Inputs */}

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--muted)]">
                Please enter the 4-digit code sent to your email.
              </label>
              <input
                type="text"
                className="mt-1 w-full px-4 py-2 border border-[var(--border)] rounded-md shadow-sm bg-transparent placeholder:text-[var(--faint)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                placeholder="Enter Here"
                onChange={(e) => setOtp(e.target.value)}
                value={otp}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[var(--primary)] hover:bg-[var(--primary2)] text-white py-2 px-4 rounded-md font-medium cursor-pointer disabled:opacity-60 shadow-sm"
              disabled={loading}
              onClick={handleStep2}
            >
              {loading ? <ClipLoader size={30} color="white" /> : "Verify OTP"}
            </button>
          </form>

          <div
            className="text-sm text-center mt-4 text-[var(--muted)] cursor-pointer hover:text-[var(--text)]"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </div>
        </div>
      )}
      {step == 3 && (
        <div className="bg-[var(--surface)] border border-[var(--border)] shadow-lg rounded-xl p-8 max-w-md w-full backdrop-blur-md">
          <h2 className="text-2xl font-bold text-center text-[var(--text)] mb-2">
            Reset Your Password
          </h2>
          <p className="text-sm text-[var(--muted)] text-center mb-6">
            Enter a new password below to regain access to your account.
          </p>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-[var(--muted)] mb-1">
                New Password
              </label>
              <input
                type="text"
                placeholder="Enter new password"
                className="w-full px-4 py-2 border border-[var(--border)] rounded-md bg-transparent placeholder:text-[var(--faint)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
                onChange={(e) => setNewPassword(e.target.value)}
                value={newpassword}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-[var(--muted)] mb-1">
                Confirm Password
              </label>
              <input
                type="text"
                placeholder="Re-enter new password"
                className="w-full px-4 py-2 border border-[var(--border)] rounded-md bg-transparent placeholder:text-[var(--faint)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
                onChange={(e) => setConpassword(e.target.value)}
                value={conPassword}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[var(--primary)] hover:bg-[var(--primary2)] text-white py-2 rounded-md font-medium disabled:opacity-60 shadow-sm"
              onClick={handleStep3}
            >
              {loading ? (
                <ClipLoader size={30} color="white" />
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          {/* Back to login */}
          <div
            className="text-center text-sm mt-4 text-[var(--muted)] cursor-pointer hover:text-[var(--text)]"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </div>
        </div>
      )}
    </div>
  );
}

export default ForgotPassword;
