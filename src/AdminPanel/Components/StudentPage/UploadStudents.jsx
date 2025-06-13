import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import * as XLSX from "xlsx";
import { TbFileUpload } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UploadStudents = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedBranch = "", selectedSection = "" } = location.state || {};

  const [branch, setBranch] = useState(selectedBranch);
  const [section, setSection] = useState(selectedSection);
  const [file, setFile] = useState(null);

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (!selectedFile || !branch.trim() || !section.trim()) {
      toast.error("Please select a file and fill in branch/section");
      return;
    }

    const reader = new FileReader();

    reader.onload = async (evt) => {
      const bstr = evt.target.result;
      const workbook = XLSX.read(bstr, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { raw: true });

      const emails = jsonData
        .map((entry) => entry["Student Email"])
        .filter(Boolean);
        toast.success("File uploaded successfully");

      if (emails.length === 0) {
        toast.error("No valid emails found in the file");
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:3000/uploadstudents",
          {
            branch,
            section,
            students: emails,
          }
        );

        if (response.status === 201) {
          toast.success(
            `✅ ${response.data.added} added, ❌ ${response.data.skipped} skipped`
          );
        } else {
          toast.info(response.data.message);
        }

        setFile(null);
      } catch (error) {
        toast.error(error?.response?.data?.message || error.message);
      }
    };

    reader.readAsBinaryString(selectedFile);
    navigate("/students");
  };

  return (
    <div className="w-full h-full bg-white flex justify-center items-center">
      <div className="w-1/2 h-[90%] bg-white shadow-xl rounded flex flex-col overflow-hidden">
        <div className="w-full h-15 bg-green-100 text-green-500 font-bold flex items-center pl-2">
          Upload students via file
        </div>
        <div className="w-full h-fit pt-3 flex justify-evenly items-center">
          <div>
            <label className="block text-md font-semibold border-l-4 border-secondary pl-2 m-3">
              Branch
            </label>
            <input
              type="text"
              placeholder="Branch"
              className="w-50 p-2 text-sm font-semibold outline-none border-1 border-gray-500 rounded-lg ml-3"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-md font-semibold border-l-4 border-secondary pl-2 m-3">
              Section
            </label>
            <input
              type="text"
              placeholder="Section"
              className="w-50 p-2 text-sm font-semibold outline-none border-1 border-gray-500 rounded-lg ml-3"
              value={section}
              onChange={(e) => setSection(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col justify-center items-center h-full gap-2 p-3">
          <TbFileUpload size={80} className="text-green-100" />
          <p className="text-gray-500 font_primary text-center text-sm">
            Drag & drop files here or select a file to upload questions in bulk
          </p>
          <p className="text-gray-500 font_primary text-center text-sm">
            Supports Excel(xlsx) files.
          </p>
          <p className="text-gray-500 font_primary text-center text-sm">
            Note: The file should have the following column: Student Email.
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

export default UploadStudents;
