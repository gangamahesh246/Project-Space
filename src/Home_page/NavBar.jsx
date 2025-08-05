import React from "react";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full h-[100px] bg-primary flex justify-between items-center sm:px-10 xs:px-3">
      <div className="flex items-center">
        <img
          src="/Qubee.png"
          alt="Logo"
          className="w-[45px] h-[45px] object-contain"
        />
        <p className="agbalumo-regular sm:text-md xl:text-xl font-semibold text-[#008738] tracking-wide">
          ProctorQube
        </p>
      </div>
      <div className="lg:w-[200px] flex items-center sm:w-[100px] h-[70px] ">
        <button
          onClick={() => navigate("/studentlogin")}
          className="bg-yellow-300 text-black font-bold lg:w-1/2 sm:h-2/3 xs:px-2 xs:py-1 sm:text-[16px] sm:w-[70px] rounded-xl opacity-80 cursor-pointer hover:opacity-100"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default NavBar;
