import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Outlet,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MdOutlineDashboard } from "react-icons/md";
import { MdOutlineAssignment } from "react-icons/md";
import { HiComputerDesktop } from "react-icons/hi2";
import { MdOutlineAssessment } from "react-icons/md";
import { MdAssignmentAdd } from "react-icons/md";
import { IoMdHelpCircle } from "react-icons/io";
import { LuLogOut } from "react-icons/lu";
import { HiMenu } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import socket from "../utils/socket";
import { MdOutlineDelete } from "react-icons/md";

import axiosStudent from "../utils/axiosStudent";
import { logoutStudent } from "../slices/studentAuthSlice";

import StudentExamPage from "./pages/StudentExamPage";
import StudentStatisticsPage from "./pages/StudentStatisticsPage";
import StudentProfilePage from "./pages/StudentProfilePage";
import InterviewQuestions from "./pages/InterviewQuestions";
import PracticeTests from "./pages/PracticeTests";
import ExamInstructions from "./components/Instructions";
import Results from "./components/Results";
import LeaderBoard from "./pages/LeaderBoard";
import RankByExam from "./components/RankByExam";

let dashboardNavs = [
  {
    name: "dashboard",
    path: "/student/dashboard",
    icon: <MdOutlineDashboard />,
  },
  { name: "exams", path: "/student/exam", icon: <MdOutlineAssignment /> },
  {
    name: "intreview questions",
    path: "/student/interview-questions",
    icon: <HiComputerDesktop />,
  },
  {
    name: "practice tests",
    path: "/student/practice-tests",
    icon: <MdAssignmentAdd />,
  },
  {
    name: "leaderboard",
    path: "/student/leaderboard",
    icon: <MdOutlineAssessment />,
  },
];

