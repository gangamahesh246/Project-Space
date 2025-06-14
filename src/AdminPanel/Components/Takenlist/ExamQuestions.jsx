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
        toast.error(error?.response?.data?.message || error.message);
      });
  }, [examId]);
  return (
    <div className="w-full h-fit bg-white grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {examQuestions.length > 0 ? (
          examQuestions.map((q, idx) => (
            <div
              key={idx}
              className="border border-gray-200 p-4 rounded-lg shadow-sm bg-white"
            >
              <h2 className="font-semibold mb-2">
                Q{idx + 1}: {q.question}
              </h2>
              <ul className="list-disc pl-6 text-gray-700">
                {q.options.map((opt, i) => (
                  <li key={i}>
                    {String.fromCharCode(65 + i)}. {opt}
                  </li>
                ))}
              </ul>
              <p className="text-green-600 mt-2 text-sm">
                Correct Answer(s): {q.correct.join(", ")}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">
            No questions available for this category.
          </p>
        )}
    </div>
  );
};

export default ExamQuestions;
