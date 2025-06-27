import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { MdAccessTime } from "react-icons/md";
import { GoPerson } from "react-icons/go";

const Test = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const examId = location.state?.examId;
  const user = useSelector((state) => state.student.user);

  const [examQuestions, setExamQuestions] = useState([]);
  const [title, setTitle] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [violations, setViolations] = useState(0);
  const [examEnded, setExamEnded] = useState(false);
  const [examStarted, setExamStarted] = useState(false);

  useEffect(() => {
    axiosInstance
      .get(`/getexamquestions/${examId}`)
      .then((response) => {
        setExamQuestions(response.data.questions);
        setTitle(response.data.basicInfo.title);
        setCreatedAt(response.data.createdAt);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error.message);
      });
  }, [examId]);

  // const goFullScreen = () => {
  //   const elem = document.documentElement;
  //   if (elem.requestFullscreen) {
  //     elem.requestFullscreen().catch((err) => {
  //       console.error("Fullscreen error:", err);
  //     });
  //   }
  // };

  // const checkFullScreen = () => !!document.fullscreenElement;

  // const handleViolation = (reason = "Unknown") => {
  //   if (!examStarted) return;
  //   setViolations((prev) => {
  //     const newCount = prev + 1;
  //     if (newCount > 2) {
  //       setExamEnded(true);
  //       toast.error(`Violation: ${reason}. Exam ended.`);
  //     }
  //     return newCount;
  //   });
  // };

  // useEffect(() => {
  //   const handleResize = () => {
  //     if (!checkFullScreen()) setIsFullscreen(false);
  //   };

  //   const handleFullscreenChange = () => {
  //     if (checkFullScreen()) {
  //       setIsFullscreen(true);
  //       setShowModal(false);
  //       setExamStarted(true);
  //     } else {
  //       setIsFullscreen(false);
  //       if (examStarted) {
  //         setShowModal(true);
  //         handleViolation("Fullscreen exited");
  //       }
  //     }
  //   };

  //   const blockKeys = (e) => {
  //     const key = e.key.toLowerCase(); 

  //     if (e.key === "F12" || e.keyCode === 123) {
  //       e.preventDefault();
  //       e.stopPropagation();
  //       return false;
  //     } 

  //     if (
  //       (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(key)) ||
  //       (e.ctrlKey && ["u", "c", "v", "a", "x"].includes(key))
  //     ) {
  //       e.preventDefault();
  //       e.stopPropagation();
  //       return false;
  //     }
  //   };

  //   const disableRightClick = (e) => e.preventDefault();

  //   const handleTabSwitch = () => {
  //     if (examStarted) {
  //       handleViolation("Tab switch or minimize");
  //     }
  //   }; 

  //   const blockCopy = (e) => {
  //     e.preventDefault();
  //     alert.warn("Copy blocked");
  //   };
  //   const blockPaste = (e) => e.preventDefault();
  //   const blockCut = (e) => e.preventDefault();
  //   const blockSelect = (e) => e.preventDefault();

  //   document.body.addEventListener("copy", blockCopy);
  //   document.body.addEventListener("paste", blockPaste);
  //   document.body.addEventListener("cut", blockCut);
  //   document.body.addEventListener("selectstart", blockSelect);

  //   goFullScreen();
  //   document.body.style.userSelect = "none";

  //   window.addEventListener("resize", handleResize);
  //   document.addEventListener("fullscreenchange", handleFullscreenChange);
  //   window.addEventListener("keydown", blockKeys);
  //   window.addEventListener("blur", handleTabSwitch);
  //   window.addEventListener("contextmenu", disableRightClick);
  //   document.addEventListener("dragstart", (e) => e.preventDefault());

  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //     document.removeEventListener("fullscreenchange", handleFullscreenChange);
  //     window.removeEventListener("keydown", blockKeys);
  //     window.removeEventListener("blur", handleTabSwitch);
  //     window.removeEventListener("contextmenu", disableRightClick);
  //     document.body.removeEventListener("copy", blockCopy);
  //     document.body.removeEventListener("paste", blockPaste);
  //     document.body.removeEventListener("cut", blockCut);
  //     document.body.removeEventListener("selectstart", blockSelect);
  //     document.body.style.userSelect = "none";
  //   };
  // }, [examStarted]);

  // if (examEnded) {
  //   return (
  //     <div className="container p-10 text-center">
  //       <h1 className="text-2xl font-bold text-red-600">Exam Ended</h1>
  //       <p className="mt-4">
  //         Reason: Violation detected (Fullscreen/tab switch).
  //       </p>
  //     </div>
  //   );
  // }

  return (
    <div
      className="w-full h-fit bg-aliceblue no-select"
      // style={{
      //   position: "fixed",
      //   top: 0,
      //   left: 0,
      //   width: "100vw",
      //   height: "100vh",
      //   zIndex: 9999,
      //   backgroundColor: "transparent",
      //   pointerEvents: "none",
      //   userSelect: "none",
      // }}
    >
      <div className="w-full h-fit border-2 border-white bg-primary flex justify-between items-center p-3">
        <div className="flex items-center gap-2 text-white">
          <div className='w-40 border h-15 bg-[url("/Qubee.png")] bg-cover bg-center bg-aliceblue'></div>
            <p>ProctorQube - Online Assessment</p> | <p>{title}</p> | 
          <p>
            {new Date(createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-5 text-white">
          <p>Answered: 53/60</p>
          <div className="flex items-center gap-1">
            <MdAccessTime /> <span>20 mins</span>
          </div>
          <div className="flex items-center gap-1 bg-[#122b3e] p-2">
            <GoPerson size={25} />
            <span className="text-sm">{user?.name}</span>
          </div>
        </div>
        {/* {showModal && (
          <div className="modal fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black/30 backdrop-blur-[0.5px] bg-opacity-50 cursor-pointer">
            <div className="modal-content bg-white p-6 rounded shadow-lg text-center">
              <h3 className="text-lg font-semibold mb-2 text-red-600">
               You exited fullscreen!
              </h3>
              <p className="mb-4">Click OK to return to fullscreen mode.</p>
              <button
                onClick={goFullScreen}
                className="bg-green-600 text-white px-4 py-2 rounded z-99999"
              >
                OK
              </button>
            </div>
          </div>
        )} */}
      </div>
       {/* 🔻 You can render examQuestions here in future */}
    </div>
  );
};

export default Test;
