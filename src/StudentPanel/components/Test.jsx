import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import goFullscreen from "../../utils/FullScreen";
import {
  enableMicStream,
  preventCopyPaste,
  blockKeyboardShortcuts,
  blockRightClick,
  detectDevTools,
  monitorTabSwitch,
} from "../../utils/secureExamUtils";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { MdAccessTime } from "react-icons/md";
import { GoPerson } from "react-icons/go";

const Test = () => {
  const location = useLocation();
  const navigate = useNavigate();

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
  const [studentId, setStudentId] = useState("");
  const [userAnswers, setUserAnswers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [title, setTitle] = useState("");
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
  const [violations, setViolations] = useState({
    tabSwitchingViolation: 0,
    devtoolsViolation: 0,
  });

  console.log(violations);

  useEffect(() => {
    goFullscreen();
    enableMicStream(setMicStream, setViolations);
    detectDevTools(setViolations);
    monitorTabSwitch(setViolations);
  }, []);

  useEffect(() => {
    axiosInstance
      .get(`/getexamquestions/${examId}`)
      .then((res) => {
        setExamQuestions(res.data.questions);
        setTitle(res.data.basicInfo.title);
        setCreatedAt(res.data.createdAt);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error.message);
      });
  }, [examId]);

  useEffect(() => {
    if (!data.token) return;
    axiosInstance
      .get("/student/matchprofile", {
        params: {
          userId: data.user.student_id,
          username: "",
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
    if (!data.user.student_id) return;

    axiosInstance
      .get("/getstudentId", {
        params: {
          student_mail: data.user.student_id,
        },
      })
      .then((response) => {
        setStudentId(response.data.studentId);
      })
      .catch((error) => {
        console.error("Error fetching student ID:", error);
      });
  }, [data.user.student_id]);

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
    const attemptEnd = new Date();
    const totalQuestions = examQuestions.length;
    const questionResults = [];
    let correct = 0;
    let incorrect = 0;
    let score = 0;

    localStorage.removeItem(`examStart-${examId}`);

    for (let i = 0; i < totalQuestions; i++) {
      const question = examQuestions[i];
      const normalizedAnswers = userAnswers.map((ans) => {
        if (Array.isArray(ans)) return ans;
        return ans != null ? [ans] : [];
      });

      const answer = normalizedAnswers[i];

      if (!answer || answer.length === 0) continue;

      const isMulti =
        Array.isArray(question.correct) && question.correct.length > 1;

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
    const passMark = Math.round((results.passPercentage / 100) * totalMarks);

    const attemptData = {
      examId,
      student_id: studentId,
      title: basicInfo.title,
      category: basicInfo.category,
      totalMarks,
      passMark,
      score,
      correct,
      incorrect,
      startTime: availability.from,
      endTime: availability.to,
      duration: Math.floor(examTime.examTime / 60),
      attemptStart: attemptStart || new Date(),
      attemptEnd,
    };

    console.log("Attempt Data:", attemptData);

    try {
      const res = await axiosInstance.post("/student/complete", attemptData);
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
    <div className="w-full h-screen bg-aliceblue ">
      <div className="w-full h-fit bg-primary flex justify-between items-center p-3 ">
        <div className="flex items-center gap-2 text-white">
          <div className='w-40 h-10 bg-[url("/Qubee.png")] bg-cover bg-center' />
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
          <p>
            Answered:{" "}
            {
              userAnswers.filter((a) => a !== undefined && a.length !== 0)
                .length
            }
            /{examQuestions.length}
          </p>
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

      <div className="flex mt-5 justify-around">
        <div className="w-fit h-[550px] bg-white grid grid-cols-3 gap-7 p-5 shadow-md rounded-xl overflow-y-auto">
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

        <div className="w-3/4 h-full">
          <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-2">
              Question {currentIndex + 1}:
            </h2>
            <div className="relative z-10 select-none">
              <p>{currentQuestion.question}</p>
            </div>

            <div className="fixed top-[138px] left-[410px] z-50 bg-transparent p-[9px] pointer-events-auto">
              <p className="text-sm select-none text-transparent">
                {"\u00A0".repeat(200)}
              </p>
            </div>

            <ul className="space-y-2 mt-3">
              {currentQuestion.options.map((opt, i) => (
                <li key={i}>
                  <label className="flex items-center gap-2 text-base text-gray-700 cursor-pointer focus:outline-none">
                    {isMultipleCorrect ? (
                      <input
                        type="checkbox"
                        checked={
                          userAnswers[currentIndex]?.includes(i) || false
                        }
                        onChange={() => handleCheckboxChange(i)}
                        className="form-checkbox h-4 w-4 text-blue-600"
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
