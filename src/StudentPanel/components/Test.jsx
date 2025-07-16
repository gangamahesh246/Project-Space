import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosStudent from "../../utils/axiosStudent";
import goFullscreen from "../../utils/FullScreen";
import WebCamProctoring from "../../utils/WebCamProctoring";
import {
  enableMicStream,
  detectDevTools,
  monitorTabSwitch,
  blockRightClick,
  preventCopyPaste,
} from "../../utils/secureExamUtils";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { MdAccessTime } from "react-icons/md";
import { GoPerson } from "react-icons/go";

const Test = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const tabSwitchListenerRef = useRef(null);
  const devToolsIntervalRef = useRef(null);

  const examId = location.state?.examId;
  const examTime = location.state?.examTime;
  const examType = location.state?.examType;
  const questionTime = location.state?.questionTime;
  const results = location.state?.results;
  const basicInfo = location.state?.basicInfo;
  const attemptStart = location.state?.attemptStart;
  const availability = location.state?.availability;
  const hourTo = location.state?.hourTo;

  const data = useSelector((state) => state.student);

  const [examQuestions, setExamQuestions] = useState([]);
  const [antiCheating, setAntiCheating] = useState({});
  const [studentId, setStudentId] = useState("");
  const [userAnswers, setUserAnswers] = useState([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [title, setTitle] = useState("");
  const [snapshots, setSnapshots] = useState([]);
  const snapshotsRef = useRef([]);

  useEffect(() => {
    snapshotsRef.current = snapshots;
  }, [snapshots]);

  const [createdAt, setCreatedAt] = useState("");
  const [fullname, setFullname] = useState("");
  const [timeLeft, setTimeLeft] = useState(() => {
    const storedStart = localStorage.getItem(`examStart-${examId}`);
    const startTime = storedStart ? new Date(storedStart) : new Date();
    const now = new Date();
    const elapsedSeconds = Math.floor((now - startTime) / 1000);

    if (questionTime > 0) {
      return questionTime;
    }

    if (examType === "dynamic" && hourTo) {
      const [hour, minute] = hourTo.split(":").map(Number);
      const endTime = new Date();
      endTime.setHours(hour, minute, 0, 0);
      const dynamicTimeLeft = Math.floor((endTime - now) / 1000);
      return Math.max(dynamicTimeLeft, 0);
    }

    if (examType === "fixed" && examTime.examTime) {
      return Math.max(examTime.examTime * 60 - elapsedSeconds, 0);
    }

    return 0;
  });
  const [micStream, setMicStream] = useState(null);
  const [showWebcamProctoring, setShowWebcamProctoring] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [violations, setViolations] = useState({
    tabSwitchingViolation: 0,
    devtoolsViolation: 0,
    rightClickViolation: 0,
    webcamViolation: 0,
    soundViolation: 0,
    fullscreenViolation: 0,
  });

  const MAX_VIOLATIONS = 2;

  // useEffect(() => {
  //   if (hasSubmitted || !antiCheating || Object.keys(antiCheating).length === 0)
  //     return;

  //   preventCopyPaste();
  //   blockRightClick(setViolations);
  //   devToolsIntervalRef.current = detectDevTools(setViolations);

  //   let removeFullscreenListener;

  //   if (antiCheating.forceFullscreen) {
  //     goFullscreen();

  //     const handleFullscreenChange = () => {
  //       if (!document.fullscreenElement) {
  //         setIsFullscreen(false);
  //         setViolations((prev) => ({
  //           ...prev,
  //           fullscreenViolation: (prev.fullscreenViolation || 0) + 1,
  //         }));
  //         toast.warn("You exited fullscreen! Click to resume.");
  //       } else {
  //         setIsFullscreen(true);
  //       }
  //     };

  //     document.addEventListener("fullscreenchange", handleFullscreenChange);
  //     removeFullscreenListener = () => {
  //       document.removeEventListener(
  //         "fullscreenchange",
  //         handleFullscreenChange
  //       );
  //     };
  //   }

  //   if (antiCheating.webcam) {
  //     setShowWebcamProctoring(true);
  //   }

  //   if (antiCheating.switchingScreen > 0) {
  //     tabSwitchListenerRef.current = monitorTabSwitch(setViolations);
  //   }

  //   if (violations.tabSwitchingViolation === antiCheating.switchingScreen) {
  //     handleSubmit();
  //   }

  //   if (antiCheating.noiseDetection) {
  //     enableMicStream(setMicStream, setViolations);
  //   }

  //   return () => {
  //     if (removeFullscreenListener) removeFullscreenListener();
  //     if (tabSwitchListenerRef.current) {
  //       document.removeEventListener(
  //         "visibilitychange",
  //         tabSwitchListenerRef.current
  //       );
  //     }
  //   };
  // }, [antiCheating, hasSubmitted]);

  const cleanupSecurity = () => {
    if (micStream) {
      micStream.getTracks().forEach((track) => track.stop());
    }
    if (tabSwitchListenerRef.current) {
      document.removeEventListener(
        "visibilitychange",
        tabSwitchListenerRef.current
      );
      tabSwitchListenerRef.current = null;
    }
    if (devToolsIntervalRef.current) {
      clearInterval(devToolsIntervalRef.current);
      devToolsIntervalRef.current = null;
    }

    window.removeEventListener("contextmenu", blockRightClick);
  };

  useEffect(() => {
    const savedAnswers = localStorage.getItem(`answers-${examId}`);
    if (savedAnswers) {
      setUserAnswers(JSON.parse(savedAnswers));
    }
  }, [examId]);

  useEffect(() => {
    localStorage.setItem(`answers-${examId}`, JSON.stringify(userAnswers));
  }, [userAnswers, examId]);

  useEffect(() => {
    const violationCount = Object.entries(violations)
      .filter(
        ([key]) => key !== "fullscreenViolation" && key !== "webcamViolation"
      )
      .reduce((acc, [_, count]) => acc + (count >= MAX_VIOLATIONS ? 1 : 0), 0);

    if (violationCount > 0 && !hasSubmitted) {
      setHasSubmitted(true);
      toast.error("Cheating violations detected! Submitting exam...");
      handleSubmit();
    }
  }, [violations, hasSubmitted]);

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handlePopState = (e) => {
      toast.warn("You cannot go back during the exam!");
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "Your exam progress may be lost!";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  useEffect(() => {
    axiosStudent
      .get(`/getexamquestions/${examId}`)
      .then((res) => {
        setExamQuestions(res.data.questions);
        setTitle(res.data.basicInfo.title);
        setCreatedAt(res.data.createdAt);
        const acSettings = res.data.settings.antiCheating || {};
        setAntiCheating(acSettings);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error.message);
      });
  }, [examId]);

  useEffect(() => {
    if (!data.token) return;
    axiosStudent
      .get("/student/matchprofile", {
        params: {
          userId: data.user.college_mail,
        },
      })
      .then((res) => setFullname(res.data[0].fullname))
      .catch((err) => console.log(err));
  }, [data.token]);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (questionTime > 0) {
        if (currentIndex < examQuestions.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          handleSubmit();
        }
        return;
      } else {
        handleSubmit();
        return;
      }
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, currentIndex]);

  useEffect(() => {
    if (!examId) return;

    const storedStart = localStorage.getItem(`examStart-${examId}`);
    if (!storedStart) {
      const now = new Date().toISOString();
      localStorage.setItem(`examStart-${examId}`, now);
    }
  }, [examId]);

  useEffect(() => {
    if (!data.user.college_mail) return;

    axiosStudent
      .get("/getstudentId", {
        params: {
          student_mail: data.user.college_mail,
        },
      })
      .then((response) => {
        setStudentId(response.data.studentId);
      })
      .catch((error) => {
        console.error("Error fetching student ID:", error);
      });
  }, [data.user.college_mail]);

  useEffect(() => {
    if (questionTime > 0) {
      setTimeLeft(questionTime);
    }
  }, [currentIndex]);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const currentQuestion = examQuestions[currentIndex];

  const isMultipleCorrect =
    Array.isArray(currentQuestion?.correct) &&
    currentQuestion.correct.length > 1;

  const handleRadioChange = (optionIndex) => {
    const updated = [...userAnswers];
    updated[currentIndex] = optionIndex;
    setUserAnswers(updated);
  };

  const handleCheckboxChange = (optionIndex) => {
    const current = userAnswers[currentIndex] || [];
    const updated = current.includes(optionIndex)
      ? current.filter((i) => i !== optionIndex)
      : [...current, optionIndex];

    const allAnswers = [...userAnswers];
    allAnswers[currentIndex] = updated;
    setUserAnswers(allAnswers);
  };

  const handleNext = () => {
    if (currentIndex < examQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleQuestionChange = (newIndex) => {
    setCurrentIndex(newIndex);
  };

  const handleClearSelection = () => {
    const updated = [...userAnswers];
    updated[currentIndex] = isMultipleCorrect ? [] : undefined;
    setUserAnswers(updated);
  };

  const handleSubmit = async () => {
    micStream?.getTracks().forEach((track) => track.stop());
    const currentSnapshots = snapshotsRef.current;

    const attemptEnd = new Date();
    const totalQuestions = examQuestions.length;
    const questionResults = [];
    let correct = 0;
    let incorrect = 0;
    let score = 0;

    localStorage.removeItem(`examStart-${examId}`);
    localStorage.removeItem(`answers-${examId}`);

    for (let i = 0; i < totalQuestions; i++) {
      const question = examQuestions[i];
      const normalizedAnswers = userAnswers.map((ans) => {
        if (Array.isArray(ans)) return ans;
        return ans != null ? [ans] : [];
      });

      const answer = normalizedAnswers[i];
      if (!answer || answer.length === 0) continue;

      const selectedOptions = Array.isArray(answer)
        ? answer.map((index) => String.fromCharCode(65 + index))
        : [String.fromCharCode(65 + answer)];

      const normalize = (arr) =>
        arr.map((val) => String(val).trim().toUpperCase()).sort();

      const sortedCorrect = normalize(question.correct);
      const sortedAnswer = normalize(selectedOptions);

      const isCorrect =
        JSON.stringify(sortedCorrect) === JSON.stringify(sortedAnswer);

      if (isCorrect) {
        score += question.marks;
        correct++;
      } else {
        score -= results.negativeMarking || 0;
        incorrect++;
      }

      questionResults.push({
        questionText: question.question,
        options: question.options,
        correctAnswers: sortedCorrect,
        selectedAnswers: sortedAnswer,
        isCorrect,
        marks: question.marks,
      });
    }

    const totalMarks = examQuestions.reduce((acc, q) => acc + q.marks, 0);
    const passMark = Math.round(
      ((results.passPercentage || 0) / 100) * totalMarks
    );
    const timeTaken = Math.floor((attemptEnd - new Date(attemptStart)) / 60000);

    const formData = new FormData();
    formData.append("examId", examId);
    formData.append("studentId", studentId);

    formData.append(
      "attemptData",
      JSON.stringify({
        title: basicInfo.title,
        category: basicInfo.category,
        totalMarks,
        passMark,
        score,
        correct,
        incorrect,
        timeTaken,
        startTime: availability.from,
        endTime: availability.to,
        duration: Math.floor(examTime.examTime),
        attemptStart: attemptStart || new Date(),
        attemptEnd,
        violations,
      })
    );

    if (Array.isArray(currentSnapshots) && currentSnapshots.length > 0) {
      currentSnapshots.forEach((blob, index) => {
        const file = new File([blob], `violation_${index}.png`, {
          type: "image/png",
        });
        formData.append("violationImage", file);
      });
    }

    try {
      const res = await axiosStudent.post("/student/complete", formData);

      cleanupSecurity();
      toast.success("Exam submitted successfully!");

      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }

      navigate("/student/exam/results", {
        state: {
          score,
          totalMarks,
          passMark,
          questionResults,
          result: score >= passMark ? "Pass" : "Fail",
        },
      });
    } catch (err) {
      toast.error("Error submitting exam");
      console.error(err);
    }
  };

  if (examQuestions.length === 0) {
    return (
      <div className="text-center mt-10 text-lg font-semibold">
        Loading Questions...
      </div>
    );
  }

  return (
    <div className="w-full bg-aliceblue fixed">
      <div className="w-full h-fit bg-primary flex justify-between items-center p-3 ">
        <div className="flex items-center gap-2 text-white">
          <div className='w-40 h-10 bg-[url("/Qubee.png")] bg-cover bg-center sm:hidden xl:block' />
          <p className="sm:hidden xl:block">ProctorQube - Online Assessment |</p> <p>{title}</p> 
          <p className="sm:hidden xl:block">
            {new Date(createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {showWebcamProctoring && (
          <div>
            <WebCamProctoring
              studentId={studentId}
              examId={examId}
              hasSubmitted={hasSubmitted}
              snapshots={snapshots}
              setSnapshots={setSnapshots}
              onWarningMessage={(message) => toast.warning(message)}
              onViolation={() => {
                setViolations((prev) => ({
                  ...prev,
                  webcamViolation: prev.webcamViolation + 1,
                }));
              }}
              onMaxViolationsReached={() => {
                toast.error("Multiple webcam violations! Submitting exam...");
                if (!hasSubmitted) {
                  setHasSubmitted(true);
                  handleSubmit();
                }
              }}
            />
          </div>
        )}

        <div className="flex items-center gap-5 text-white">
          {userAnswers?.length > 0 && examQuestions?.length > 0 && (
            <span className="text-sm font-medium">
              Answered:{" "}
              {
                userAnswers.filter(
                  (a) => a !== undefined && (!Array.isArray(a) || a.length > 0)
                ).length
              }
              /{examQuestions.length}
            </span>
          )}

          <div className="flex items-center gap-1">
            <MdAccessTime />
            <span
              className={`text-sm font-semibold ${
                timeLeft < 60 ? "text-red-400" : ""
              }`}
            >
              {formatTime(timeLeft)}
            </span>
          </div>
          <div className="flex items-center gap-1 bg-[#122b3e] p-2">
            <GoPerson size={25} />
            <span className="text-sm capitalize">{fullname}</span>
          </div>
        </div>
      </div>

      {!isFullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Fullscreen Mode Required
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              You have exited fullscreen mode. To continue the exam, please
              re-enter fullscreen.
            </p>
            <button
              onClick={goFullscreen}
              className="px-6 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-700 cursor-pointer transition duration-200"
            >
              Re-enter Fullscreen
            </button>
          </div>
        </div>
      )}

      <div
        style={{
          width: "100%",
          height: "100vh",
          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          msUserSelect: "none",
        }}
        className="flex sm:flex-col sm:justify-around lg:flex-row lg:mt-5 sm:p-3 lg:justify-around"
      >
        <div className="w-fit lg:h-[550px] sm:h-[300px] bg-white grid xl:grid-cols-3 xl:gap-7 sm:grid-cols-7 sm:gap-5 md:grid-cols-11 lg:grid-cols-3 p-5 shadow-md rounded-xl overflow-y-auto">
          {examQuestions.map((_, index) => {
            const answered =
              userAnswers[index] !== undefined &&
              userAnswers[index]?.length !== 0;
            return (
              <div
                key={index}
                onClick={() => {
                  if (questionTime <= 0) {
                    handleQuestionChange(index);
                  }
                }}
                className={`w-12 h-12 rounded-full cursor-pointer flex items-center justify-center border ${
                  currentIndex === index
                    ? "bg-transparent border-gray-500"
                    : answered
                    ? "bg-green-500 border-green-500"
                    : "bg-gray-700 border-gray-500"
                }`}
              >
                <span
                  className={
                    currentIndex === index
                      ? "text-gray-500 font-semibold"
                      : "text-red-100"
                  }
                >
                  {index + 1}
                </span>
              </div>
            );
          })}
        </div>

        <div className="lg:w-3/4 sm:mt-3 h-full">
          <div className="lg:p-6 sm:p-3 sm:pl-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-2">
              Question {currentIndex + 1}:
            </h2>
            <div className="relative z-10 select-none">
              <p>{currentQuestion.question}</p>
            </div>

            <ul className="space-y-2 mt-3">
              {currentQuestion.options.map((opt, i) => (
                <li key={i}>
                  <label className="flex items-center gap-2 text-base text-gray-700 cursor-pointer">
                    {isMultipleCorrect ? (
                      <input
                        type="checkbox"
                        checked={
                          userAnswers[currentIndex]?.includes(i) || false
                        }
                        onChange={() => handleCheckboxChange(i)}
                        className="form-checkbox h-4 w-4 text-blue-600 focus:outline-none"
                      />
                    ) : (
                      <input
                        type="radio"
                        checked={userAnswers[currentIndex] === i}
                        onChange={() => handleRadioChange(i)}
                        name={`q${currentIndex}`}
                        className="form-radio h-4 w-4 text-blue-600 focus:outline-none"
                      />
                    )}
                    {opt}
                  </label>
                </li>
              ))}
            </ul>

            {(isMultipleCorrect && userAnswers[currentIndex]?.length > 0) ||
            (!isMultipleCorrect && userAnswers[currentIndex] !== undefined) ? (
              <button
                onClick={handleClearSelection}
                className="mt-4 text-sm text-red-500 underline cursor-pointer"
              >
                Clear Selection
              </button>
            ) : null}

            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Marks: {currentQuestion.marks}
              </p>
              {currentIndex === examQuestions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="bg-green-600 text-white focus:outline-none cursor-pointer px-4 py-2 rounded hover:bg-green-700"
                >
                  Submit Exam
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="bg-blue-600 focus:outline-none cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Next Question
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;
