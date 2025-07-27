import React, { useState } from "react";
import * as XLSX from "xlsx";
import { useRef } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";
import { Upload } from "lucide-react";

const More = () => {
  const interviewFileRef = useRef(null);
  const practiceFileRef = useRef(null);


  const [file, setFile] = useState(null);
  const [interviewtechnology, setInterviewTechnology] = useState("");
  const [practicetesttechnology, setPracticeTestTechnology] = useState("");

  const handleInterviewUploadClick = () => interviewFileRef.current.click();
  const handlePracticeUploadClick = () => practiceFileRef.current.click();


  const interviewquestionsFileUpload = async (e) => {
    const file = e.target.files[0];
    setFile(file);

    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (evt) => {
      const data = evt.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { raw: true });

      const formattedQuestions = jsonData.map((q) => {
        const keys = Object.keys(q).reduce((acc, key) => {
          acc[key.toLowerCase().replace(/\s+/g, "")] = q[key];
          return acc;
        }, {});

        return {
          question: keys["question"],
          answer: keys["answer"],
          explanation: keys["explanation"] || "",
        };
      });

      if (!interviewtechnology || formattedQuestions.length === 0) {
        toast.error("Please add a technology and upload a valid file");
        return;
      }

      try {
        const res = await axiosInstance.post("/upload-interview-questions", {
          technology: interviewtechnology,
          questions: formattedQuestions,
        });

        toast.success("Questions uploaded successfully!");
      } catch (error) {
        toast.error("Failed to upload questions");
        console.error("Upload error:", error);
      }
    };

    setInterviewTechnology("");
    setFile(null);
    e.target.value = null;
    reader.readAsBinaryString(file);
  };

  const practiceTestsFileUpload = async (e) => {
    const file = e.target.files[0];
    setFile(file);

    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (evt) => {
      const data = evt.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { raw: true });

      const formattedQuestions = jsonData.map((q) => {
        const keys = Object.keys(q).reduce((acc, key) => {
          acc[key.toLowerCase().replace(/\s+/g, "")] = q[key];
          return acc;
        }, {}); 

        return {
          question: keys["question"],
          options: [
            keys["optiona"],
            keys["optionb"],
            keys["optionc"],
            keys["optiond"],
          ],
          correctAnswer:
            typeof keys["correctoption"] === "string"
              ? keys["correctoption"].split(",").map((ans) => ans.trim())
              : Array.isArray(keys["correctoption"])
              ? keys["correctoption"]
              : [keys["correctoption"]],
        };
      });

      if (!practicetesttechnology || formattedQuestions.length === 0) {
        toast.error("Please add a technology and upload a valid file");
        return;
      }

      try {
        const res = await axiosInstance.post("/upload-practice-questions", {
          technology: practicetesttechnology,
          questions: formattedQuestions,
        });

        toast.success("Practice questions uploaded successfully!");
      } catch (error) {
        toast.error("Failed to upload practice questions");
      }
    };

    setPracticeTestTechnology("");
    setFile(null);
    e.target.value = null;
    reader.readAsBinaryString(file);
  };

  const interviewquestionsExcelDownload = () => {
    const link = document.createElement("a");
    link.href = "/assets/InterviewQuestions_Format.xlsx";
    link.download = "InterviewQuestions_Format.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const practicetestquestionsExcelDownload = () => {
    const link = document.createElement("a");
    link.href = "/assets/PracticeTests.xlsx";
    link.download = "PracticeTests.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div className="w-full h-full p-3 bg-gray-100">
      <div className="grid grid-cols-4 gap-3">
        <div className="h-35 shadow-sm rounded flex flex-col gap-1 bg-white cursor-pointer">
          <div className="flex items-center justify-between p-2">
            <button className="flex items-center gap-2 p-2 bg-amber-100 rounded">
              <Upload
                className="w-5 h-5"
                size={24}
                color="#FE9A46"
                strokeWidth={2}
              />
            </button>
            <span
              onClick={interviewquestionsExcelDownload}
              className="text-sm font-semibold text-[#008738] hover:underline cursor-pointer"
            >
              Format
            </span>
          </div>
          <input
            type="file"
            accept=".csv, .xlsx"
            ref={interviewFileRef}
            onChange={interviewquestionsFileUpload}
            className="hidden"
          />
          <input
            type="text"
            placeholder="Enter Technology"
            value={interviewtechnology}
            onChange={(e) => setInterviewTechnology(e.target.value)}
            className="p-1 border text-sm font-semibold focus:outline-none border-gray-300 rounded mx-5"
          />
          <p
            onClick={handleInterviewUploadClick}
            className="text-center text-amber-500 capitalize font-semibold"
          >
            upload interview questions
          </p>
        </div>
        <div className="h-35 shadow-sm rounded flex flex-col gap-1 bg-white">
          <div className="flex items-center justify-between p-2">
            <button className="flex items-center gap-2 p-2 bg-amber-100 rounded">
              <Upload
                className="w-5 h-5"
                size={24}
                color="#FE9A46"
                strokeWidth={2}
              />
            </button>
            <span
              onClick={practicetestquestionsExcelDownload}
              className="text-sm font-semibold text-[#008738] hover:underline cursor-pointer"
            >
              Format
            </span>
          </div>
          <input
            type="file"
            accept=".csv, .xlsx"
            ref={practiceFileRef}
            onChange={practiceTestsFileUpload}
            className="hidden"
          />
          <input
            type="text"
            placeholder="Enter Technology"
            value={practicetesttechnology}
            onChange={(e) => setPracticeTestTechnology(e.target.value)}
            className="p-1 border text-sm font-semibold focus:outline-none border-gray-300 rounded mx-5"
          />
          <p
            onClick={handlePracticeUploadClick}
            className="text-center text-amber-500 capitalize font-semibold cursor-pointer"
          >
            upload Practice questions
          </p>
        </div>
      </div>
    </div>
  );
};

export default More;
