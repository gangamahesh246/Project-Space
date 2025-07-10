import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosStudent from "../../utils/axiosStudent";
import { toast } from "react-toastify";
import { Outlet, useNavigate } from "react-router-dom";
import { FaCalendarAlt } from "react-icons/fa";
import { useRef } from "react";
import socket from "../../utils/socket";

const StudentExamPage = () => {
  const navigate = useNavigate();
  const dateInputRef = useRef(null);
  const StudentMail = useSelector((state) => state.student.user.college_mail);

  const [studentId, setStudentId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [exams, setExams] = useState([]);
  const [status, setStatus] = useState("all status");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!StudentMail) return;

    axiosStudent
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

  useEffect(() => {
    socket.on("examDeleted", ({ examId }) => {
      setExams((prev) => prev.filter((exam) => exam.examId?._id !== examId));
    });

    return () => {
      socket.off("examDeleted");
    };
  }, []);

  const getExamStatus = (
    from,
    to,
    currentStatus,
    timeFrom,
    timeTo,
    lateTime
  ) => {
    const now = new Date();

    if (currentStatus === "completed") return "completed";

    if (from && to) {
      const fromDate = new Date(from);
      const toDate = new Date(to);

      if (
        !isNaN(fromDate) &&
        !isNaN(toDate) &&
        now >= fromDate &&
        now <= toDate
      ) {
        if (timeFrom && timeTo) {
          const [fromHours, fromMinutes] = timeFrom.split(":").map(Number);
          const [toHours, toMinutes] = timeTo.split(":").map(Number);

          const start = new Date(now);
          start.setHours(fromHours, fromMinutes, 0, 0);

          const end = new Date(now);
          end.setHours(toHours, toMinutes, 59, 999);

          if (lateTime && !isNaN(parseInt(lateTime))) {
            const lateLimit = new Date(
              start.getTime() + parseInt(lateTime) * 60000
            );

            if (now >= start && now <= end) {
              return now <= lateLimit ? "active" : "late";
            }

            if (now > end) return "expired";
            return "inactive";
          }

          if (now >= start && now <= end) return "active";
          if (now > end) return "expired";
          return "inactive";
        }
        return "active";
      }
    }
    return "inactive";
  };

  useEffect(() => {
    const fetchAndUpdateExams = async () => {
      try {
        const res = await axiosStudent.get("/student", {
          params: { student_id: studentId },
        });

        const updatedExams = await Promise.all(
          res.data?.exams?.map(async (exam) => {
            const availability = exam?.examId?.settings?.availability || {};
            const timeLimitDays = availability.timeLimitDays || {};
            const timeActive = availability.timeLimitHours || {};
            const lateTime = availability.lateTime;

            const { from, to } = timeLimitDays;
            const { from: timeFrom, to: timeTo } = timeActive;

            const status = getExamStatus(
              from,
              to,
              exam.status,
              timeFrom,
              timeTo,
              lateTime
            );

            if (exam.status !== status && exam?.examId?._id) {
              try {
                await axiosStudent.post("/status", {
                  examId: exam.examId._id,
                  status,
                  student_id: studentId,
                });
              } catch (err) {
                console.error("Failed to update status:", err);
              }
            }

            return {
              ...exam,
              status,
            };
          })
        );

        setExams(updatedExams);
      } catch (error) {
        toast.error(error?.response?.data?.message || error.message);
      }
    };

    if (studentId && typeof studentId === "string" && studentId.length === 24) {
      fetchAndUpdateExams();
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

  const activeOrLateExams = filteredExams.filter(
    (item) => item.status === "active" || item.status === "late"
  );

  const inactiveExams = filteredExams.filter(
    (item) => item.status === "inactive" || item.status === "expired"
  );
  const completedExams = filteredExams.filter(
    (item) => item.status === "completed"
  );

  const convertTo12Hour = (timeStr) => {
    const [hourStr, minuteStr] = timeStr.split(":");
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute.toString().padStart(2, "0")} ${ampm}`;
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
              <option value="late">Late</option>
              <option value="expired">Expired</option>
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
        {activeOrLateExams.length === 0 &&
          inactiveExams.length === 0 &&
          completedExams.length === 0 && (
            <p className="text-center text-gray-500 text-md font-semibold py-10">
              No exams assigned
            </p>
          )}
        {activeOrLateExams.length > 0 && (
          <>
            <p className="text-gray-500 text-sm mt-4 font-semibold px-4">
              Active Exams
            </p>
            <div className="w-full h-fit grid grid-cols-2 items-center gap-5 px-4">
              {activeOrLateExams.map((item, i) => (
                <div
                  key={`upcoming-${i}`}
                  className="w-full h-fit bg-white shadow-sm hover:shadow-lg sm:p-2 md:p-2 mt-2 flex justify-center items-center sm:gap-1 xl:gap-3 rounded-lg"
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
                          item.status === "late"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-green-100 text-green-600"
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
                    <div className="flex flex-col">
                      <div>
                        <p className="text-sm text-gray-500">
                          Date of Exam:{" "}
                          {new Date(
                            item.examId?.settings.availability.timeLimitDays.from
                          ).toLocaleDateString()}{" "}
                          -{" "}
                          {new Date(
                            item.examId?.settings.availability.timeLimitDays.to
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500">
                        Active Time:{" "}
                        {convertTo12Hour(item.examId?.settings?.availability?.timeLimitHours
                          ?.from) || "--"}{" "}
                        - {" "}
                        {convertTo12Hour(item.examId?.settings?.availability?.timeLimitHours
                          ?.to) || "--"}
                      </p>
                    </div>
                    <div className="flex justify-between items-start ">
                      <p className="text-sm text-gray-500">
                        Assigned by: {item.assignedBy}
                      </p>
                      <button
                        className={`capitalize text-sm bg-green-500 text-white font-semibold p-2 rounded-lg cursor-pointer ${
                          item.status === "completed" || item.status === "late"
                            ? "opacity-100 cursor-not-allowed"
                            : "block"
                        }`}
                        disabled={
                          item.status === "completed" || item.status === "late"
                        }
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
            <p className="capitalize text-gray-500 text-sm mt-4 font-semibold px-4">
              Upcoming / expired exams
            </p>
            <div className="w-full h-fit grid grid-cols-2 items-center gap-5 px-4">
              {inactiveExams.map((item, i) => (
                <div
                  key={`upcoming-${i}`}
                  className="w-full h-fit bg-white shadow-sm hover:shadow-lg sm:p-2 md:p-2 mt-2 flex justify-center items-center sm:gap-1 xl:gap-3 rounded-lg"
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
                          item.status === "expired"
                            ? "bg-yellow-100 text-yellow-600"
                            : item.status === "inactive"
                            ? "bg-red-100 text-red-600"
                            : ""
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
                    <div className="flex flex-col">
                      <div>
                        <p className="text-sm text-gray-500 capitalize">
                          date of exam:{" "}
                          {new Date(item.assignedAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">
                        Active Time:{" "}
                        {convertTo12Hour(item.examId?.settings?.availability?.timeLimitHours
                          ?.from) || "--"}{" "}
                        - {" "}
                        {convertTo12Hour(item.examId?.settings?.availability?.timeLimitHours
                          ?.to) || "--"}
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
          </>
        )}
        {completedExams.length > 0 && (
          <>
            <p className="text-gray-500 text-sm mt-6 px-4 font-semibold">
              Completed Exams
            </p>
            <div className="w-full h-fit grid grid-cols-2 items-center gap-5 px-4">
              {completedExams.map((item, i) => (
                <div
                  key={`completed-${i}`}
                  className="w-full h-fit bg-white shadow-sm hover:shadow-lg sm:p-2 md:p-2 mt-2 flex justify-center items-center sm:gap-1 xl:gap-3 rounded-lg"
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
                      </div>
                      {item.examId?.settings?.results?.displayScore.enabled && (
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-500">
                            Score: {item.score !== null ? item.score : "--"}
                          </p>
                          <p className="text-sm text-gray-500">
                            Result: {item.result}
                          </p>
                        </div>
                      )}
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
          </>
        )}
      </div>
    </div>
  );
};

export default StudentExamPage;
