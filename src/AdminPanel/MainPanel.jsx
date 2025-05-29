import React, { useState, Suspense } from "react";
import { MdSpaceDashboard } from "react-icons/md";
import { FaPencilAlt } from "react-icons/fa";
import { RiBookShelfFill } from "react-icons/ri";
import { IoPersonSharp } from "react-icons/io5";
import { LuBlocks } from "react-icons/lu";
import { IoSettings } from "react-icons/io5";
import { LuLogOut } from "react-icons/lu";
import { IoNotifications } from "react-icons/io5";

const StepWrapper = React.lazy(() =>
  import("./Components/CreateExam/StepWrapper")
);

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
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "dashboard":
        return <StepWrapper />;
      case "exam":
        return <div>Exam Component</div>;
      case "questions":
        return <div>Questions Component</div>;
      case "students":
        return <div>Students Component</div>;
      case "more":
        return <div>More Component</div>;
      default:
        return <div>Select a tab to view content</div>;
    }
  };

  return (
    <div className="w-full h-screen bg-aliceblue p-5">
      <div className="w-full h-full shadow-2xl rounded-3xl overflow-hidden flex">
        <div className="w-1/5 h-full pt-5 bg-primary">
          <div className="w-[220px] h-[70px] flex justify-center items-center">
            <img src="Qube.png" alt="Logo" />
          </div>
          <div className="w-full h-[350px] flex flex-col justify-evenly items-center mt-5 border-r-1 border-[#a4bfce]">
            {dashboardNavs.map((navs) => {
              return (
                <div
                  className="w-[200px] h-[50px] text-[#a4bfce] rounded-lg pl-3 flex justify-start items-center cursor-pointer"
                  style={
                    activeTab === navs.name
                      ? { border: "2px solid #a4bfce" }
                      : {}
                  }
                  onClick={() => setActiveTab(navs.name)}
                >
                  {navs.icon}
                  <p className="ml-3 font_primary font-semibold capitalize tracking-wide">
                    {navs.name}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="w-full h-fit pt-5 mt-5 flex flex-col justify-center items-center border-r-1 border-[#a4bfce]">
            <div className="w-5/6 h-fit flex flex-col justify-evenly items-center border-t-2 border-[#a4bfce]">
              <div className="w-[200px] h-[50px] text-[#a4bfce] rounded-lg pl-3 flex justify-start items-center cursor-pointer">
                <IoSettings size={17} />
                <p className="ml-3 font_primary font-semibold">Settings</p>
              </div>
              <div className="w-[200px] h-[50px] text-[#a4bfce] rounded-lg pl-3 flex justify-start items-center cursor-pointer">
                <LuLogOut size={17} />
                <p className="ml-3 font_primary font-semibold">Logout</p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-4/5 bg-primary p-10">
          <div className="w-full h-11 flex justify-between items-center pb-5 border-b-1 border-[#a4bfce]">
            <p className="text-sm font_primary text-[#a4bfce]">
              Welcome back, Mahesh🖐️
            </p>
            <div className="flex justify-center items-center gap-5">
              <IoNotifications size={20} color="#a4bfce" />
              <div className="w-10 h-10 rounded-full bg-[url('/profile.jpg')] bg-no-repeat bg-cover border-1 border-[#a4bfce]"></div>
              <p className="font_primary text-sm text-[#a4bfce]">
                Mahesh Karanam
              </p>
            </div>
          </div>
          <div className="w-full h-11/12 rounded-3xl overflow-auto hide-scrollbar mt-5 p-2">
            <p className="capitalize text-[30px] font_primary text-aliceblue tracking-wide"
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
