import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MdSpaceDashboard } from "react-icons/md";
import { FaPencilAlt } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import { LuBlocks } from "react-icons/lu";
import { VscOutput } from "react-icons/vsc";
import { LuLogOut } from "react-icons/lu";
import { HiMenu } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import socket from "../utils/socket";

import axiosInstance from "../utils/axiosInstance";
import { logoutStudent } from "../slices/studentAuthSlice";
import { addAssignedExam, clearNewBadge } from "../slices/assignedExamSlice";
import ReverseCountdown from "./ReverseCountDown";

import StudentExamPage from "./pages/StudentExamPage";
import StudentResultsPage from "./pages/StudentResultsPage";
import StudentStatisticsPage from "./pages/StudentStatisticsPage";
import StudentProfilePage from "./pages/StudentProfilePage";
import StudentMorePage from "./pages/StudentMorePage";

let dashboardNavs = [
  { name: "exam", path: "/student/exam", icon: <FaPencilAlt /> },
  { name: "results", path: "/student/results", icon: <VscOutput /> },
  {
    name: "statistics",
    path: "/student/statistics",
    icon: <MdSpaceDashboard />,
  },
  { name: "profile", path: "/student/profile", icon: <IoPersonSharp /> },
  { name: "more", path: "/student/more", icon: <LuBlocks /> },
];

const StudentPanel = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const data = useSelector((state) => state.student);
  const { hasNew, exams } = useSelector((state) => state.assignedExam);

  const [menu, setMenu] = useState(false);
  const [notify, setNotify] = useState(false);
  const [profile, setProfile] = useState({
    fullName: "Vijay krishna",
    photo: "",
  });

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    if (data?.user?.student_id) {
      socket.emit("registerStudent", data.user.student_id);
    }

    socket.on("examAssigned", (examData) => {
      dispatch(addAssignedExam(examData));

      toast.info(`New Exam: ${examData.basicInfo.title}`);

      const audio = new Audio("/sounds/notification.mp3");
      audio.play();
    });

    return () => {
      socket.off("examAssigned");
    };
  }, [data?.user?.student_id]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth <= 768;
  const isSidebarAnimated = isMobile && menu;
  const isSidebarVisible = !isMobile || menu;

  const handleLogout = () => {
    dispatch(logoutStudent());
    navigate("/login");
  };

  const handleClick = () => {
    setNotify(!notify);
    // if (hasNew) dispatch(clearNewBadge());

    if (exams.length > 0) {
      const latestExam = exams[exams.length - 1];
      // navigate(`/student/exam/${latestExam._id}`);
      console.log("Latest Exam: ", latestExam);
    }
  };

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
                <img src="Qubee.png" alt="Logo" />
              </div>
              <div className="w-full h-[350px] flex flex-col justify-evenly items-center mt-5 lg:border-r-1 lg:border-[#a4bfce]">
                {dashboardNavs.map((navs, i) => {
                  const isActive = location.pathname.startsWith(navs.path);
                  return (
                    <div
                      key={i}
                      className="w-[200px] h-[50px] text-[#a4bfce] rounded-lg pl-3 flex justify-start items-center cursor-pointer"
                      style={isActive ? { border: "2px solid #a4bfce" } : {}}
                      onClick={() => {
                        setMenu(false);
                        navigate(navs.path);
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
                    <LuLogOut size={17} />
                    <p
                      onClick={handleLogout}
                      className="ml-3 font_primary font-semibold"
                    >
                      Logout
                    </p>
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
                Welcome back, {profile.fullName}🖐️
              </p>
            </div>
            <div className="flex justify-center items-center gap-2">
              <div className="relative cursor-pointer" onClick={handleClick}>
                🔔
                {hasNew && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                    {exams.length}
                  </span>
                )}
              </div>
              {notify && (
                <div className="absolute right-40 top-15 w-fit bg-white rounded-lg shadow-lg">
                  {exams.map((exam) => {
                    return (
                      <>
                        <div
                          className="flex items-cente gap-3 r p-2 border-b-1 border-gray-500"
                          key={exam.id}
                        >
                          <img
                            src={`http://localhost:3000/public${exam.basicInfo.coverPreview}`}
                            alt="Cover"
                            className="sm:w-20 sm:h-20 md:w-30 md:h-20 object-cover rounded"
                          />
                          <div className="flex flex-col gap-1">
                            <div className="flex gap-3">
                              <p className="text-sm font-semibold capitalize font_primary text-primary">
                                Title: {exam.basicInfo.title}
                              </p>
                              <p className="text-sm font-semibold font_primary text-primary">
                                Category: {exam.basicInfo.category}
                              </p>
                            </div>
                            <div className="flex gap-3">
                              <ReverseCountdown to={exam.settings.availability.timeLimitDays.to} />
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })}
                </div>
              )}
              <div
                className="w-10 h-10 rounded-full bg-no-repeat bg-cover border-1 border-[#a4bfce] cursor-pointer"
                style={{
                  backgroundImage: `url(${
                    profile.photo
                      ? `http://localhost:3000/public/${profile.photo}`
                      : "/profile.jpg"
                  })`,
                }}
                alt="profile"
              ></div>
              <p className="font_primary text-sm text-[#a4bfce]">
                {profile.fullName}
              </p>
            </div>
          </div>
          <div className="w-full h-11/12  overflow-auto hide-scrollbar md:mt-5">
            {location.pathname === "/student/statistics" && (
              <p className="capitalize sm:text-2xl xl:text-[30px] font_primary text-aliceblue tracking-wide">
                Dashboard
              </p>
            )}

            <Routes>
              <Route index element={<StudentExamPage />} />
              <Route path="exam" element={<StudentExamPage />} />

              <Route path="results">
                <Route index element={<StudentResultsPage />} />
              </Route>

              <Route path="statistics">
                <Route index element={<StudentStatisticsPage />} />
              </Route>

              <Route path="more">
                <Route index element={<StudentMorePage />} />
              </Route>

              <Route path="profile" element={<StudentProfilePage />} />

              <Route
                path="*"
                element={<p className="text-red-500">Page Not Found</p>}
              />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPanel;
