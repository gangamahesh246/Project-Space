import axios from "axios";
import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { loginStudent } from "../slices/studentAuthSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

import Forgot_Password from "./Forgot_Password";
import SignIn from "./SignIn";

const StudentLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState({
    college_mail: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [register, setRegister] = useState(false);

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
      const res = await axios.post(`${import.meta.env.VITE_Base_URL}/studentlogin`, data); 
      const { token, user, message } = res.data;

      if (!user || user.isAdmin) {
        toast.error("Invalid student credentials");
        return;
      }

      const authData = { token, user };
      dispatch(loginStudent(authData));
      localStorage.setItem("studentAuth", JSON.stringify(authData));
      toast.success(message || "Login successful");
      navigate("/student/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="w-full h-screen bg-[#F2F2F2] flex justify-center items-center">
      <div className="w-[90%] h-[80%] bg-white shadow-xs">
        <div className="sm:hidden xl:block w-20 h-20 bg-[#B6E2FF] sm:top-160 sm:left-50 rotate-[60deg] absolute xl:left-10 xl:top-30"></div>
        <div className="sm:hidden xl:block w-[100px] h-[100px] border-7 border-[#3B669D] rounded-full absolute md:left-150 md:top-7 xl:left-180"></div>
        <div className="sm:hidden xl:block w-8 h-8 bg-green-300 rounded-full absolute left-250 top-27"></div>
        <div className="sm:hidden xl:block w-[60px] h-[60px] border-7 border-green-300 rounded-full absolute md:left-130 md:top-110 "></div>
        <div className="sm:hidden xl:block w-10 h-10 bg-[#B6E2FF] rotate-45 absolute left-250 top-143"></div>

        <div className='sm:hidden xl:block w-90 h-90 bg-[url("/abssss.png")] bg-no-repeat bg-cover absolute top-75 left-30 '></div>
        <div className='sm:top-15 sm:-left-5 sm:w-130 sm:h-130 xl:w-80 xl:h-80 md:hidden xl:block bg-[url("/abstract.png")] bg-no-repeat bg-cover absolute xl:top-50 xl:left-265'></div>
        <div className='sm:hidden xl:block w-80 h-80 bg-[url("/abs.png")] -rotate-45 bg-no-repeat bg-cover absolute -top-10 left-60'></div>
      </div>
      <AnimatePresence>
        {forgot ? (
          <motion.div
            key="forgot"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute z-50"
          >
            <Forgot_Password setForgot={setForgot} />
          </motion.div>
        ) : register ? (
          <motion.div
            key="register"
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute z-50"
          >
            <SignIn setRegister={setRegister} />
          </motion.div>
        ) : (
          <motion.div
            key="login"
            exit={
              register
                ? { x: "-100%", opacity: 0 }
                : forgot
                ? { x: "100%", opacity: 0 }
                : { x: 0, opacity: 0 }
            }
            transition={{ duration: 0.5 }}
            className="w-[400px] p-8 bg-white shadow-2xl rounded-lg absolute z-50"
          >
            <p className="text-3xl text-[#444444] font-bold text-center mb-2">
              ProctorQube
            </p>
            <p className="text-xl text-[#444444] font-light text-center mb-6">
              secure exam
            </p>
            <label className="capitalize block mb-2 text-sm font-semibold">
              college mail
            </label>
            <input
              name="college_mail"
              value={data.college_mail}
              onChange={handleChange}
              className="w-full p-2 text-sm mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary"
            />

            <div className="relative">
              <label className="block mb-2 text-sm font-semibold">
                Password
              </label>
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
              Login
            </button>

            <p
              onClick={() => {
                setRegister(true);
                setForgot(false);
              }}
              className="text-sm text-yellow-500 text-center mb-6 cursor-pointer hover:underline"
            >
              Create a new proctorqube account
            </p>
            <p
              onClick={() => {
                setForgot(true);
                setRegister(false);
              }}
              className="text-[12px] underline text-yellow-500 text-right cursor-pointer"
            >
              Forgot password?
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentLogin;
