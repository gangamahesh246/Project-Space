import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../slices/adminAuthSlice";
import { useNavigate } from "react-router-dom";

const SignIn = ({ setRegister }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    username: "",
    id: "",
    password: "",
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/register", {
        username: data.username,
        student_id: data.id, 
        password: data.password,
      });

      const { token, user, message } = res.data;

      if (!user) {
        toast.error("Invalid login response: no user returned");
        return;
      }

      localStorage.setItem("adminAuth", JSON.stringify({ token, user }));

      dispatch(
        loginSuccess({
          token,
          isAdmin: user.isAdmin,
          user,
        })
      );
      toast.success(message || "Register successful");
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Register failed");
    }
  };
  return (
    <div className="w-[400px] p-8 bg-white shadow-2xl rounded-lg">
      <p className="text-3xl text-[#444444] font-bold text-center mb-2">
        ProctorQube
      </p>
      <p className="text-xl text-[#444444] font-light text-center mb-6">
        secure exam
      </p>
      <label className="block mb-2 text-sm font-semibold">Username</label>
      <input
        name="username"
        value={data.username}
        onChange={handleChange}
        className="w-full p-2 text-sm mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary"
      />

      <label className="block mb-2 text-sm font-semibold">Student ID</label>
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
          name="password"
          value={data.password}
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
        onClick={handleLogin}
        className="w-full p-2 text-white bg-green-500 rounded-lg hover:bg-green-500/80 transition-colors duration-300 mb-5 cursor-pointer"
      >
        Register
      </button>
      <p
        onClick={() => setRegister(false)}
        className="text-[12px] underline text-blue-600 text-right cursor-pointer"
      >
        Back to Login 
      </p>
    </div>
  );
};

export default SignIn;
