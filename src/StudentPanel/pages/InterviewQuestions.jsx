import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MdCancel } from "react-icons/md";
import axiosStudent from "../../utils/axiosStudent";
import { useNavigate } from "react-router-dom";

const InterviewQuestions = () => {
  const navigate = useNavigate();

  const student = useSelector((state) => state.student.user);

  const [studentId, setStudentId] = useState(null);
  const [technology, setTechnology] = useState("");
  const [interviewQuestions, setInterviewQuestions] = useState(null);

  useEffect(() => {
    if (!student.college_mail) return;

    axiosStudent
      .get("/getstudentId", {
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
    axiosStudent
      .get("/student/gettechnology/", {
        params: { email: student.college_mail },
      })
      .then((res) => {
        const data = res?.data;
        setTechnology(data.technology);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [studentId]);

  useEffect(() => {
    axiosStudent.get("/interview-questions", {
      params: {
        technology: technology
      }
    }).then((res) => {
      if (res.data.length === 0) {
        toast.info("No interview questions available for this technology.");
      }
      else {
        setInterviewQuestions(res.data[0].questions);
      }
    }).catch((err) => {
      console.error("Error fetching interview questions:", err);
    });
  }, [technology]);

  if (!technology) {
    return (
      <div className="absolute top-0 left-0 w-full h-full bg-black/30 backdrop-blur-[0.5px] flex justify-center items-center z-50">
        <div className="relative bg-white p-8 text-center rounded-lg shadow-lg w-[90%] max-w-md">
          <button
            className="absolute top-2 right-2 text-amber-500 text-xl cursor-pointer"
            onClick={() => navigate("/student/dashboard")} 
          >
          <MdCancel />  
          </button>
          <p className="text-lg font-semibold text-gray-800">
          ⚠️ Please complete your profile to continue.   
          </p>
          <button
            className="mt-6 px-6 py-2 bg-amber-500 text-white rounded cursor-pointer hover:bg-amber-600 transition"
            onClick={() => navigate("/student/profile")} 
          >
          Go to Profile   
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      
    </div>
  )
};

export default InterviewQuestions;
