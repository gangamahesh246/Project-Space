import React, { useState } from "react";
import * as XLSX from "xlsx";
import { useLocation, useNavigate } from "react-router-dom";
import { TbFileUpload } from "react-icons/tb";
import { toast } from "react-toastify";
import axiosInstance from "../../../utils/axiosInstance";

const UploadStudents = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedTechnology = "" } = location.state || {};

  const [technology, setTechnology] = useState(selectedTechnology);
  const [file, setFile] = useState(null);

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (!selectedFile || !technology.trim()) {
      toast.error("Please select a file and enter technology");
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

      if (emails.length === 0) {
        toast.error("No valid emails found in the file");
        return;
      }

      try {
        const response = await axiosInstance.post("/uploadstudents", {
          technology,
          students: emails,
        });

        if (response.status === 201) {
          toast.success(
            `✅ ${response.data.added} added, ❌ ${response.data.skipped} skipped`
          );
        } else {
          toast.info(response.data.message);
        }

        setFile(null);
        navigate("/admin/students");
      } catch (error) {
        toast.error(error?.response?.data?.message || error.message);
      }
    };

    reader.readAsBinaryString(selectedFile);
  };

  return (
    <div className="w-full h-full bg-white flex justify-center items-center sm:p-2">
      <div className="sm:w-full xl:w-1/2 h-[90%] bg-white shadow-xl rounded flex flex-col overflow-hidden">
        <div className="w-full h-15 bg-green-100 text-green-500 font-bold flex items-center pl-2">
          Upload students via file
        </div>

        <div className="w-full h-fit pt-3 flex justify-center items-center">
          <div>
            <label className="block text-md font-semibold border-l-4 border-secondary pl-2 m-3">
              Technology
            </label>
            <input
              type="text"
              placeholder="Technology"
              className="w-64 p-2 text-sm font-semibold outline-none border-1 border-gray-500 rounded-lg ml-3"
              value={technology}
              onChange={(e) => setTechnology(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col justify-center items-center h-full gap-2 p-3">
          <TbFileUpload size={80} className="text-green-100" />
          <p className="text-gray-500 text-center text-sm">
            Drag & drop or select a file to upload students in bulk
          </p>
          <p className="text-gray-500 text-center text-sm">
            Supports Excel (xlsx) files.
          </p>
          <p className="text-gray-500 text-center text-sm">
            <strong>Note:</strong> The file should have a column named: <code>Student Email</code>.
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
            accept=".xlsx, .xls, .csv"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </div>
    </div>
  );
};

export default UploadStudents;
