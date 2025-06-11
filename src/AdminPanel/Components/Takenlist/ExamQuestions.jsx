import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ExamQuestions = () => {
  const { examId } = useParams();
  const [examQuestions, setExamQuestions] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/getexamquestions/${examId}`)
      .then((response) => {
        setExamQuestions(response.data.questions);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [examId]);
  return (
  <div className="w-full h-fit bg-white flex justify-center items-center">
    <div className="w-1/2 h-full bg-white shadow-xl">
      {examQuestions.length > 0 ? (
        examQuestions.map((question, index) => (
          <div
            key={index}
            className="flex justify-between items-start text-sm font-semibold border-b-2 border-gray-200 text-gray-500 p-3"
          >
            <div className="flex flex-col gap-3 w-full">
              <p>
                {index + 1}. {question.question}
              </p>
              {question.options.map((option, idx) => (
                <p className="ml-5" key={idx}>
                  {String.fromCharCode(65 + idx)}. {option}
                </p>
              ))}
              <p className="flex gap-1">
                Correct Answer:
                {Array.isArray(question.correct) &&
                  question.correct.map((c, i) => <span key={i}>{c}</span>)}
              </p>
            </div>
            <p className="text-[12px] text-blue-500 ml-5 cursor-pointer whitespace-nowrap">
              {question.marks} {question.marks > 1 ? "Points" : "Point"}
            </p>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 p-4">No Questions Found</p>
      )}
    </div>
  </div>
);
}


export default ExamQuestions;
