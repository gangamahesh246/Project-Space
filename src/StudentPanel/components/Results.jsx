import { useLocation, useNavigate } from "react-router-dom";
import { use, useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";

const Results = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (!state) {
      navigate("/student/exam");
    }
  }, [state, navigate]);

  if (!state) return null;

  const { score, questionResults, totalMarks, passMark, result, show } = state;

  useEffect(() => {
    if (show) {
      setShowResults(true);
    }
  }, [show]);

  return (
    <div className="h-full p-6 bg-gray-100">
      {showResults ? (
        <p></p>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-center mb-2">
            Score: <span className="text-amber-500">{score}</span> /
            {totalMarks}
          </h2>
          <h3
            className={`text-lg font-semibold text-center mb-6 ${
              result === "Pass" ? "text-green-600" : "text-red-600"
            }`}
          >
            {result} (Pass Mark: {passMark})
          </h3>
        </>
      )}

      <div className="space-y-6">
        {questionResults.map((q, index) => (
          <div key={index} className={`rounded p-4 shadow bg-white`}>
            <h4 className="font-semibold mb-2">
              Q{index + 1}: {q.questionText}
            </h4>

            <ul className="list-none space-y-1 mb-2">
              {q.options.map((opt, i) => {
                const letter = String.fromCharCode(65 + i);
                const isCorrect = q.correctAnswers.includes(letter);
                const isSelected = q.selectedAnswers.includes(letter);

                return (
                  <li
                    key={i}
                    className={`p-2 rounded-md ${
                      isCorrect
                        ? "bg-green-100 text-green-800 font-semibold"
                        : isSelected
                        ? "bg-red-100 text-red-800 font-semibold"
                        : "bg-gray-100"
                    }`}
                  >
                    {letter}. {opt}
                  </li>
                );
              })}
            </ul>

            <p className="text-sm text-gray-700">
              <strong>Your Answer:</strong> {q.selectedAnswers.join(", ")} |{" "}
              <strong>Correct:</strong> {q.correctAnswers.join(", ")}
            </p>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <button
          onClick={() => navigate("/student/dashboard")}
          className="px-4 py-2 mt-5 cursor-pointer bg-green-500 rounded text-white flex items-center gap-2"
        >
          <IoMdArrowRoundBack size={18} /> Back
        </button>
      </div>
    </div>
  );
};

export default Results;
