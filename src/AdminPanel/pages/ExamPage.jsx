import React, { useState, useEffect } from "react";
import axios from "axios";
import { GoPlus } from "react-icons/go";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import { IoIosClose } from "react-icons/io";

import ConfigureSettings from "../Components/CreateExam/ConfigureSettings";

import { useNavigate } from "react-router-dom";
import { LuExternalLink } from "react-icons/lu";

const ExamPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("all status");
  const [exam, setExam] = useState([]);
  const [isOpen, setisOpen] = useState(false);
  const [id, setId] = useState("");
  const [search, setSearch] = useState("");

  const fetchExams = () => {
    axios
      .get("http://localhost:3000/getexam")
      .then((res) => {
        const today = new Date().toISOString().split("T")[0];

        const updatedExams = res.data.map((exam) => {
          const { from, to } = exam.settings.availability.timeLimitDays || {};

          let isActive = false;

          if (from && to && !isNaN(new Date(from)) && !isNaN(new Date(to))) {
            const fromDate = new Date(from).toISOString().split("T")[0];
            const toDate = new Date(to).toISOString().split("T")[0];

            isActive = today >= fromDate && today <= toDate;
          }

          return {
            ...exam,
            status: isActive ? "active" : "inactive",
          };
        });

        setExam(updatedExams);
      })
      .catch((err) => console.log(err));
  };
  console.log(exam);

  useEffect(() => {
    fetchExams();
  }, [isOpen, id]);

  const deleteExam = (id) => {
    axios
      .delete(`http://localhost:3000/deleteexam/${id}`)
      .then((res) => {
        console.log("Deleted:", res.data);
        fetchExams();
      })
      .catch((err) => console.log(err));
  };

  const filteredExams = exam.filter(
    (e) =>
      (status === "all status" || e.status === status) &&
      e.basicInfo.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full h-full bg-aliceblue flex gap-5 overflow-y-auto hide-scrollbar">
      <div className="w-full h-full">
        <div className="w-full h-16 bg-white shadow-lg flex items-center justify-between px-4">
          <button
            className="bg-green-500 p-2 rounded-sm flex items-center gap-1 cursor-pointer text-aliceblue"
            onClick={() => {
              navigate("/exam/create-exam");
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
        {filteredExams?.map((item, i) => {
          return (
            <div
              key={i}
              className="w-full h-fit bg-white shadow-lg sm:p-2 md:p-5 flex justify-evenly items-center sm:gap-1 xl:gap-2 border-t-1 border-gray-300"
            >
              <img
                src={`http://localhost:3000/public${item.basicInfo.coverPreview}`}
                alt="Cover"
                className="sm:w-20 sm:h-20 md:w-30 md:h-20 object-cover rounded"
              />
              <div>
                <div className="flex items-center justify-between text-lg font_primary font-semibold">
                  <p className="flex items-center gap-2">
                    {item.basicInfo.title}{" "}
                    <LuExternalLink
                      className="cursor-pointer"
                      color="green"
                      onClick={() => navigate(`/exam/takenlist/${item._id}`)}
                    />
                  </p>{" "}
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
                <div className="font_primary text-sm font-semibold text-gray-500 flex items-center lg:gap-1 overflow-x-auto">
                  <p>{item.basicInfo.category} |</p>
                  <p>
                    Exam Taken Times: {item.settings.examTakenTimes.multiple} |
                  </p>
                  <p>
                    Total Points:{" "}
                    {item.settings.results.displayScore.totalPoints} |
                  </p>
                  <p className="sm:hidden md:block">
                    Questions Count: {item.questionsCount} |
                  </p>
                  <p className="sm:hidden md:block">
                    Late Time: {item.settings.availability.lateTime} sec |
                  </p>
                  <p className="sm:hidden xl:block">
                    Students Count:{" "}
                    {item.settings.assignExamTo.specificUsersCount} |
                  </p>
                  <p className="sm:hidden xl:block">
                    Pass Percentage:{" "}
                    {item.settings.results.displayScore.passPercentage}%{" "}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-sm font_primary text-green-500 mt-5">
                  <div className="gap-1 sm:hidden md:flex">
                    <p className="text-gray-500">
                      Open: {item.settings.availability.timeLimitDays.from}
                    </p>
                    <p className="text-gray-500">
                      - {item.settings.availability.timeLimitDays.to}
                    </p>
                  </div>
                  <p
                    className="md:ml-30 hover:underline cursor-pointer"
                    onClick={() => navigate(`/exam/exam-questions/${item._id}`)}
                  >
                    Questions
                  </p>{" "}
                  |<p className="hover:underline cursor-pointer"
                    onClick={() => navigate(`/exam/statistics/${item._id}`)}>Statistics</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-5 pl-2 sm:pr-1 md:pr-0 border-l-1 border-gray-500">
                <FaRegEdit
                  className="cursor-pointer"
                  color="blue"
                  onClick={() => {
                    setisOpen(true);
                    setId(item._id);
                  }}
                />
                <MdOutlineDelete
                  className="cursor-pointer"
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
  );
};

export default ExamPage;

const UpdatePage = ({ setisOpen, ConfigureSettings, id, isOpen }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/20 backdrop-blur-[1px] flex justify-center items-center z-50">
      <div className="relative bg-white rounded-xl shadow-lg p-4 w-[80%] max-h-[90vh] hide-scrollbar overflow-y-auto">
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
