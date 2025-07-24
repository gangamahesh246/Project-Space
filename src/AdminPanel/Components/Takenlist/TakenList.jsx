import React, { useState, useEffect, Suspense } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Download } from "lucide-react";
import qs from "qs";
import { useLocation } from "react-router-dom";
import axiosInstance from "../../../utils/axiosInstance";
import axiosStudent from "../../../utils/axiosStudent";
import axios from "axios";

const TakenList = () => {
  const location = useLocation();
  const { id, title } = location.state || "";

  const [isActive, setIsActive] = useState("completed");
  const [studentMails, setStudentMails] = useState(null);
  const [unfinshedMails, setUnfinshedMails] = useState(null);
  const [studentIds, setStudentIds] = useState([]);
  const [attempts, setAttempts] = useState([]);

  const buttonClass = (type) =>
    isActive === type ? "bg-green-500 text-white" : "bg-gray-100 text-gray-700";

  const renderActiveComponent = () => {
    switch (isActive) {
      case "completed":
        return <Completed attempts={attempts} examId={id} />;
      case "unfinished":
        return <Unfinished unfinshedMails={unfinshedMails} saveAs={saveAs} Download={Download} />;
      case "rankings":
        return <Rankings />;
      default:
        return <Completed />;
    }
  };

  useEffect(() => {
    if (!id || id.length !== 24) {
      console.error("Invalid or missing examId:", examId);
      return;
    }
    axiosInstance
      .get("/getexamdetails", { params: { examId: id } })
      .then((res) => {
        setStudentMails(res.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [id]);

  useEffect(() => {
    if (!studentMails) return;

    axiosStudent
      .get("/getstudentIds", {
        params: {
          student_mails: studentMails,
        },
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: "repeat" }),
      })
      .then((res) => {
        setStudentIds(res.data.map((student) => student.id));
      })
      .catch((err) => console.log("ERROR:", err.response?.data || err.message));
  }, [studentMails]);

  useEffect(() => {
    if (studentIds.length === 0 || !id) return;

    axios
      .get("http://localhost:3000/studentattempts", {
        params: {
          student_id: studentIds,
          examId: id,
        },
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: "repeat" }),
      })
      .then((response) => {
        setAttempts(response.data);
      })
      .catch((error) => {
        console.error(
          "Error fetching student attempts:",
          error?.response?.data || error
        );
      });
  }, [studentIds, id]);

  const unfinished = attempts.filter((a) => !a.lastAttemptStats).map((a) => a.student_id);

  useEffect(() => {
  if (!unfinished || unfinished.length === 0) return;

  axiosStudent
    .get("/getstudentmails", {
      params: {
        student_ids: unfinished,
      },
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: "repeat" }),
    })
    .then((res) => {
      setUnfinshedMails(res.data.map((student) => student.mail));
    })
    .catch((err) =>
      console.log("ERROR:", err.response?.data || err.message)
    );
}, [unfinished]);

  return (
    <div className="w-full h-full bg-white overflow-y-auto hide-scrollbar p-2">
      <div className="flex items-center h-10 w-full text-sm text-gray-500 gap-3 p-2">
        <p>Exams &gt;</p>
        <p className="text-black">({title})</p>
        <p className="text-black">Taken List</p>
      </div>
      <div className="bg-white h-fit w-full rounded-lg overflow-y-auto shadow-2xl">
        <div className="flex items-center h-12 w-full border-b-2 border-gray-200 gap-3 p-2 text-sm font-semibold">
          <button
            className={`rounded-lg cursor-pointer px-4 py-2 ${buttonClass(
              "completed"
            )}`}
            onClick={() => setIsActive("completed")}
          >
            Completed {1}
          </button>
          <button
            className={`rounded-lg cursor-pointer px-4 py-2 ${buttonClass(
              "unfinished"
            )}`}
            onClick={() => setIsActive("unfinished")}
          >
            Unfinished {0}
          </button>
          <button
            className={`rounded-lg cursor-pointer px-4 py-2 ${buttonClass(
              "rankings"
            )}`}
            onClick={() => setIsActive("rankings")}
          >
            Rankings
          </button>
        </div>
        <Suspense fallback="Loading...">{renderActiveComponent()}</Suspense>
      </div>
    </div>
  );
};

export default TakenList;

