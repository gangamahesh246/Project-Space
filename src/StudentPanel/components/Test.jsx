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
  const [userAnswers, setUserAnswers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [violations, setViolations] = useState(0);
  const [examEnded, setExamEnded] = useState(false);
  const [examStarted, setExamStarted] = useState(false);

  const [title, setTitle] = useState("");
  const [createdAt, setCreatedAt] = useState("");

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
  console.log(examQuestions);

  const handleRadioChange = (optionIndex) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentIndex] = optionIndex;
    setUserAnswers(updatedAnswers);
  };

  const handleCheckboxChange = (optionIndex) => {
    const updated = [...(userAnswers[currentIndex] || [])];

    if (updated.includes(optionIndex)) {
      updated.splice(updated.indexOf(optionIndex), 1);
    } else {
      updated.push(optionIndex);
    }

    const allAnswers = [...userAnswers];
    allAnswers[currentIndex] = updated;
    setUserAnswers(allAnswers);
  };

  const handleNext = () => {
    if (currentIndex < examQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  useEffect(() => {
    const handleBackNavigation = (event) => {
      event.preventDefault();
      handleViolation("Tried to navigate back");
      window.history.pushState(null, "", window.location.href);
    };

    const handleUnload = (e) => {
      e.preventDefault();
      handleViolation("Page refresh or tab closed");
      e.returnValue = "";
    };

    window.history.pushState(null, "", window.location.href); // Push initial state
    window.addEventListener("popstate", handleBackNavigation);
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("popstate", handleBackNavigation);
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [examStarted]);

  const goFullScreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    }
  };

  const checkFullScreen = () => {
    return document.fullscreenElement != null;
  };

  const handleViolation = () => {
    if (!examStarted) return;

    setViolations((prev) => {
      const newCount = prev + 1;
      if (newCount > 1) {
        setExamEnded(true);
      }
      return newCount;
    });
  };

  useEffect(() => {
    const handleResize = () => {
      if (!checkFullScreen()) {
        setIsFullscreen(false);
      }
    };

    useEffect(() => {
      if (examStarted && !checkFullScreen()) {
        goFullScreen();
      }
    }, [examStarted]);

    const handleFullScreenChange = () => {
      if (checkFullScreen()) {
        setIsFullscreen(true);
        setShowModal(false);
        setExamStarted(true);
      } else {
        setIsFullscreen(false);
        if (examStarted) {
          setShowModal(true);
          handleViolation();
        }
      }
    };

    const blockKeys = (e) => {
      const key = e.key.toLowerCase();

      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(key)) ||
        (e.ctrlKey && ["u", "c", "v"].includes(key))
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const handleTabSwitch = () => {
      if (examStarted) {
        handleViolation();
        alert("You switched tabs or minimized! Exam will now end.");
      }
    };

    const disableRightClick = (e) => {
      e.preventDefault();
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    window.addEventListener("keydown", blockKeys);
    window.addEventListener("blur", handleTabSwitch);
    window.addEventListener("contextmenu", disableRightClick);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      window.removeEventListener("keydown", blockKeys);
      window.removeEventListener("blur", handleTabSwitch);
      window.removeEventListener("contextmenu", disableRightClick);
    };
  }, [examStarted]);

  if (examQuestions.length === 0) {
    return (
      <div className="text-center mt-10 text-lg font-semibold">
        Loading Questions...
      </div>
    );
  }

  const currentQuestion = examQuestions[currentIndex];
  const isMultipleCorrect =
    Array.isArray(currentQuestion?.correct) &&
    currentQuestion.correct.length > 1;

  if (examEnded) {
    return (
      <div className="container p-10 text-center">
        <h1 className="text-2xl font-bold text-red-600">Exam Ended</h1>
        <p className="mt-4">
          Reason: Violation detected (Fullscreen/tab switch).
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-aliceblue">
      <div className="w-full h-fit bg-primary flex justify-between items-center p-3">
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
        {showModal && (
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
        )}
      </div>
      <div className="flex mt-5">
        <div className="w-3/4 h-full">
          {examQuestions.length > 0 && currentQuestion && (
            <div className="p-6 max-w-4xl mx-auto mt-5 bg-white rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-2">
                Question {currentIndex + 1}:
              </h2>
              <p className="mb-4">{currentQuestion.question}</p>

              <ul className="space-y-2">
                {currentQuestion.options.map((opt, i) => (
                  <li key={i}>
                    <label className="flex items-center gap-2 text-base text-gray-700 cursor-pointer">
                      {isMultipleCorrect ? (
                        <input
                          type="checkbox"
                          name={`q${currentIndex}`}
                          className="form-checkbox h-4 w-4 text-blue-600"
                          checked={
                            userAnswers[currentIndex]?.includes(i) || false
                          }
                          onChange={() => handleCheckboxChange(i)}
                        />
                      ) : (
                        <input
                          type="radio"
                          name={`q${currentIndex}`}
                          className="form-radio h-4 w-4 text-blue-600 cursor-pointer"
                          checked={userAnswers[currentIndex] === i}
                          onChange={() => handleRadioChange(i)}
                        />
                      )}
                      {opt}
                    </label>
                  </li>
                ))}
              </ul>

              {((isMultipleCorrect && userAnswers[currentIndex]?.length > 0) ||
                (!isMultipleCorrect &&
                  userAnswers[currentIndex] !== undefined)) && (
                <button
                  onClick={() => {
                    const updated = [...userAnswers];
                    updated[currentIndex] = isMultipleCorrect ? [] : undefined;
                    setUserAnswers(updated);
                  }}
                  className="mt-4 text-sm text-red-500 underline cursor-pointer"
                >
                  Clear Selection
                </button>
              )}

              <div className="mt-4 flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Marks: {currentQuestion.marks}
                </p>
                <button
                  onClick={handleNext}
                  disabled={currentIndex >= examQuestions.length - 1}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
                >
                  {examQuestions.length - 1 === currentIndex
                    ? "Submit"
                    : "Next Question"}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="w-fit h-fit grid grid-cols-8 gap-2 p-2 ">
          {examQuestions.map((_, index) => (
            <div
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-7 h-7 rounded cursor-pointer flex items-center justify-center border  ${
                currentIndex === index
                  ? "bg-transparent border-blue-500"
                  : userAnswers[index] !== undefined
                  ? "bg-green-500 border-transparent"
                  : "bg-red-500 border-transparent"
              }`}
            >
              {currentIndex + 1 === index + 1 ? (
                <span className="text-red-500 font-semibold">{index + 1}</span>
              ) : (
                <span className="text-red-100">{index + 1}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Test;
