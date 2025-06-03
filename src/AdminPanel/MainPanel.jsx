import React, { useState, useEffect, Suspense } from "react";
import { MdSpaceDashboard } from "react-icons/md";
import { FaPencilAlt } from "react-icons/fa";
import { RiBookShelfFill } from "react-icons/ri";
import { IoPersonSharp } from "react-icons/io5";
import { LuBlocks } from "react-icons/lu";
import { IoSettings } from "react-icons/io5";
import { LuLogOut } from "react-icons/lu";
import { IoNotifications } from "react-icons/io5";
import { HiMenu } from "react-icons/hi";

const ExamPage = React.lazy(() =>
  import("./pages/ExamPage")
);
const StepWrapper = React.lazy(() => import("./Components/CreateExam/StepWrapper"))

let dashboardNavs = [
  {
    name: "dashboard",
    icon: <MdSpaceDashboard />,
  },
  {
    name: "exam",
    icon: <FaPencilAlt />,
  },
  {
    name: "questions",
    icon: <RiBookShelfFill />,
  },
  {
    name: "students",
    icon: <IoPersonSharp />,
  },
  {
    name: "more",
    icon: <LuBlocks />,
  },
];

const MainPanel = () => {
  const [activeTab, setactiveTab] = useState("dashboard");
  const [menu, setMenu] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isSidebarVisible = windowWidth < 480 || windowWidth > 768 || menu;

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "dashboard":
        return ;
      case "exam":
        return <ExamPage onCreateExam={() => setactiveTab("create-exam") } />;
      case "questions":
        return <div>Questions Component</div>;
      case "students":
        return <div>Students Component</div>;
      case "more":
        return <div>More Component</div>;
      case "create-exam":
        return <StepWrapper setactiveTab={setactiveTab} />
      default:
        return <div>Select a tab to view content</div>;
    }
  };

  return (
    <div className="w-full h-screen bg-aliceblue p-3">
      <div className="w-full h-full shadow-2xl overflow-hidden flex">
        {isSidebarVisible && (
        <div className="sm:w-2/4 md:w-2/6 md:h-fit sm:absolute sm:z-50 xl:w-1/5 lg:h-full lg:relative lg:block lg:pt-5 bg-primary" id="sidebar">
          <div className="sm:w-[170px] sm:h-[40px] sm:mt-5 lg:mt-0 lg:w-[220px] lg:h-[70px] flex justify-center items-center">
            <img src="Qube.png" alt="Logo" />
          </div>
          <div className="w-full h-[350px] flex flex-col justify-evenly items-center mt-5 lg:border-r-1 lg:border-[#a4bfce]">
            {dashboardNavs.map((navs) => {
              return (
                <div
                  className="w-[200px] h-[50px] text-[#a4bfce] rounded-lg pl-3 flex justify-start items-center cursor-pointer"
                  style={
                    activeTab === navs.name
                      ? { border: "2px solid #a4bfce" }
                      : {}
                  }
                  onClick={() => {setactiveTab(navs.name); setMenu(false)}}
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
                <IoSettings size={17} />
                <p className="ml-3 font_primary font-semibold">Add Admin</p>
              </div>
              <div className="w-[200px] h-[50px] text-[#a4bfce] rounded-lg pl-3 flex justify-start items-center cursor-pointer">
                <LuLogOut size={17} />
                <p className="ml-3 font_primary font-semibold">Logout</p>
              </div>
            </div>
          </div>
        </div>
        )}
        <div className="sm:w-full sm:p-5 bg-primary xl:w-4/5 xl:p-10">
          <div className="w-full h-11 flex justify-between items-center pb-5 border-b-1 border-[#a4bfce]">
            <div className="flex justify-center items-center gap-2">
              <HiMenu className="sm:block lg:hidden" size={25} color="#a4bfce" onClick={() => {setMenu(!menu); console.log(menu)}} />
              <p className="text-sm font_primary text-[#a4bfce]">
                Welcome back, Mahesh🖐️
              </p>
            </div>
            <div className="flex justify-center items-center gap-2">
              <IoNotifications size={20} color="#a4bfce" />
              <div className="w-10 h-10 rounded-full bg-[url('/profile.jpg')] bg-no-repeat bg-cover border-1 border-[#a4bfce]"></div>
              <p className="font_primary text-sm text-[#a4bfce]">
                Mahesh Karanam
              </p>
            </div>
          </div>
          <div className="w-full h-11/12  overflow-auto hide-scrollbar md:mt-5">
            <p className="capitalize sm:text-2xl xl:text-[30px] font_primary text-aliceblue tracking-wide"
              style={activeTab === "dashboard" ? { display: "block" } : { display: "none"}}
              >
              {activeTab}
            </p>
            <Suspense fallback={<div>Loading...</div>}>
              {renderActiveComponent()}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPanel;