const Completed = ({ attempts, examId }) => {
  const formatCustomDate = (iso) => {
    const date = new Date(iso);
    const options = { timeZone: "Asia/Kolkata", hour12: true };
    const parts = date.toLocaleString("en-US", {
      ...options,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const [mdy, time, period] = parts.split(/[\s,]+/);
    const [month, day, year] = mdy.split("/");
    return `${year}-${month}-${day} ${time} ${period}`;
  };

  const getDurationHHMMSS = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate - startDate;

    const totalSeconds = Math.floor(diffMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num) => String(num).padStart(2, "0");

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };
  
  const sorted = [...attempts]
  .filter((a) => a.lastAttemptStats)
  .sort(
    (a, b) =>
      (b.lastAttemptStats.score || 0) - (a.lastAttemptStats.score || 0)
  )
  .map((item, index) => ({
    ...item,
    lastAttemptStats: {
      ...item.lastAttemptStats,
      rank: index + 1,
    },
  }));

 useEffect(() => {
  if (sorted.length === 0) return;

  const payload = sorted.map((item) => ({
    student_id: item.student_id,
    exam_id: examId,
    rank: item.lastAttemptStats.rank,
  }));

  axios
    .put("http://localhost:3000/rank", payload)
    .then(() => console.log(""))
    .catch((err) => console.error("Failed to update ranks", err));
}, [examId]);

const handleDownloadAttempts = () => {
  const dataToExport = sorted
    .filter((attempt) => attempt.lastAttemptStats)
    .map((attempt, index) => {
      const stats = attempt.lastAttemptStats;

      return {
        SNo: index + 1,
        Email: stats?.student_mail || "Not Attempted",
        Score: stats?.score ?? "N/A",
        Rank: stats?.rank || 0,
      };
    });

  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Attempt Details");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const file = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(file, "Completed_Students.xlsx");
};

  return (
    <div className="w-full h-full p-2 flex flex-col gap-5">
      <div className="h-fit flex justify-between items-center">
        <input
          type="text"
          className="border border-gray-300 rounded-lg p-2 text-sm"
          placeholder="Search"
        />
        <Download size={20} onClick={handleDownloadAttempts} className='w-8 h-8 p-2 rounded bg-amber-300 text-gray-600 cursor-pointer' />
      </div>
      <div>
        <table className="w-full border-collapse text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr className="[&>th]:p-2 [&>th]:font-semibold text-center">
              <th>#</th>
              <th>Candidates</th>
              <th>Score</th>     
              <th>Scoring rank</th>
              <th>Start time</th>     
              <th>Last operation time</th>     
              <th>Time spend</th> 
            </tr>
          </thead>
          <tbody className="text-gray-600">
            {sorted
            .filter((attempt) => attempt.lastAttemptStats)
            .map((attempt, index) => {
              const stats = attempt.lastAttemptStats;

              return (
                <tr
                  key={attempt.student_id}
                  className="border-b [&>td]:p-2 text-center"
                >
                  <td>{index + 1}</td>      
                  <td>{stats?.student_mail || "Not Attempted"}</td>     
                  <td>{stats?.score ?? "N/A"}</td>    
                  <td>{stats?.rank || 0}</td>       
                  <td>
                    {stats ? formatCustomDate(stats.attemptStart) : "N/A"}
                  </td>
                  <td>{stats ? formatCustomDate(stats.attemptEnd) : "N/A"}</td> 
                  <td>
                    {stats
                      ? getDurationHHMMSS(stats.attemptStart, stats.attemptEnd)
                      : "N/A"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Unfinished = ({unfinshedMails, Download, saveAs}) => {
  if (!unfinshedMails || unfinshedMails.length === 0) {
    return (
      <div className="w-full h-full p-2 flex justify-center items-center">
        <p className="text-gray-500">No unfinished candidates.</p>
      </div>
    );
  }

  const handleDownload = () => {
  const data = unfinshedMails.map((mail, index) => ({
    SNo: index + 1,
    Email: mail,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Unfinished Mails");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const file = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(file, "Unfinished_Students.xlsx");
};
  return (
    <div className="w-full h-full p-2 flex flex-col gap-5">
      <div className="h-fit flex justify-between items-center">
        <input
          type="text"
          className="border border-gray-300 rounded-lg p-2 text-sm"
          placeholder="Search"
        />
        <Download size={20} onClick={handleDownload} className='w-8 h-8 p-2 rounded bg-amber-300 text-gray-600 cursor-pointer' />
      </div>
      <div>
        <table className="w-full border-collapse text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr className="[&>th]:p-2 [&>th]:font-semibold text-center">
              <th>#</th>
              <th>Candidates</th> 
            </tr>
          </thead>
          <tbody className="text-gray-600">
            <tr className="border-b [&>td]:p-2 text-center">
              {unfinshedMails.map((mail, index) => (
                <>
                <td>{index + 1}</td>
                <td key={index}>{mail}</td>
                </>
              ))}  
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Rankings = () => {
  return (
    <div className="w-full h-full p-2 flex flex-col justify-center items-center gap-5 ">
      <div className="w-1/2 h-30 flex justify-between items-center rounded p-2 shadow-2xl">
        <p>Mahesh</p>
        <p>100 points</p>
      </div>
    </div>
  );
};
