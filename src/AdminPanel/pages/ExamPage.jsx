import React, { useState, useEffect } from "react";
import { GoPlus } from "react-icons/go";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import { IoIosClose } from "react-icons/io";

import ConfigureSettings from "../Components/CreateExam/ConfigureSettings";
import axiosInstance from "../../utils/axiosInstance";

import { useNavigate } from "react-router-dom";
import { LuExternalLink } from "react-icons/lu";
import { toast } from "react-toastify";
import socket from "../../utils/socket";

const ExamPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("all status");
  const [exam, setExam] = useState([]);
  const [isOpen, setisOpen] = useState(false);
  const [id, setId] = useState("");
  const [search, setSearch] = useState("");

  const fetchExams = () => {
    axiosInstance
      .get("/getexam")
      .then((res) => {
        const updatedExams = res.data?.map((exam) => {
          const availability = exam?.settings?.availability || {};
          const { timeLimitDays = {}, timeLimitHours = {} } = availability;

          const now = new Date();
          const { from, to } = timeLimitDays;
          const { from: timeFrom, to: timeTo } = timeLimitHours;

          let status = "inactive";

          if (from && to) {
            const fromDate = new Date(from);
            const toDate = new Date(to);

            if (now >= fromDate && now <= toDate) {
              if (timeFrom && timeTo) {
                const [fromHours, fromMinutes] = timeFrom
                  .split(":")
                  .map(Number);
                const [toHours, toMinutes] = timeTo.split(":").map(Number);

                const start = new Date(now);
                start.setHours(fromHours, fromMinutes, 0, 0);

                const end = new Date(now);
                end.setHours(toHours, toMinutes, 59, 999);

                if (now >= start && now <= end) {
                  status = "active";
                }
              } else {
                status = "active";
              }
            }
          }

          return {
            ...exam,
            status,
          };
        });

        setExam(updatedExams);
      })
      .catch((error) =>
        toast.error(error?.response?.data?.message || error.message)
      );
  };

  useEffect(() => {
    fetchExams();
  }, [isOpen, id, exam]);

  const deleteExam = (id) => {
    axiosInstance
      .delete(`/deleteexam/${id}`)
      .then((res) => {
        toast.success(res.data.message);

        socket.emit("deleteExamFromStudents", { examId: id });
        fetchExams();
      })
      .catch((error) =>
        toast.error(error?.response?.data?.message || error.message)
      );
  };

  const filteredExams = exam.filter(
    (e) =>
      (status === "all status" || e.status === status) &&
      e.basicInfo.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full h-full bg-white flex gap-5 overflow-y-auto hide-scrollbar">
      <div className="w-full h-full">
        <div className="w-full h-16 bg-white shadow-lg flex items-center justify-between px-4">
          <button
            className="bg-[#C3E76D] px-2 py-3 rounded-sm text-sm flex items-center gap-1 cursor-pointer text-gray-700"
            onClick={() => {
              navigate("/admin/exam/create-exam");
            }}
          >
            <GoPlus size={20} /> <p className="sm:hidden md:block">New exam</p>
          </button>
          <div className="flex items-center gap-2">
            <input
              type="text"
              className="border border-gray-300 rounded-lg p-2 text-sm outline-none"
              placeholder="Search"
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-gray-300 text-gray-500 rounded-lg p-2 cursor-pointer outline-none"
            >
              <option value="all status">All status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div className="w-full h-fit sm:grid sm:grid-cols-1 xl:grid-cols-2 bg-gray-100 items-center sm:gap-2 xl:gap-3 sm:px-4 md:px-30 xl:px-5 xl:pb-4 lg:px-35">
          {filteredExams?.map((item, i) => {
            return (
              <div
                key={i}
                className="w-full h-fit bg-white shadow-sm hover:shadow-md p-2 mt-2 flex items-center sm:gap-2 md:gap-3 xl:gap-5 rounded-lg"
              >
                <img
                  src={item.basicInfo.coverPreview}
                  alt="Cover"
                  className="w-30 h-30 object-cover rounded"
                />
                <div>
                  <div className="flex items-center justify-between text-lg font_primary font-semibold">
                    <p className="flex items-center gap-2">
                      {item.basicInfo.title}{" "}
                      <LuExternalLink
                        className="cursor-pointer"
                        color="green"
                        onClick={() =>
                          navigate("/admin/exam/takenlist", {
                            state: {
                              id: item._id,
                              title: item.basicInfo.title,
                            },
                          })
                        }
                      />
                    </p>
                    <p
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        item.status === "active"
                          ? "text-green-500 bg-green-100"
                          : "text-red-500 bg-red-100"
                      }`}
                    >
                      {item.status === "active" ? "Active" : "In Active"}
                    </p>
                  </div>
                    <p className="font_primary text-sm text-gray-500">
                      Category: {item.basicInfo.category}
                    </p>
                  <div className={`flex items-center ${item.settings?.answerTimeControl?.examTime ? "sm:gap-5 xl:gap-25" : "sm:gap-5 xl:gap-15" } text-sm font_primary text-green-600`}>
                    <p className="text-gray-500 text-sm font-primary">{item.settings?.answerTimeControl?.examTime ? `Duration: ${item.settings?.answerTimeControl?.examTime} min` : `Duration: ${item.settings?.answerTimeControl?.questionTime} sec/question`}</p>
                    <div className="flex items-center gap-1">
                    <p
                    className="hover:underline cursor-pointer"
                    onClick={() =>
                      navigate(`/admin/exam/exam-questions/${item._id}`)
                    }
                  >
                    Questions
                  </p>{" "}
                  |
                  <p
                    className="hover:underline cursor-pointer"
                    onClick={() =>
                      navigate(`/admin/exam/statistics/${item._id}`)
                    }
                  >
                    Statistics
                  </p>
                  </div>
                  </div>
                    <div className="gap-1 mt-4 text-sm font_primary md:flex">
                      <p className="text-gray-500">
                        Open:{" "}
                        {item.settings?.availability?.timeLimitDays?.from
                          ? `${new Date(
                              item.settings.availability.timeLimitDays.from
                            ).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })} at ${new Date(
                              item.settings.availability.timeLimitDays.from
                            ).toLocaleTimeString("en-GB", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}`
                          : "N/A"}
                      </p>

                      <p className="text-gray-500">
                        -{" "}
                        {item.settings?.availability?.timeLimitDays?.to
                          ? `${new Date(
                              item.settings.availability.timeLimitDays.to
                            ).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })} at ${new Date(
                              item.settings.availability.timeLimitDays.to
                            ).toLocaleTimeString("en-GB", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}`
                          : "N/A"}
                      </p>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-5 pl-2 sm:pr-1 md:pr-0 border-l-1 border-gray-300">
                  {item.settings?.availability?.timeLimitDays?.from && (
                    <FaRegEdit
                      className={`cursor-pointer ${
                        new Date(item.settings.availability.timeLimitDays.to) <
                        new Date()
                          ? "opacity-50 cursor-not-allowed pointer-events-none"
                          : ""
                      }`}
                      color="blue"
                      onClick={() => {
                        if (
                          new Date(
                            item.settings.availability.timeLimitDays.to
                          ) >= new Date()
                        ) {
                          setisOpen(true);
                          setId(item._id);
                        }
                      }}
                    />
                  )}

                  <MdOutlineDelete
                    className="cursor-pointer w-fit h-fit"
                    color="red"
                    onClick={() => deleteExam(item._id)}
                  />
                </div>
                {isOpen && (
                  <UpdatePage
                    setisOpen={setisOpen}
                    ConfigureSettings={ConfigureSettings}
                    id={id}
                    isOpen={isOpen}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExamPage;

const UpdatePage = ({ setisOpen, ConfigureSettings, id, isOpen }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-transparent backdrop-blur-[1px] flex justify-center items-center z-50">
      <div className="relative bg-white p-4 w-[80%] max-h-[90vh] hide-scrollbar overflow-y-auto">
        <button
          onClick={() => setisOpen(!isOpen)}
          className="absolute cursor-pointer top-2 right-4 text-lg"
        >
          <IoIosClose size={30} color="red" />
        </button>
        <ConfigureSettings id={id} isOpen={isOpen} setisOpen={setisOpen} />
      </div>
    </div>
  );
};
