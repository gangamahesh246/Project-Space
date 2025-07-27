import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MdCancel } from "react-icons/md";
import axiosStudent from "../../utils/axiosStudent";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PracticeTests = () => {
  const navigate = useNavigate();

  const student = useSelector((state) => state.student.user);

  const [studentId, setStudentId] = useState(null);
  const [technology, setTechnology] = useState("");
  const [loading, setLoading] = useState(true);
  const [PracticeTests, setPracticeTests] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);

  useEffect(() => {
    if (!student.college_mail) return;

    axiosStudent
      .get("/getstudentId", {
        params: {
          student_mail: student.college_mail,
        },
      })
      .then((response) => {
        const id = response.data.studentId;
        setStudentId(id);

        return axiosStudent.get("/student/gettechnology", {
          params: { email: student.college_mail },
        });
      })
      .then((res) => {
        setTechnology(res.data.technology);
      })
      .catch((error) => {
        console.error("Error:", error.response?.data || error.message);
      });
  }, [student.college_mail]);

  useEffect(() => {
    if (!technology) return;

    axiosStudent
      .get("/practice-tests", {
        params: { technology },
      })
      .then((res) => {
        const allQuestions = res.data[0]?.questions || [];

        if (allQuestions.length === 0) {
          toast.info("No practice tests available for this technology.");
          return;
        }

        const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 15);

        setPracticeTests(selected);
        console.log("Selected 15 Practice Questions:", selected);
      })
      .catch((err) => {
        console.error("Error fetching practice tests:", err);
      });
  }, [technology]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

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

  const handleRadioChange = (qIndex, optionIndex) => {
    const updated = [...userAnswers];
    updated[qIndex] = optionIndex;
    setUserAnswers(updated);
  };

  const handleCheckboxChange = (qIndex, optionIndex) => {
    const updated = [...userAnswers];
    const selected = updated[qIndex] || [];
    if (selected.includes(optionIndex)) {
      updated[qIndex] = selected.filter((i) => i !== optionIndex);
    } else {
      updated[qIndex] = [...selected, optionIndex];
    }
    setUserAnswers(updated);
  };

  const handleClearSelection = (qIndex) => {
    const updated = [...userAnswers];
    updated[qIndex] = Array.isArray(updated[qIndex]) ? [] : undefined;
    setUserAnswers(updated);
  };
 
  const handleSubmit = () => {
    const questionResults = [];

    for (let i = 0; i < PracticeTests.length; i++) {
      const question = PracticeTests[i];

      const normalizedAnswers = userAnswers.map((ans) => {
        if (Array.isArray(ans)) return ans;
        return ans != null ? [ans] : [];
      });

      const answer = normalizedAnswers[i];
      if (!answer || answer.length === 0) continue;

      const selectedOptions = Array.isArray(answer)
        ? answer.map((index) => String.fromCharCode(65 + index))
        : [String.fromCharCode(65 + answer)];

      const normalize = (arr) =>
        arr.map((val) => String(val).trim().toUpperCase()).sort();

      const correctArray = question.correctAnswer || []; 
      const correctOptions = correctArray.map((optIndex) =>
        String.fromCharCode(65 + optIndex)
      );

      const sortedCorrect = normalize(correctOptions);
      const sortedAnswer = normalize(selectedOptions);

      const isCorrect =
        JSON.stringify(sortedCorrect) === JSON.stringify(sortedAnswer);

      questionResults.push({
        questionText: question.question,
        options: question.options,
        correctAnswers: sortedCorrect,
        selectedAnswers: sortedAnswer,
        isCorrect,
      });
    }

    console.log("Practice Test Results:", questionResults);
    toast.success("Practice submission complete! Check console for results.");
    navigate("/student/exam/results", {
      state: {
        questionResults,
        show: true,
      },
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl text-amber-500 font-bold mb-4">
        Practice Questions
      </h1>

      {PracticeTests?.map((question, index) => {
        const isMultipleCorrect = question.correctAnswer.length > 1;
        return (
          <div key={index} className="mb-6 border-b border-gray-300 pb-4">
            <h2 className="font-semibold mb-2">
              Question {index + 1}: {question.question}
            </h2>

            <ul className="space-y-2 text-sm ">
              {question.options.map((opt, i) => (
                <li key={i}>
                  <label className="flex items-center gap-2 cursor-pointer">
                    {isMultipleCorrect ? (
                      <input
                        type="checkbox"
                        checked={userAnswers[index]?.includes(i) || false}
                        onChange={() => handleCheckboxChange(index, i)}
                        className="h-4 w-4 text-blue-600 focus:outline-none"
                      />
                    ) : (
                      <input
                        type="radio"
                        checked={userAnswers[index] === i}
                        onChange={() => handleRadioChange(index, i)}
                        name={`q${index}`}
                        className="h-4 w-4 focus:outline-none"
                      />
                    )}
                    {opt}
                  </label>
                </li>
              ))}
            </ul>

            {(isMultipleCorrect && userAnswers[index]?.length > 0) ||
            (!isMultipleCorrect && userAnswers[index] !== undefined) ? (
              <button
                onClick={() => handleClearSelection(index)}
                className="text-sm text-red-500 underline mt-2 cursor-pointer"
              >
                Clear Selection
              </button>
            ) : null}
          </div>
        );
      })}

      {PracticeTests && 
      <button
        onClick={handleSubmit}
        className="bg-amber-400 hover:bg-amber-500 cursor-pointer focus:outline-none text-white font-semibold px-4 py-2 rounded"
      >
        Submit
      </button>
      }      
    </div>
  );
};

export default PracticeTests;
