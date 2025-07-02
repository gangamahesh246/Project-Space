import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";

const Results = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state) {
      navigate("/student/exam");
    }
  }, [state, navigate]);

  if (!state) return null;

  const { score, questionResults, totalMarks, passMark, result } = state;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <h2 className="text-2xl font-bold text-center mb-2">
        Score: <span className="text-blue-600">{score}</span> / {totalMarks}
      </h2>
      <h3
        className={`text-lg font-semibold text-center mb-6 ${
          result === "Pass" ? "text-green-600" : "text-red-600"
        }`}
      >
        {result} (Pass Mark: {passMark})
      </h3>

      <div className="space-y-6">
        {questionResults.map((q, index) => (
          <div key={index} className={`rounded-xl p-4 shadow bg-white`}>
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
          onClick={() => navigate("/student/exam")}
          className="px-4 py-2 mt-5 cursor-pointer bg-green-500 rounded text-white flex items-center gap-2"
        >
          <IoMdArrowRoundBack size={18} /> Back to exam page
        </button>
      </div>
    </div>
  );
};

export default Results;
