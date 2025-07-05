import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const ExamInstructions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const examId = location.state?.examId;
  const attemptStart = new Date();

  const [instructions, setInstructions] = useState([]);

  useEffect(() => {
    axiosInstance
      .get(`/getexaminstructions/${examId}`)
      .then((response) => {
        setInstructions(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [examId]);

  const startExam = async () => {
    navigate("/test", {
      state: {
        examId: examId,
        basicInfo: instructions.basicInfo,
        examTime: instructions?.settings.answerTimeControl,
        examType: instructions?.settings?.answerTimeControl?.type,
        questionTime: instructions?.settings?.answerTimeControl?.questionTime,
        availability: instructions?.settings.availability.timeLimitDays,
        hourTo: instructions?.settings.availability.timeLimitHours.to,
        results: instructions?.settings.results.displayScore,
        attemptStart,
      },
    });
  };

  return (
    <div className="max-w-full flex justify-center items-center p-10 bg-aliceblue shadow-md font-primary text-gray-800">
      <div className="w-[75%] p-5 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold capitalize text-center mb-6 border-b-2 border-gray-300 pb-2">
          {instructions?.basicInfo?.title}
        </h2>

        <div className=" text-[15px] capitalize">
          <p>
            <strong>Exam: </strong> {instructions?.basicInfo?.title}
          </p>
          <p>
            <strong>Category: </strong> {instructions?.basicInfo?.category}
          </p>
        </div>
        {instructions?.settings?.answerTimeControl?.questionTime > 0 ? (
          <p>
            <strong>Time Limit:</strong>{" "}
            {instructions.settings.answerTimeControl.questionTime} seconds per
            question.
          </p>
        ) : instructions?.settings?.answerTimeControl?.type === "dynamic" ? (
          <p>
            <strong>Time Limit:</strong> {attemptStart.toLocaleTimeString()} minutes (dynamic).
          </p>
        ) : instructions?.settings?.answerTimeControl?.examTime > 0 ? (
          <p>
            <strong>Total Duration:</strong>{" "}
            {instructions.settings.answerTimeControl.examTime} minutes.
          </p>
        ) : (
          <p>
            <strong>Time Limit:</strong> No Time Limit.
          </p>
        )}

        <p className="mb-4">
          <strong>No. of Attempts: </strong>
          {instructions?.settings?.examTakenTimes?.multiple === 0
            ? "Only once"
            : `${instructions?.settings?.examTakenTimes?.multiple} ${
                instructions?.settings?.examTakenTimes?.multiple === 1
                  ? "time"
                  : "times"
              }`}
        </p>

        <div className="mb-6 text-[15px]">
          <h3 className="text-lg font-semibold mb-2">Marks</h3>
          <p>
            <strong>Negative marking: </strong>{" "}
            {instructions?.settings?.results?.displayScore?.negativeMarking}
          </p>
          <p>
            <strong>Pass Percentage: </strong>{" "}
            {instructions?.settings?.results?.displayScore?.passPercentage}%
          </p>
          <p>
            {instructions?.settings?.availability?.lateTime ? (
              <>
                <strong>Late Time: </strong>{" "}
                {instructions.settings.availability.lateTime} minutes (Late
                entry is allowed after the start.)
              </>
            ) : (
              <p>No late entry allowed.</p>
            )}
          </p>
        </div>

        <div className="mb-6 text-[15px]">
          <h3 className="text-lg font-semibold mb-2">Rules</h3>
          <ul className="list-disc space-y-1 text-justify pl-5">
            <li>
              The exam must be taken in fullscreen mode. Exiting fullscreen at
              any time may be treated as a violation and could result in
              automatic submission.
            </li>
            <li>
              Webcam access is mandatory throughout the duration of the exam.
              Your camera feed will be monitored to ensure the integrity of the
              test environment.
            </li>
          </ul>
        </div>

        <div className="mb-6 text-[15px]">
          <h3 className="text-lg font-semibold mb-2">⚠ Important</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Do not refresh or close the browser window during the exam.</li>
            <li>Maintain a stable internet connection throughout.</li>
            <li>Any violations may result in automatic submission.</li>
          </ul>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={startExam}
            className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-400 transition duration-300 cursor-pointer"
          >
            Start Exam
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamInstructions;
