import React from "react";
import { FaGithub } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { BsYoutube } from "react-icons/bs";
import { FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="sm:w-full xl:h-[75vh] bg-primary text-center xl:p-7 sm:flex sm:flex-col sm:justify-center sm:items-center">
      <div className="sm:w-full sm:h-fit lg:h-5/6 border-b-[1px] border-[#a4bfce] sm:flex sm:flex-col xl:flex-row sm:justify-center sm:items-center gap-5">
        <div className="sm:w-fit xl:w-1/2 h-full text-left p-10">
          <p className="text-[#a4bfce] font_primary text-3xl font-extrabold">
            Live Monitoring Enabled
          </p>
          <p className="text-[#a4bfce] font_primary text-xl font-bold mx-10 mb-5">
            - Your test activity may be recorded for academic integrity.
          </p>
          <p className="w-5/6 text-[#a4bfce] font_primary text-xl font-bold">
            AI-Powered Proctoring | Anomalies are automatically flagged and
            reviewed.
          </p>
          <div className="w-full h-1/3 flex justify-center items-center gap-5 mt-5">
            <FaGithub size={30} color="white" />
            <FaFacebook size={30} color="white" />
            <BsYoutube size={30} color="white" />
            <FaTwitter size={30} color="white" />
          </div>
        </div>
        <div className="lg:w-1/2 lg:h-full lg:flex lg:justify-center lg:items-center">
          <div className='lg:w-5/6 lg:h-full bg-[url("/monitor.png")] bg-no-repeat bg-center bg-cover filter invert'></div>
        </div>
      </div>
      <div className="w-5/6 h-fit flex justify-between items-center mt-5">
        <p className="text-[#a4bfce] font_primary sm:text-sm xl:text-lg">
          © 2023 Copyright | All Rights Reserved
        </p>
        <div className="flex justify-center items-center sm:gap-5 xl:gap-10 ">
          <p className="text-[#a4bfce] font_primary sm:text-[10px] xl:text-lg">
            Terms & Conditions
          </p>
          <p className="text-[#a4bfce] font_primary sm:text-[10px] xl:text-lg">
            Privacy Policy
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