const StudentPanel = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const data = useSelector((state) => state.student);

  const [menu, setMenu] = useState(false);
  const [notify, setNotify] = useState(false);
  const [profile, setProfile] = useState({
    fullname: "",
  });

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (data?.user?.college_mail) {
      socket.emit("registerStudent", data.user.college_mail);
    }

    const handleExamAssigned = (examData, assignedBy) => {
      toast.info(`New Exam: ${examData.basicInfo.title}`);
      const audio = new Audio("/sounds/notification.mp3");
      audio.play();
      setNotificationCount((prev) => prev + 1);
      setNotifications((prev) => [
        ...prev,
        {
          type: "assigned",
          title: examData.basicInfo.title,
          assignedBy: assignedBy || "Admin",
          timeFrom: examData.settings.availability.timeLimitDays.from,
          timeTo: examData.settings.availability.timeLimitDays.to,
          hourFrom: examData.settings.availability.timeLimitHours.from,
          hourTo: examData.settings.availability.timeLimitHours.to,
        },
      ]);
    };

    socket.on("examAssigned", handleExamAssigned);

    return () => {
      socket.off("examAssigned", handleExamAssigned);
    };
  }, [data?.user?.college_mail]);

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
    navigate("/studentlogin");
  };

  const handleClick = () => {
    setNotify(!notify);
    setNotificationCount(0);

    if (exams.length > 0) {
      const latestExam = exams[exams.length - 1];
      console.log("Latest Exam: ", latestExam);
    }
  };

  useEffect(() => {
    if (!data.token || !data.user?.college_mail) return;

    axiosStudent
      .get("/student/matchprofile", {
        params: {
          email: data.user.college_mail,
        },
      })
      .then((response) => {
        if (Array.isArray(response.data)) {
          setProfile(response.data[0]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [data.token, data.user?.student_id]);

  return (
    <div className="w-full h-screen">
      <div className="w-full h-full shadow-2xl overflow-hidden flex">
        <AnimatePresence>
          {isSidebarVisible && (
            <motion.div
              initial={isSidebarAnimated ? { x: "-100%" } : false}
              animate={isSidebarAnimated ? { x: 0 } : false}
              exit={isSidebarAnimated ? { x: "-100%" } : false}
              transition={isSidebarAnimated ? { duration: 0.3 } : false}
              className="w-[250px] h-full lg:relative lg:block lg:pt-5 bg-white p-3 flex flex-col border-r border-gray-300 shadow-md"
              id="sidebar"
            >
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
              <div className="mt-8 space-y-3 flex-1">
                {dashboardNavs.map((navs, i) => {
                  const isActive = location.pathname.startsWith(navs.path);
                  return (
                    <div
                      key={i}
                      className={`flex items-center px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group ${
                        isActive
                          ? "bg-[#C3E76D] text-black"
                          : "hover:bg-[#C3E76D] text-gray-700"
                      }`}
                      onClick={() => {
                        setMenu(false);
                        navigate(navs.path);
                      }}
                    >
                      {navs.icon}
                      <p className="ml-3 font_primary text-sm capitalize tracking-wide">
                        {navs.name}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 mt-4 border-t border-gray-300 space-y-3">
                <div className="flex items-center px-4 py-3 rounded-xl cursor-pointer text-gray-700 hover:bg-[#C3E76D]">
                  <IoMdHelpCircle size={18} />
                  <p className="ml-3 text-sm font-medium font_primary">
                    Help & Support
                  </p>
                </div>
                <div
                  onClick={handleLogout}
                  className="flex items-center px-4 py-3 rounded-lg cursor-pointer text-gray-700 bg-gray-100 hover:bg-[#C3E76D]"
                >
                  <LuLogOut size={17} />
                  <p className="ml-3 text-sm font-medium font_primary">
                    Logout
                  </p>
                </div>
              </div>  
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`w-full bg-white`}>
          <div className="w-full h-8 px-2 py-7 flex justify-between items-center border-b-1 border-gray-300">
            <div className="flex justify-center items-center gap-2">
              <HiMenu
                className={`${menu ? "sm:hidden" : "sm:block" } lg:hidden`}
                size={25}
                color="#008738"
                onClick={() => {
                  setMenu(!menu);
                }}
              />
              <p className="text-sm font-bold capitalize font_primary text-[#008738]">
                Welcome back, {profile?.fullname || data?.user?.username}🖐️
              </p>
            </div>
            <div className="flex justify-center items-center gap-2">
              <div className="relative cursor-pointer" onClick={handleClick}>
                🔔
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">
                    {notificationCount}
                  </span>
                )}
              </div>

              {notify && (
                <div
                  className="absolute right-40 top-15 w-fit bg-white rounded-lg shadow-lg max-h-[400px] overflow-y-auto z-50 cursor-pointer"
                  onClick={() => {
                    navigate("/student/exam");
                    setNotificationCount(0);
                    setNotifications("");
                  }}
                >
                  {notifications.length === 0 ? (
                    <p className="p-4 text-gray-500">No new notifications.</p>
                  ) : (
                    notifications.map((notif, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 border-b border-gray-300"
                      >
                        <div className="flex justify-center items-center">
                          <p className="text-sm font-semibold capitalize text-primary">
                            Title: {notif.title}
                          </p>
                          <p className="text-sm font-semibold capitalize text-primary">
                            Title: {notif.assignedBy}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              <div
                onClick={() => navigate("/student/profile")}
                className="w-10 h-10 rounded-full bg-no-repeat bg-cover border-2 border-[#008738] cursor-pointer"
                style={{
                  backgroundImage: `url(https://info.aec.edu.in/ACET/StudentPhotos/${
                    data.user.college_mail.split("@")[0]
                  }.jpg)`,
                }}
                alt="profile"
              ></div>
              <p className="font_primary capitalize font-semibold text-sm text-[#008738]">
                {profile?.fullname || data?.user?.username}
              </p>
            </div>
          </div>
          <div className="w-full h-11/12 overflow-auto hide-scrollbar">
            <Routes>
              <Route path="exam">
                <Route index element={<StudentExamPage />} />
                <Route path="instructions" element={<ExamInstructions />} />
                <Route path="results" element={<Results />} />
                <Route path="rankbyexam" element={<RankByExam />} />
              </Route>

              <Route path="profile" element={<StudentProfilePage />} />
              <Route path="dashboard" element={<StudentStatisticsPage />} />
              <Route path="interview-questions" element={<InterviewQuestions />} />           
              <Route path="practice-tests" element={<PracticeTests />} />           
              <Route path="leaderboard" element={<LeaderBoard />} />           

              <Route
                path="*"
                element={<p className="text-red-500 text-center p-4">Page Not Found</p>}
              />
            </Routes>
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default StudentPanel;
