import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AddStudent = () => {
  const location = useLocation();
  const { selectedBranch = "", selectedSection = "" } = location.state || {};

  const [branch, setBranch] = useState(selectedBranch);
  const [section, setSection] = useState(selectedSection);
  const [email, setEmail] = useState("");

  const handleAddStudent = async () => {
    try {
      const studentData = {
        branch,
        section,
        student_mail: email
      };

     const res =  await axios.post("http://localhost:3000/uploadstudent", studentData);

      toast.success(res.data.message);

      setEmail("");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  return (
    <div className="w-full h-full bg-white sm:p-3 xl:p-10 flex justify-center items-center">
      <div className="sm:w-78 sm:p-5 md:w-145 xl:w-4/5 h-fit xl:mx-auto bg-white shadow-lg rounded-lg xl:p-8">
        <form>
          <label className="block mb-6 text-md font-semibold border-l-4 border-secondary pl-2">
           Branch
          </label>
          <input
            type="text"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            placeholder="Enter Branch"
            className="w-full p-2 mb-6 ml-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary"
          />
          <label className="block mb-6 text-md font-semibold border-l-4 border-secondary pl-2">
            Section 
          </label>
          <input
            type="text"
            value={section}
            onChange={(e) => setSection(e.target.value)}
            placeholder="Enter Section"
            className="w-full p-2 mb-6 ml-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary"
          />
          <label className="block mb-6 text-md font-semibold border-l-4 border-secondary pl-2">
             Student Email 
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Student Email"
            className="w-full p-2 mb-6 ml-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary"
          />
        </form>
        <div className="flex justify-end">
          <button
            onClick={handleAddStudent}
            className="text-white px-4 py-2 rounded-lg bg-green-500 cursor-pointer outline-none"
          >
             Add Student 
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStudent;
