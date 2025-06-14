import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AddQuestion = () => {
  const location = useLocation();
  const selectcategory = location.state?.selectedCategory || "";
  const [category, setCategory] = useState(selectcategory);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [marks, setMarks] = useState(1);
  const [multipleResponse, setMultipleResponse] = useState(false);
  const [correctCount, setCorrectCount] = useState(1);
  const [correctAnswers, setCorrectAnswers] = useState([""]);

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleCorrectAnswerChange = (index, value) => {
    const updatedCorrect = [...correctAnswers];
    updatedCorrect[index] = value;
    setCorrectAnswers(updatedCorrect);
  };

  const handleCorrectCountChange = (count) => {
    const num = parseInt(count);
    setCorrectCount(num);
    setCorrectAnswers(Array(num).fill(""));
  };

  const handleAddQuestion = async () => {
    const correct =
      multipleResponse && Array.isArray(correctAnswers)
        ? [...correctAnswers]
        : [correctAnswers?.[0] || ""];

    console.log(correct);
    const isValid = correct.every(
      (ans) =>
        typeof ans === "string" &&
        ["A", "B", "C", "D"].includes(ans.trim().toUpperCase())
    );

    if (!isValid) {
      toast.info("Please select valid correct answers");
      return;
    }

    const newQuestion = {
      question,
      options,
      correct,
      marks: parseInt(marks),
      multiple_response: multipleResponse,
    };

    const newQuestionData = {
      category,
      questions: [newQuestion],
    };

    try {
      const res = await axios.post(
        "http://localhost:3000/uploadquestions",
        newQuestionData
      );
      toast.success(res.data.message);

      setQuestion("");
      setOptions(["", "", "", ""]);
      setCorrectAnswers([""]);
      setCorrectCount(1);
      setMarks(1);
      setMultipleResponse(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  return (
    <div className="w-full h-fit bg-white sm:p-3 xl:p-10 flex justify-center items-center">
      <div className="sm:w-78 sm:p-5 md:w-145 xl:w-4/5 h-fit xl:mx-auto bg-white shadow-lg rounded-lg xl:p-8">
        <form>
          <label className="block mb-6 text-md font-semibold border-l-4 border-secondary pl-2">
            Category
          </label>
          <input
            type="text"
            placeholder="Enter Category"
            className="w-full p-2 mb-6 ml-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <label className="block mb-6 text-md font-semibold border-l-4 border-secondary pl-2">
            Question
          </label>
          <input
            type="text"
            placeholder="Enter Question"
            className="w-full p-2 mb-6 ml-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <label className="block mb-6 text-md font-semibold border-l-4 border-secondary pl-2">
            Options
          </label>
          {options.map((opt, idx) => (
            <input
              key={idx}
              type="text"
              placeholder={`Option ${String.fromCharCode(65 + idx)}`}
              className="w-full p-2 mb-3 ml-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary"
              value={opt}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
            />
          ))}

          <label className="block mb-6 text-md font-semibold border-l-4 border-secondary pl-2">
            Marks
          </label>
          <input
            type="number"
            placeholder="Marks"
            className="w-full p-2 mb-6 ml-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
          />

          <label className="block mb-4 text-md font-semibold border-l-4 border-secondary pl-2">
            Correct Answer(s)
          </label>
          <div className="ml-2 mb-6">
            <label className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                checked={multipleResponse}
                onChange={(e) => {
                  setMultipleResponse(e.target.checked);
                  setCorrectAnswers([""]);
                  setCorrectCount(1);
                }}
              />
              Multiple correct answers?
            </label>

            {multipleResponse ? (
              <>
                <input
                  type="number"
                  min="1"
                  max="4"
                  placeholder="Number of correct answers"
                  className="w-full p-2 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary"
                  value={correctCount}
                  onChange={(e) => handleCorrectCountChange(e.target.value)}
                />
                {correctAnswers.map((ans, idx) => (
                  <select
                    key={idx}
                    value={ans}
                    onChange={(e) =>
                      handleCorrectAnswerChange(idx, e.target.value)
                    }
                    className="w-full p-2 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary"
                  >
                    <option value="">Select Correct Option</option>
                    {options.map((opt, index) => (
                      <option
                        key={index}
                        value={String.fromCharCode(65 + index)}
                      >
                        {String.fromCharCode(65 + index)}. {opt}
                      </option>
                    ))}
                  </select>
                ))}
              </>
            ) : (
              <select
                value={correctAnswers[0]}
                onChange={(e) => handleCorrectAnswerChange(0, e.target.value)}
                className="w-full p-2 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary"
              >
                <option value="">Select Correct Option</option>
                {options.map((opt, index) => (
                  <option key={index} value={String.fromCharCode(65 + index)}>
                    {String.fromCharCode(65 + index)}. {opt}
                  </option>
                ))}
              </select>
            )}
          </div>
        </form>

        <div className="flex justify-end">
          <button
            onClick={handleAddQuestion}
            className="text-white px-4 py-2 rounded-lg bg-green-500 cursor-pointer"
          >
            Add Question
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddQuestion;
