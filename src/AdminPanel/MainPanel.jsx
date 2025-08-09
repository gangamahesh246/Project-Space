import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MdOutlineDashboard } from "react-icons/md";
import { MdOutlineAssignment } from "react-icons/md";
import { RiBookShelfLine } from "react-icons/ri";
import { MdOutlinePersonOutline } from "react-icons/md";
import { LuBlocks } from "react-icons/lu";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { LuLogOut } from "react-icons/lu";
import { HiMenu } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import "../index.css";

import DashBoard from "./pages/DashBoard";
import ExamPage from "./pages/ExamPage";
import QuestionsPage from "./pages/QuestionsPage";
import StudentsPage from "./pages/StudentsPage";
import StepWrapper from "./Components/CreateExam/StepWrapper";
import AddQuestion from "./Components/QuestionsPage/AddQuestion";
import UploadQuestions from "./Components/QuestionsPage/UploadQuestions";
import TakenList from "./Components/Takenlist/TakenList";
import Violations from "./Components/Takenlist/Violations";
import AddAdmin from "./pages/AddAdmin";
import ExamQuestions from "./Components/Takenlist/ExamQuestions";
import Statistics from "./Components/Takenlist/Statistics";
import AddStudent from "./Components/StudentPage/AddStudent";
import UploadStudents from "./Components/StudentPage/UploadStudents";
import StudentPersonalDetails from "./Components/StudentPage/StudentPersonalDetails";
import Profile from "./pages/Profile";
import More from "./pages/More";
import axiosInstance from "../utils/axiosInstance";
import { logout } from "../slices/adminAuthSlice";
import axios from "axios";

let dashboardNavs = [
  { name: "dashboard", path: "/admin/dashboard", icon: <MdOutlineDashboard /> },
  { name: "exams", path: "/admin/exam", icon: <MdOutlineAssignment /> },
  { name: "questions", path: "/admin/questions", icon: <RiBookShelfLine /> },
  {
    name: "students",
    path: "/admin/students",
    icon: <MdOutlinePersonOutline />,
  },
  { name: "more", path: "/admin/more", icon: <LuBlocks /> },
];

const MainPanel = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const data = useSelector((state) => state.login);

  const [menu, setMenu] = useState(false);
  const [profile, setProfile] = useState({
    fullName: "",
    photo: "",
  });

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth <= 768;
  const isSidebarAnimated = isMobile && menu;
  const isSidebarVisible = !isMobile || menu;

  useEffect(() => {
    if (!data.token) return;
    axios
      .get(`${import.meta.env.VITE_Base_URL}/matchprofile`, {
        params: {
          employeeId: data.user.employeeId,
          username: "",
        },
      })
      .then((response) => {
        setProfile(response.data[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [data.token]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="w-full h-screen">
      <div className="w-full h-full overflow-hidden flex">
        <AnimatePresence>
          {isSidebarVisible && (
            <motion.div
              initial={isSidebarAnimated ? { x: "-100%" } : false}
              animate={isSidebarAnimated ? { x: 0 } : false}
              exit={isSidebarAnimated ? { x: "-100%" } : false}
              transition={isSidebarAnimated ? { duration: 0.3 } : false}
              className="w-[250px] h-full lg:relative lg:block lg:pt-5 bg-white p-4 flex flex-col border-r border-gray-300 shadow-md"
              id="sidebar"
            >
              <div>
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
                        onClick={() => {
                          setMenu(false);
                          navigate(navs.path);
                        }}
                        className={`flex items-center px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group ${
                          isActive
                            ? "bg-[#C3E76D] text-black"
                            : "hover:bg-[#C3E76D] text-gray-700"
                        }`}
                      >
                        <span className="text-lg">{navs.icon}</span>
                        <p className="ml-4 text-sm capitalize font_primary tracking-wide">
                          {navs.name}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-300 space-y-3">
                <div 
                onClick={() => navigate("/admin/add-admin")}
                className="flex items-center px-4 py-3 rounded-xl cursor-pointer text-gray-700 hover:bg-[#C3E76D]">
                  <AiOutlineUsergroupAdd size={18} />
                  <p className="ml-3 text-sm font-medium font_primary">
                    Add Admin
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
        <div className="w-full h-full bg-white">
            <div className="w-full h-8 px-2 py-7 flex justify-between items-center border-b-1 border-gray-300">
              <div className="flex justify-center items-center gap-2">
                <HiMenu
                  className={`${menu ? "xs:hidden" : "xs:block" } lg:hidden`}
                  size={25}
                  color="#008738"
                  onClick={() => {
                    setMenu(!menu);
                  }}
                />
                <p className="font_primary font-bold capitalize text-[#008738]">
                  Hello, {profile?.fullName}!🖐️
                </p>
              </div>
              <div className="flex justify-center items-center gap-2">
                <div className="relative cursor-pointer">🔔</div>
                <div
                  onClick={() => navigate("/admin/profile")}
                  className="w-10 h-10 rounded-full bg-no-repeat bg-cover border-2 border-[#008738] cursor-pointer"
                  style={{
                    backgroundImage: `url(${encodeURI(profile?.photo)})`,
                  }}
                  alt="profile"
                ></div>
                <p className="font_primary capitalize font-semibold text-sm text-[#008738]">
                  {profile?.fullName}
                </p>
              </div>
            </div>

          <div className="w-full h-full overflow-auto hide-scrollbar bg-gray-100">
            <Routes>
              <Route index element={<DashBoard />} />
              <Route path="dashboard" element={<DashBoard />} />

              <Route path="exam">
                <Route index element={<ExamPage />} />
                <Route path="create-exam" element={<StepWrapper />} />
                <Route path="takenlist" element={<TakenList />} />
                <Route path="violations" element={<Violations />} />
                <Route
                  path="exam-questions/:examId"
                  element={<ExamQuestions />}
                />
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
                <Route
                  path="personal-info"
                  element={<StudentPersonalDetails />}
                />
              </Route>

              <Route path="more" element={<More />} />
              <Route path="add-admin" element={<AddAdmin />} />
              <Route path="profile" element={<Profile />} />
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

export default MainPanel;
