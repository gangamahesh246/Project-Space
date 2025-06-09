import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import * as XLSX from "xlsx";
import { TbFileUpload } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

const UploadQuestions = () => {
  const location = useLocation();
  const selectcategory = location.state?.selectedCategory || "";
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState(selectcategory);


  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (!selectedFile || !category.trim()) {
      alert("Please select a file and enter a category first.");
      return;
    }

    const reader = new FileReader();

    reader.onload = async (evt) => {
      const bstr = evt.target.result;
      const workbook = XLSX.read(bstr, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { raw: true });

      const formattedQuestions = jsonData.map((q, index) => {
        const keys = Object.keys(q).reduce((acc, key) => {
          acc[key.toLowerCase().replace(/\s+/g, "")] = q[key];
          return acc;
        }, {});

        return {
          id: index + 1,
          question: keys["question"],
          options: [
            keys["optiona"],
            keys["optionb"],
            keys["optionc"],
            keys["optiond"],
          ],
          correct:
            typeof keys["correctanswer"] === "string"
              ? keys["correctanswer"].split(",").map((ans) => ans.trim())
              : Array.isArray(keys["correctanswer"])
              ? keys["correctanswer"]
              : [keys["correctanswer"]],

          multiple_response: Array.isArray(keys["correctanswer"])
            ? keys["correctanswer"].length > 1
            : false,
          marks: keys["marks"],
        };
      });

      try {
        const response = await axios.post(
          "http://localhost:3000/uploadquestions",
          {
            category,
            questions: formattedQuestions,
          }
        );
        console.log("Upload successful:", response.data);
        alert("Questions uploaded successfully!");
        setFile(null);
      } catch (err) {
        console.error("Upload failed:", err);
        alert("Failed to upload questions.");
      }
    };

    reader.readAsBinaryString(selectedFile);
    navigate("/questions");
  };

  return (
    <div className="w-full h-full bg-white flex justify-center items-center">
      <div className="w-1/2 h-[90%] bg-white shadow-xl rounded flex flex-col overflow-hidden">
        <div className="w-full h-15 bg-green-100 text-green-500 font-bold flex items-center pl-2">
          Upload questions via file
        </div>

        <input
            type="text"
            placeholder="Category"
            className="w-50 p-2 text-sm font-semibold outline-none border-1 border-gray-500 rounded-lg m-5"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        <div className="flex flex-col justify-center items-center h-full gap-2 p-3">
          <TbFileUpload size={80} className="text-green-100" />
          <p className="text-gray-500 font_primary text-center text-sm">
            Drag & drop files here or select a file to upload questions in bulk
          </p>
          <p className="text-gray-500 font_primary text-center text-sm">
            Supports Excel(xlsx) files.
          </p>
          <label
            htmlFor="fileInput"
            className="bg-green-500 text-white rounded-md font-semibold py-2 px-4 cursor-pointer text-center"
          >
            <span>{file ? file.name : "Upload file"}</span>
          </label>
          <input
            id="fileInput"
            type="file"
            accept=".xlsx, .xls"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </div>
    </div>
  );
};

export default UploadQuestions;
