import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MdSpaceDashboard } from "react-icons/md";
import { FaPencilAlt } from "react-icons/fa";
import { RiBookShelfFill } from "react-icons/ri";
import { IoPersonSharp } from "react-icons/io5";
import { LuBlocks } from "react-icons/lu";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { LuLogOut } from "react-icons/lu";
import { IoNotifications } from "react-icons/io5";
import { HiMenu } from "react-icons/hi";

import DashBoard from "./pages/DashBoard";
import ExamPage from "./pages/ExamPage";
import QuestionsPage from "./pages/QuestionsPage";
import StudentsPage from "./pages/StudentsPage";
import StepWrapper from "./Components/CreateExam/StepWrapper";
import AddQuestion from "./Components/QuestionsPage/AddQuestion";
import UploadQuestions from "./Components/QuestionsPage/UploadQuestions";
import TakenList from "./Components/Takenlist/TakenList";
import ExamQuestions from "./Components/Takenlist/ExamQuestions";
import Statistics from "./Components/Takenlist/Statistics"
import AddStudent from "./Components/StudentPage/AddStudent";
import UploadStudents from "./Components/StudentPage/UploadStudents";
import StudentPersonalDetails from "./Components/StudentPage/StudentPersonalDetails";
import Profile from "./pages/Profile";

let dashboardNavs = [
  { name: "dashboard", icon: <MdSpaceDashboard /> },
  { name: "exam", icon: <FaPencilAlt /> },
  { name: "questions", icon: <RiBookShelfFill /> },
  { name: "students", icon: <IoPersonSharp /> },
  { name: "more", icon: <LuBlocks /> },
];

const MainPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setactiveTab] = useState("dashboard");
  const [menu, setMenu] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const firstSegment = location.pathname.split("/")[1] || "dashboard";

    if (dashboardNavs.some(nav => nav.name === firstSegment)) {
      setactiveTab(firstSegment);
    } else {
      setactiveTab("");
    }
  }, [location.pathname]);''
const isMobile = windowWidth <= 768;
const isSidebarAnimated = isMobile && menu;
const isSidebarVisible = !isMobile || menu;

  

  return (
    <div className="w-full h-screen bg-aliceblue">
      <div className="w-full h-full shadow-2xl overflow-hidden flex">
        <AnimatePresence>
        {isSidebarVisible && (
          <motion.div
            initial={isSidebarAnimated ? { x: "-100%" } : false}
            animate={isSidebarAnimated ? { x: 0 } : false}
            exit={isSidebarAnimated ? { x: "-100%" } : false}
            transition={isSidebarAnimated ? { duration: 0.3 } : false}
            className="sm:w-2/4 md:w-2/6 md:h-fit sm:absolute sm:z-50 xl:w-1/6 lg:h-full lg:relative lg:block lg:pt-5 bg-primary"
            id="sidebar"
          >
            <div className="sm:w-[170px] sm:h-[40px] sm:mt-5 lg:mt-0 lg:w-[220px] lg:h-[70px] flex justify-center items-center">
              <img src="Qube.png" alt="Logo" />
            </div>
            <div className="w-full h-[350px] flex flex-col justify-evenly items-center mt-5 lg:border-r-1 lg:border-[#a4bfce]">
              {dashboardNavs.map((navs, i) => {
                const isActive = activeTab === navs.name;
                return (
                  <div
                    key={i}
                    className="w-[200px] h-[50px] text-[#a4bfce] rounded-lg pl-3 flex justify-start items-center cursor-pointer"
                    style={isActive ? { border: "2px solid #a4bfce" } : {}}
                    onClick={() => {
                      setMenu(false);
                      navigate(`/${navs.name}`, { replace: false });
                    }}
                  >
                    {navs.icon}
                    <p className="ml-3 font_primary font-semibold capitalize tracking-wide">
                      {navs.name}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="w-full h-fit pt-5 mt-5 flex flex-col justify-center items-center lg:border-r-1 lg:border-[#a4bfce]">
              <div className="w-5/6 h-fit flex flex-col justify-evenly items-center border-t-2 border-[#a4bfce]">
                <div className="w-[200px] h-[50px] text-[#a4bfce] rounded-lg pl-3 flex justify-start items-center cursor-pointer">
                  <BsFillPersonPlusFill size={17} />
                  <p className="ml-3 font_primary font-semibold">Add Admin</p>
                </div>
                <div className="w-[200px] h-[50px] text-[#a4bfce] rounded-lg pl-3 flex justify-start items-center cursor-pointer">
                  <LuLogOut size={17} />
                  <p className="ml-3 font_primary font-semibold">Logout</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
        <div className="sm:w-full sm:p-3 bg-primary xl:w-5/6 xl:p-8">
          <div className="w-full h-11 flex justify-between items-center pb-5 border-b-1 border-[#a4bfce]">
            <div className="flex justify-center items-center gap-2">
              <HiMenu
                className="sm:block lg:hidden"
                size={25}
                color="#a4bfce"
                onClick={() => {
                  setMenu(!menu);
                }}
              />
              <p className="text-sm font_primary text-[#a4bfce]">
                Welcome back, Mahesh🖐️
              </p>
            </div>
            <div className="flex justify-center items-center gap-2">
              <IoNotifications size={20} color="#a4bfce" />
              <div
              onClick={() => navigate("/profile")}
                className="w-10 h-10 rounded-full bg-[url('/profile.jpg')] bg-no-repeat bg-cover border-1 border-[#a4bfce] cursor-pointer"
                alt="profile"
              ></div>
              <p className="font_primary text-sm text-[#a4bfce]">Mahesh Karanam</p>
            </div>
          </div>
          <div className="w-full h-11/12  overflow-auto hide-scrollbar md:mt-5">
            <p
              className="capitalize sm:text-2xl xl:text-[30px] font_primary text-aliceblue tracking-wide"
              style={activeTab === "dashboard" ? { display: "block" } : { display: "none" }}
            >
              {activeTab}
            </p>
            <Routes>
              <Route path="dashboard" element={<DashBoard />} />
              <Route path="exam">
                <Route index element={<ExamPage />} />
                <Route path="create-exam" element={<StepWrapper />} />
                <Route path="takenlist/:examId" element={<TakenList />} />
                <Route path="exam-questions/:examId" element={<ExamQuestions />} />
                <Route path="statistics/:examId" element={<Statistics />} />
              </Route>
              <Route path="questions">
                <Route index element={<QuestionsPage />} />
                <Route path="add-question" element={<AddQuestion />} />
                <Route path="upload-questions" element={<UploadQuestions />} />
              </Route>
              <Route path="students">
                <Route index element={<StudentsPage />} />
                <Route path="add-student" element={<AddStudent />} />
                <Route path="upload-students" element={<UploadStudents />} />
                <Route path="personal-info/:studentMail" element={<StudentPersonalDetails />} />
              </Route>

              <Route path="profile" element={<Profile />} />
              <Route path="*" element={<p className="text-red-500">Page Not Found</p>} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPanel;
