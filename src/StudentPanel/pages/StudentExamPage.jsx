import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import socket from "../../utils/socket";
import { Outlet, useNavigate } from "react-router-dom";
import { FaCalendarAlt } from "react-icons/fa";
import { useRef } from "react";

const StudentExamPage = () => {
  const navigate = useNavigate();
  const dateInputRef = useRef(null);
  const StudentMail = useSelector((state) => state.student.user.student_id);

  const [studentId, setStudentId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [exams, setExams] = useState([]);
  const [status, setStatus] = useState("all status");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!StudentMail) return;

    axiosInstance
      .get("/getstudentId", {
        params: {
          student_mail: StudentMail,
        },
      })
      .then((response) => {
        setStudentId(response.data.studentId);
      })
      .catch((error) => {
        console.error("Error fetching student ID:", error);
      });
  }, [StudentMail]);

  const getExamStatus = (from, to, currentStatus) => {
    const now = new Date();
    if (currentStatus === "completed") return "completed";

    if (from && to) {
      const fromDate = new Date(from);
      const toDate = new Date(to);

      if (!isNaN(fromDate) && !isNaN(toDate)) {
        if (now >= fromDate && now <= toDate) return "active";
      }
    }

    return "inactive";
  };

  useEffect(() => {
    if (studentId && typeof studentId === "string" && studentId.length === 24) {
      axiosInstance
        .get("/student", {
          params: {
            student_id: studentId,
          },
        })
        .then((res) => {
          const updatedExams = res.data?.exams?.map((exam) => {
            const timeLimitDays =
              exam?.examId?.settings?.availability?.timeLimitDays;
            const { from, to } = timeLimitDays || {};

            const status = getExamStatus(from, to, exam.status);

            if (exam.status !== status) {
              axiosInstance
                .post("/status", {
                  examId: exam.examId._id,
                  status: status,
                  student_id: studentId,
                })
                .catch((err) => {
                  console.error("Failed to update status:", err);
                });
            }

            return {
              ...exam,
              status,
            };
          });

          setExams(updatedExams);
        })
        .catch((error) => {
          toast.error(error?.response?.data?.message || error.message);
        });
    }
  }, [studentId]);

  const filteredExams = exams.filter((e) => {
    const matchesStatus = status === "all status" || e.status === status;
    const matchesTitle = e.examId?.basicInfo?.title
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesDate = selectedDate
      ? new Date(e.assignedAt).toDateString() ===
        new Date(selectedDate).toDateString()
      : true;

    return matchesStatus && matchesTitle && matchesDate;
  });

  const activeExams = filteredExams.filter((item) => item.status === "active");
  const inactiveExams = filteredExams.filter(
    (item) => item.status === "inactive"
  );
  const completedExams = filteredExams.filter(
    (item) => item.status === "completed"
  );

  useEffect(() => {
    const handleExamDeleted = ({ examId }) => {
      toast.info("An exam was removed by the admin.");
      setExams((prev) => prev.filter((exam) => exam.examId?._id !== examId));
    };

    socket.on("examDeleted", handleExamDeleted);

    return () => {
      socket.off("examDeleted", handleExamDeleted);
    };
  }, []);

  const getRemainingTime = (toDateStr) => {
    const to = new Date(toDateStr);
    const now = new Date();

    if (isNaN(to.getTime()) || to <= now) return "Expired";

    const diffMs = to - now;

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s remaining`;
  };

  return (
    <div className="w-full h-full bg-aliceblue overflow-y-auto hide-scrollbar">
      <div className="w-full h-fit pb-2">
        <div className="w-full h-16 bg-white shadow-lg px-5 flex items-center justify-between">
          <input
            type="text"
            className="border border-gray-300 rounded-lg p-2 text-sm outline-none"
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-gray-300 text-gray-500 rounded-lg p-1 cursor-pointer outline-none"
            >
              <option value="all status">All status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="completed">Completed</option>
            </select>
            <div className="flex items-center gap-2">
              <FaCalendarAlt
                size={20}
                className="text-green-500 cursor-pointer"
                onClick={() => dateInputRef.current?.showPicker()}
              />
              <input
                type="date"
                ref={dateInputRef}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="sr-only"
              />
              {selectedDate && (
                <span className="text-sm text-gray-600 font-semibold ml-1">
                  {new Date(selectedDate).toLocaleDateString()}
                  <button
                    onClick={() => setSelectedDate("")}
                    className="ml-2 text-red-500 underline text-xs cursor-pointer"
                  >
                    Clear
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
        {activeExams.length === 0 &&
        inactiveExams.length === 0 &&
        completedExams.length === 0 && (
          <p className="text-center text-gray-500 text-md font-semibold py-10">
           No exams assigned
          </p>
        )}
        {activeExams.length > 0 && (
          <>
        <p className="text-gray-500 text-sm mt-4 font-semibold px-4">
          Active Exams
        </p>
        <div className="w-full h-fit grid grid-cols-2 items-center gap-5 px-4">
          {filteredExams
            .filter((item) => item.status === "active")
            .map((item, i) => (
              <div
                key={`upcoming-${i}`}
                className="w-full h-fit bg-white shadow-lg sm:p-2 md:p-2 mt-2 flex justify-center items-center sm:gap-1 xl:gap-3 rounded-lg"
              >
                <img
                  src={item.examId?.basicInfo?.coverPreview}
                  alt="Cover"
                  className="sm:w-20 sm:h-20 md:w-30 md:h-30 object-cover rounded"
                />
                <div className="w-[80%] h-fit">
                  <div className="flex flex-wrap justify-between items-center gap-5 text-lg font_primary font-semibold">
                    <p>{item.examId?.basicInfo?.title}</p>
                    <p
                      className={`px-2 py-1 rounded text-xs font-semibold capitalize justify-end ${
                        item.status === "active"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-500"
                      }`}
                    >
                      {item.status}
                    </p>
                  </div>
                  <div className="font_primary flex items-center gap-3 text-sm">
                    <p className="text-sm font-semibold text-gray-500">
                      Category: {item.examId?.basicInfo?.category}
                    </p>
                  </div>
                  <div className="flex items-center xl:gap-15">
                    <div>
                      <p className="text-sm text-gray-500">
                        Date of Exam:{" "}
                        {new Date(item.assignedAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Remaining Time:{" "}
                        {getRemainingTime(
                          item.examId?.settings?.availability?.timeLimitDays?.to
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-start ">
                    <p className="text-sm text-gray-500">
                      Assigned by: {item.assignedBy}
                    </p>
                    <button
                      className={`capitalize text-sm bg-green-500 text-white font-semibold p-2 rounded-lg cursor-pointer ${
                        item.status === "completed" ? "hidden" : "block"
                      }`}
                      onClick={() => {
                        navigate("/student/exam/instructions", {
                          state: { examId: item.examId._id },
                        });
                      }}
                    >
                      start exam
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
        </>
        )}
        {inactiveExams.length > 0 && (
          <>
        <p className="text-gray-500 text-sm mt-4 font-semibold px-4">
          Upcoming Exams
        </p>
        <div className="w-full h-fit grid grid-cols-2 items-center gap-5 px-4">
          {filteredExams
            .filter((item) => item.status === "inactive")
            .map((item, i) => (
              <div
                key={`upcoming-${i}`}
                className="w-full h-fit bg-white shadow-lg sm:p-2 md:p-2 mt-2 flex justify-center items-center sm:gap-1 xl:gap-3 rounded-lg"
              >
                <img
                  src={item.examId?.basicInfo?.coverPreview}
                  alt="Cover"
                  className="sm:w-20 sm:h-20 md:w-30 md:h-30 object-cover rounded"
                />
                <div className="w-[80%] h-fit">
                  <div className="flex flex-wrap justify-between items-center gap-5 text-lg font_primary font-semibold">
                    <p>{item.examId?.basicInfo?.title}</p>
                    <p
                      className={`px-2 py-1 rounded text-xs font-semibold capitalize justify-end ${
                        item.status === "active"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-500"
                      }`}
                    >
                      {item.status}
                    </p>
                  </div>
                  <div className="font_primary flex items-center gap-3 text-sm">
                    <p className="text-sm font-semibold text-gray-500">
                      Category: {item.examId?.basicInfo?.category}
                    </p>
                  </div>
                  <div className="flex items-center xl:gap-15">
                    <div>
                      <p className="text-sm text-gray-500 capitalize">
                        date of exam:{" "}
                        {new Date(item.assignedAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Remaining Time:{" "}
                        {getRemainingTime(
                          item.examId?.settings?.availability?.timeLimitDays?.to
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-start ">
                    <p className="text-sm text-gray-500">
                      Assigned by: {item.assignedBy}
                    </p>
                    <button
                      className={`capitalize text-sm bg-green-500 text-white font-semibold p-2 rounded-lg cursor-pointer ${
                        item.status === "inactive" ? "hidden" : "block"
                      }`}
                      onClick={() => {
                        navigate("/student/exam/instructions", {
                          state: { examId: item.examId._id },
                        });
                      }}
                    >
                      start exam
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </>
        )}
        {completedExams.length > 0 && (
          <>
        <p className="text-gray-500 text-sm mt-6 px-4 font-semibold">
          Completed Exams
        </p>
        <div className="w-full h-fit grid grid-cols-2 items-center gap-5 px-4">
          {filteredExams
            .filter((item) => item.status === "completed")
            .map((item, i) => (
              <div
                key={`completed-${i}`}
                className="w-full h-fit bg-white shadow-lg sm:p-2 md:p-2 mt-2 flex justify-center items-center sm:gap-1 xl:gap-3 rounded-lg"
              >
                <img
                  src={item.examId?.basicInfo?.coverPreview}
                  alt="Cover"
                  className="sm:w-20 sm:h-20 md:w-40 md:h-30 object-cover rounded"
                />
                <div className="w-[80%] h-fit">
                  <div className="flex flex-wrap justify-between items-center gap-5 text-lg font_primary font-semibold">
                    <p>{item.examId?.basicInfo?.title}</p>
                    <p className="px-2 py-1 rounded text-xs font-semibold capitalize justify-end bg-blue-200 text-blue-600">
                      {item.status}
                    </p>
                  </div>
                  <div className="font_primary flex items-center gap-3 text-sm">
                    <p className="text-sm font-semibold text-gray-500">
                      Category: {item.examId?.basicInfo?.category}
                    </p>
                  </div>
                  <div className="flex items-center xl:gap-10 mt-2">
                    <div>
                      <p className="text-sm text-gray-500 capitalize">
                        date of exam:{" "}
                        {new Date(item.assignedAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Remaining Time:{" "}
                        {getRemainingTime(
                          item.examId?.settings?.availability?.timeLimitDays?.to
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-500">
                        Score: {item.score !== null ? item.score : "--"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Result: {item.result}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-start ">
                    <p className="text-sm text-gray-500">
                      Assigned by: {item.assignedBy}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
        </>)}
      </div>
    </div>
  );
};

export default StudentExamPage;
