import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Forgot_Password = ({ setForgot }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState("send"); 
  const [data, setData] = useState({
    email: "",
    newPassword: "",
    otp: ""
  });

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const SendOtp = async () => {
    if (!data.email) return toast.error("Please enter your email");
    try {
      const res = await axios.post(`${import.meta.env.VITE_Base_URL}/send-otp`, {
        email: data.email,
      });
      toast.success(res.data.message);
      setStep("verify");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const VerifyOtp = async () => {
    if (!data.otp) return toast.error("Enter the OTP");
    try {
      const res = await axios.post(`${import.meta.env.VITE_Base_URL}/verify-otp`, {
        email: data.email,
        otp: data.otp
      });
      toast.success(res.data.message);
      setStep("reset");
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_Base_URL}/forgot-password`, {
        email: data.email,
        newPassword: data.newPassword,
      });
      toast.success(res.data.message || "Password changed successfully");
      setForgot(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Change failed");
    }
  };

  return (
    <div className="w-[400px] p-8 bg-white shadow-2xl rounded-lg">
      <p className="text-3xl text-[#444444] font-bold text-center mb-2">
        ProctorQube
      </p>
      <p className="text-xl text-[#444444] font-light text-center mb-6">
        Reset your password
      </p>

      <label className="block mb-2 text-sm font-semibold">Gmail</label>
      <input
        type="email"
        name="email"
        required
        value={data.email}
        onChange={handleChange}
        className="w-full p-2 text-sm mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary"
      />

      {step === "send" && (
        <button
          onClick={SendOtp}
          className="w-full p-2 mb-4 text-sm font-semibold text-white bg-amber-400 rounded cursor-pointer"
        >
          Send OTP
        </button>
      )}

      {step === "verify" && (
        <>
          <label className="block mb-2 text-sm font-semibold">OTP</label>
          <input
            type="text"
            name="otp"
            value={data.otp}
            onChange={handleChange}
            className="w-full p-2 text-sm mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary"
          />
          <button
            onClick={VerifyOtp}
            className="w-full p-2 mb-4 text-sm font-semibold text-white bg-blue-500 rounded cursor-pointer"
          >
            Verify OTP
          </button>
        </>
      )}

      {step === "reset" && (
        <>
          <label className="block mb-2 text-sm font-semibold">New Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="newPassword"
              value={data.newPassword}
              onChange={handleChange}
              className="w-full p-2 text-sm mb-4 border border-gray-300 rounded-lg pr-10 focus:outline-none focus:ring-1 focus:ring-secondary"
            />
            <span
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-2.5 cursor-pointer text-gray-600"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full p-2 mb-4 text-sm font-semibold text-white bg-green-500 rounded cursor-pointer hover:bg-green-600"
          >
            Change Password
          </button>
        </>
      )}

      <p
        onClick={() => setForgot(false)}
        className="text-[12px] underline text-blue-600 text-right cursor-pointer"
      >
        Back to Login
      </p>
    </div>
  );
};

export default Forgot_Password;
