import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Outlet,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MdSpaceDashboard } from "react-icons/md";
import { FaPencilAlt } from "react-icons/fa";
import { RiComputerFill } from "react-icons/ri";
import { MdLeaderboard } from "react-icons/md";
import { MdAssignment } from "react-icons/md";
import { IoMdHelpCircle } from "react-icons/io";
import { LuLogOut } from "react-icons/lu";
import { HiMenu } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import socket from "../utils/socket";

import axiosStudent from "../utils/axiosStudent";
import { logoutStudent } from "../slices/studentAuthSlice";
import ReverseCountdown from "./ReverseCountDown";

import StudentExamPage from "./pages/StudentExamPage";
import StudentStatisticsPage from "./pages/StudentStatisticsPage";
import StudentProfilePage from "./pages/StudentProfilePage";
import StudentMorePage from "./pages/StudentMorePage";
import ExamInstructions from "./components/Instructions";
import Results from "./components/Results";

let dashboardNavs = [
  {
    name: "dashboard",
    path: "/student/dashboard",
    icon: <MdSpaceDashboard />,
  },
  { name: "exam", path: "/student/exam", icon: <FaPencilAlt /> },
  {
    name: "intreview questions",
    path: "/student/intreview",
    icon: <RiComputerFill />,
  },
  {
    name: "practice tests",
    path: "/student/practice",
    icon: <MdAssignment />,
  },
  {
    name: "leaderboard",
    path: "/student/leaderboard",
    icon: <MdLeaderboard />,
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
    if (data?.user?.student_id) {
      socket.emit("registerStudent", data.user.student_id);
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
          category: examData.basicInfo.category,
          coverPreview: examData.basicInfo.coverPreview,
          assignedBy: assignedBy || "Admin",
          timeFrom: examData.settings.availability.timeLimitDays.from,
          timeTo: examData.settings.availability.timeLimitDays.to,
          hourFrom: examData.settings.availability.timeLimitHours.from,
          hourTo: examData.settings.availability.timeLimitHours.to,
          timestamp: new Date().toISOString(),
        },
      ]);
    };

    const handleExamDeleted = ({ examId }) => {
      toast.warning("An exam was deleted from your list.");
      const audio = new Audio("/sounds/notification.mp3");
      audio.play();
      setNotificationCount((prev) => prev + 1);
      setNotifications((prev) => [
        ...prev,
        {
          type: "deleted",
          examId,
          title: "Deleted Exam",
          category: "Unknown",
          coverPreview: null,
          assignedBy: "",
          timeTo: null,
          timestamp: new Date().toISOString(),
        },
      ]);
    };

    socket.on("examAssigned", handleExamAssigned);
    socket.on("examDeleted", handleExamDeleted);

    return () => {
      socket.off("examAssigned", handleExamAssigned);
      socket.off("examDeleted", handleExamDeleted);
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
          userId: data.user.college_mail,
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
                      className="w-[200px] h-[50px] text-[#a4bfce] pl-3 flex justify-start items-center shadow-2xl cursor-pointer"
                      style={
                        isActive
                          ? { background: "white", color: "#081A28" }
                          : {}
                      }
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
                    <IoMdHelpCircle size={17} />
                    <p className="ml-3 font_primary font-semibold">
                      Help & Support
                    </p>
                  </div>
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
                Welcome back, {profile.fullname}🖐️
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
                <div className="absolute right-40 top-15 w-fit bg-white rounded-lg shadow-lg max-h-[400px] overflow-y-auto z-50 cursor-pointer"
                onClick={() => {navigate('/student/exam'); setNotificationCount(0); setNotifications("")}}
                >
                  {notifications.length === 0 ? (
                    <p className="p-4 text-gray-500">No new notifications.</p>
                  ) : (
                    notifications.map((notif, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 border-b border-gray-300"
                      >
                        {notif.coverPreview ? (
                          <img
                            src={`http://localhost:3000/public${notif.coverPreview}`}
                            alt="Cover"
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : (
                          <div className="w-16 h-16 flex items-center justify-center bg-gray-200 text-gray-600 rounded">
                            🗑️
                          </div>
                        )}
                        <div className="flex flex-col gap-1">
                          <div className="flex gap-3 items-center">
                            <p className="text-sm font-semibold capitalize text-primary">
                               Title: {notif.title}
                            </p>
                            <p className="text-sm font-semibold text-primary">
                              Category: {notif.category}
                            </p>
                          </div>
                          {notif.type === "assigned" && notif.timeTo && (
                            <div className="flex gap-3">
                              <ReverseCountdown dateFrom={notif.timeFrom} dateTo={notif.timeTo} timeFrom={notif.hourFrom} timeTo={notif.hourTo} />
                            </div>
                          )}
                          <p className="text-sm text-gray-500 italic">
                            {notif.type === "assigned"
                              ? `Assigned by ${notif.assignedBy}`
                              : "This exam was deleted"}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              <div
                onClick={() => navigate("/student/profile")}
                className="w-10 h-10 rounded-full bg-no-repeat bg-cover border-1 border-[#a4bfce] cursor-pointer"
                style={{
                  backgroundImage: `url(https://info.aec.edu.in/ACET/StudentPhotos/${
                    data.user.college_mail.split("@")[0]
                  }.jpg)`,
                }}
                alt="profile"
              ></div>
              <p className="font_primary text-sm text-[#a4bfce]">
                {profile.fullname}
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
              <Route path="exam">
                <Route index element={<StudentExamPage />} />
                <Route path="instructions" element={<ExamInstructions />} />
                <Route path="results" element={<Results />} />
              </Route>

              <Route path="dashboard">
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
      <Outlet />
    </div>
  );
};

export default StudentPanel;
