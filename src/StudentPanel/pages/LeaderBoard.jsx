import React, { useState, useEffect } from "react";
import axiosStudent from "../../utils/axiosStudent";
import { useDispatch, useSelector } from "react-redux";
import { Award } from "lucide-react";
import axios from "axios";

const LeaderBoard = () => {
  const student = useSelector((state) => state.student.user);

  const [technology, setTechnology] = useState("");
  const [studentId, setStudentId] = useState(null);
  const [leaderBoardData, setLeaderBoardData] = useState([]);
  const [active, setActive] = useState("global");

  useEffect(() => {
    if (!student.college_mail) return;

    axios
      .get(`${import.meta.env.VITE_Base_URL}/getstudentId`, {
        params: {
          student_mail: student.college_mail,
        },
      })
      .then((response) => {
        setStudentId(response.data.studentId);
      })
      .catch((error) => {
        console.error("Error fetching student ID:", error);
      });
  }, [student.college_mail]);

  useEffect(() => {
    if (!student.college_mail) return;

    axios
      .get(`${import.meta.env.VITE_Base_URL}/student/gettechnology`, {
        params: { email: student.college_mail },
      })
      .then((res) => {
        setTechnology(res.data.technology);
      })
      .catch((error) => {
        console.error("Error:", error.response?.data || error.message);
      });
  }, [student.college_mail]);

  useEffect(() => {
    axiosStudent
      .get("/leaderboard")
      .then((response) => {
        setLeaderBoardData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching leaderboard data:", error);
      });
  }, [student.college_mail]);

  const filteredData =
    active === "global"
      ? leaderBoardData
      : leaderBoardData.filter((entry) => entry.technology === technology);

  return (
    <div className="w-full h-full bg-gray-100 p-3">
      <div className="w-full h-13 bg-white shadow-sm rounded flex items-center gap-2">
        <button
          onClick={() => setActive("global")}
          className={`${
            active === "global"
              ? "bg-amber-400 text-white"
              : "bg-white text-amber-500 border-2 border-amber-400"
          } font-bold py-2 px-8 rounded ml-2 transition cursor-pointer`}
        >
          Global
        </button>
        <button
          onClick={() => setActive("technology")}
          className={`${
            active === "technology"
              ? "bg-amber-400 text-white"
              : "bg-white text-amber-500 border-2 border-amber-400 focus:outline-none"
          } font-bold py-2 px-8 rounded transition cursor-pointer`}
        >
          Technology
        </button>
      </div>
      <h1 className="text-2xl text-amber-500 font-bold mb-4 mt-4 focus:outline-none">
        LeaderBoard
      </h1>
      {active === "global" ? (
        <GlobalLeaderBoard
          leaderBoardData={filteredData}
          Award={Award}
          college_mail={student.college_mail}
          studentId={studentId}
        />
      ) : (
        <TechWiseLeaderBoard
          leaderBoardData={filteredData}
          Award={Award}
          college_mail={student.college_mail}
        />
      )}
    </div>
  );
};

export default LeaderBoard;

const GlobalLeaderBoard = ({
  leaderBoardData,
  Award,
  college_mail,
  studentId,
}) => {
  return (
    <div className="bg-white rounded shadow p-4 overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="border-b text-amber-500">
            <th className="py-2">#</th>
            <th className="py-2">Student Mail</th>
            <th className="py-2">Technology</th>
            <th className="py-2">Average Score</th>
            <th className="py-2 flex items-center gap-1">
              Rank
              <Award className="w-5 h-5" />
            </th>
          </tr>
        </thead>
        <tbody>
          {leaderBoardData.map((entry, index) => {
            const isCurrentStudent = entry.student_mail === college_mail;

            if (isCurrentStudent) {
              axios
                .post(`${import.meta.env.VITE_Base_URL}/globalrank`, {
                  student_id: studentId,
                  rank: index + 1,
                  totalstudents: leaderBoardData.length,
                })
                .catch((err) => {
                  console.error(
                    "Error posting global rank:",
                    err.response?.data || err.message
                  );
                });
            }

            return (
              <tr
                key={entry._id}
                className={`border-b border-gray-300 text-sm hover:bg-gray-50 ${
                  isCurrentStudent
                    ? "font-bold bg-amber-50 text-amber-400"
                    : "hover:bg-gray-50"
                }`}
              >
                <td className="py-2 px-1">{index + 1}</td>     
                <td className="py-2 px-1">{entry.student_mail}</td> 
                <td className="py-2 px-1">{entry.technology}</td> 
                <td className="py-2 px-1 font-semibold">{entry.score}</td> 
                <td className="py-2 px-1 font-semibold">{index + 1}</td> 
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const TechWiseLeaderBoard = ({ leaderBoardData, Award, college_mail }) => {
  return (
    <div className="bg-white rounded shadow p-4 overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="border-b text-amber-500">
            <th className="py-2 px-2">#</th>
            <th className="py-2 px-2">Student Mail</th>
            <th className="py-2 px-2">Technology</th>
            <th className="py-2 px-2">Average Score</th>
            <th className="py-2 px-2 flex items-center gap-1">
              Rank <Award className="w-5 h-5" />
            </th>
          </tr>
        </thead>
        <tbody>
          {leaderBoardData.map((entry, index) => {
            const isCurrentStudent = entry.student_mail === college_mail;

            return (
              <tr
                key={entry._id}
                className={`border-b border-gray-300 text-sm ${
                  isCurrentStudent
                    ? "font-bold bg-amber-50 text-amber-400"
                    : "hover:bg-gray-50"
                }`}
              >
                <td className="py-2 px-2">{index + 1}</td>
                <td className="py-2 px-2">{entry.student_mail}</td>
                <td className="py-2 px-2">{entry.technology}</td>
                <td className="py-2 px-2 font-semibold">{entry.score}</td>
                <td className="py-2 px-2 font-semibold">{index + 1}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
