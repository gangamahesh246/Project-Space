import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Forgot_Password = ({ setForgot }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    id: "",
    new_password: "",
  });

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/forgot-password", {
        id: data.id,
        new_password: data.new_password,
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
      <label className="block mb-2 text-sm font-semibold">Username/ID</label>
      <input
        name="id"
        value={data.id}
        onChange={handleChange}
        className="w-full p-2 text-sm mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary"
      />
      <div className="relative">
        <label className="block mb-2 text-sm font-semibold">New Password</label>
        <input
          type={showPassword ? "text" : "password"}
          name="new_password"
          value={data.new_password}
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
        className="w-full p-2 text-white bg-green-500 rounded-lg hover:bg-green-500/80 transition-colors duration-300 mb-5 cursor-pointer"
      >
        Change Password 
      </button>
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
