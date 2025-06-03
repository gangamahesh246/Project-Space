import React, { useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { IoIosClose } from "react-icons/io";
import { resetExamState } from "../../../slices/ExamSlice";

const Finish = ({ coverFile, setactiveTab }) => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.exam);
  console.log(data);
  const [isOpen, setIsOpen] = useState(false);

  const publish = async () => {
    try {
      const formData = new FormData(); 

      formData.append("title", data.basicInfo.title);
      formData.append("category", data.basicInfo.category);
      formData.append("description", data.basicInfo.description || "");

      if (coverFile) {
        formData.append("coverPreview", coverFile);
      } 

      formData.append("questions", JSON.stringify(data.questions));
      formData.append("settings", JSON.stringify(data.settings));

      const response = await axios.post(
        "http://localhost:3000/postexam",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Published Successfully", response.data);
      alert("Exam published successfully!");
      dispatch(resetExamState());
      setactiveTab("exam");
    } catch (err) {
      console.error("Publish failed", err);
      alert("Failed to publish exam");
    }
  };

  return (
    <div className="w-full h-fit pb-5 bg-white">
      <div className="w-full h-15 border-b-2 border-aliceblue text-xl text-primary capitalize font-bold text-center pt-5">
        {data.basicInfo?.title}
      </div>
      <div className="flex flex-col items-center pt-5 text-green-600">
        <CheckCircleIcon className="h-30 w-30" />
        <span>Exam Created Successfully</span>
      </div>
      <div className="sm:pl-3 flex flex-col items-center pt-5">
        <p className="text-sm font-semibold text-gray-600">
          Open: {data.settings?.availability.timeLimitDays.from} -{" "}
          {data.settings?.availability.timeLimitDays.to}
        </p>
        <p className="text-sm font-semibold text-yellow-600">
          The exam is currently in draft status and the candidate cannot take
          the test.
        </p>
      </div>
      <div className="flex justify-center items-center sm:pt-5 xl:pt-10 gap-10">
        <button
          className="w-24 h-8 border-2 border-secondary text-green-500 text-sm font-bold rounded-md cursor-pointer"
          onClick={publish}
        >
          Publish
        </button>
        <button
          className="w-24 h-8 bg-green-500 text-white text-sm font-bold rounded-md ml-2 cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          Preview
        </button>
      </div>
      {isOpen && (
        <Preview setIsOpen={setIsOpen} data={data} coverFile={coverFile} />
      )}
    </div>
  );
};

export default Finish;

const Preview = ({ setIsOpen, data, coverFile }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white w-5/6 max-w-3xl h-fit rounded-md p-6 flex flex-col gap-4 shadow-lg relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
        >
          <IoIosClose size={22} />
        </button>
        <h2 className="text-xl font-bold text-primary">Exam Preview</h2>
        {coverFile && (
          <img
            src={coverFile.name ? URL.createObjectURL(coverFile) : coverFile}
            alt="Exam Cover"
            className="w-50 max-h-52 object-cover rounded-md"
          />
        )}
        <div className="space-y-2">
          <p>
            <strong>Title:</strong> {data.basicInfo?.title}
          </p>
          <p>
            <strong>Category:</strong> {data.basicInfo?.category}
          </p>
          <p>
            <strong>Description:</strong> {data.basicInfo?.description || "N/A"}
          </p>
          <p>
            <strong>Total Questions:</strong> {data.questions?.length || 0}
          </p>
        </div>
        <div className="mt-4 space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">Time Settings</h3>
          <p>
            <strong>Exam Time:</strong>{" "}
            {data.settings?.answerTimeControl.examTime} minutes
          </p>
          <p>
            <strong>Per Question Time:</strong>{" "}
            {data.settings?.answerTimeControl.questionTime} seconds
          </p>
          <p>
            <strong>Type:</strong> {data.settings?.answerTimeControl.type}
          </p>
        </div>
        <div className="mt-4 space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">Anti-Cheating</h3>
          <p>
            <strong>Fullscreen Required:</strong>{" "}
            {data.settings?.antiCheating?.forceFullscreen ? "Yes" : "No"}
          </p>
          <p>
            <strong>Webcam Required:</strong>{" "}
            {data.settings?.antiCheating?.webcam ? "Yes" : "No"}
          </p>
          <p>
            <strong>Copy-Paste Prevention:</strong>{" "}
            {data.settings?.antiCheating?.copyPastePrevention ? "Yes" : "No"}
          </p>
          <p>
            <strong>Screen Switch Allowed:</strong>{" "}
            {data.settings?.antiCheating?.switchingScreen} times
          </p>
        </div>
        <div className="mt-4 space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">Auto Submit</h3>
          <p>
            <strong>Auto Submit at End:</strong>{" "}
            {data.settings?.autoSubmit?.autoSubmitAtEnd ? "Yes" : "No"}
          </p>
          <p>
            <strong>Disable Auto Submit:</strong>{" "}
            {data.settings?.autoSubmit?.disableAutoSubmit ? "Yes" : "No"}
          </p>
        </div>
        <div className="mt-4 space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">Results</h3>
          <p>
            <strong>Display Score:</strong>{" "}
            {data.settings?.results?.displayScore?.enabled ? "Yes" : "No"}
          </p>
          <p>
            <strong>Show Ranking List:</strong>{" "}
            {data.settings?.results?.displayScore?.showRankingList
              ? "Yes"
              : "No"}
          </p>
          <p>
            <strong>Pass Percentage:</strong>{" "}
            {data.settings?.results?.displayScore?.passPercentage}%
          </p>
          <p>
            <strong>Negative Marking:</strong>{" "}
            {data.settings?.results?.displayScore?.negativeMarking
              ? "Yes"
              : "No"}
          </p>
        </div>
        <div className="mt-4 space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">
            Assigned Users
          </h3>
          <ul className="list-disc list-inside text-sm text-gray-600">
            {data.settings?.assignExamTo?.specificUsers?.map((email, idx) => (
              <li key={idx}>{email}</li>
            ))}
          </ul>
        </div>
        <div className="mt-4 space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">Availability</h3>
          <p>
            <strong>From:</strong>{" "}
            {data.settings?.availability?.timeLimitDays?.from}
          </p>
          <p>
            <strong>To:</strong>{" "}
            {data.settings?.availability?.timeLimitDays?.to}
          </p>
          <p>
            <strong>Late Time Allowed (mins):</strong>{" "}
            {data.settings?.availability?.lateTime}
          </p>
          <p>
            <strong>Permanent:</strong>{" "}
            {data.settings?.availability?.permanent ? "Yes" : "No"}
          </p>
        </div>
        <div className="mt-4 space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">Other Details</h3>
          <p>
            <strong>Exam Taken Limit:</strong>{" "}
            {data.settings?.examTakenTimes?.multiple || 1}
          </p>
          <p>
            <strong>Exam Taken Type:</strong>{" "}
            {data.settings?.examTakenTimes?.type || "single"}
          </p>
        </div>
      </div>
    </div>
  );
};
