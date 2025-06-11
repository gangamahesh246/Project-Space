import axios from "axios";
import React, { useState, useEffect } from "react";
import { RiMenuFoldFill } from "react-icons/ri";
import { GoPlus } from "react-icons/go";

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState("all");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  const studentsData = [
    {
      branch: "AIML",
      section: "A",
      students: ["aiml_a1@college.edu", "aiml_a2@college.edu"],
    },
    {
      branch: "AIML",
      section: "B",
      students: ["aiml_b1@college.edu", "aiml_b2@college.edu"],
    },
    {
      branch: "CSE",
      section: "A",
      students: ["cse_a1@college.edu", "cse_a2@college.edu"],
    },
    {
      branch: "ECE",
      section: "B",
      students: ["ece_b1@college.edu", "ece_b2@college.edu"],
    },
  ];

  const branches = [...new Set(studentsData.map((s) => s.branch))];

  const filteredSections = studentsData
    .filter((s) => s.branch === selectedBranch)
    .map((s) => s.section);

  const selectedGroup = studentsData.find(
    (s) => s.branch === selectedBranch && s.section === selectedSection
  );

  useEffect(() => {
    axios
      .get("http://localhost:3000/getstudents")
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [students]);

  console.log(students);
  return (
    <div className="w-full h-full bg-aliceblue flex gap-3 overflow-y-auto hide-scrollbar p-3">
      <div
        className={`${
          isOpen
            ? "w-15 transition-all duration-300"
            : "w-1/3 transition-all duration-300"
        } h-full bg-white flex flex-col gap-5 rounded-lg shadow-lg p-5`}
      >
        <div className="flex justify-between items-center">
          <p className={`${isOpen ? "hidden" : "text-xl font-bold"}`}>
            Students
          </p>
          <p className="text-xl font-bold text-gray-500">
            <RiMenuFoldFill
              className="cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            />
          </p>
        </div>
        <div className={`${isOpen ? "hidden" : "w-full flex flex-col"}`}>
          <select
            className="border p-2"
            value={selectedBranch}
            onChange={(e) => {
              setSelectedBranch(e.target.value);
              setSelectedSection(""); // reset section
            }}
          >
            <option value="">Select Branch</option>
            {branches.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>

          {selectedBranch && (
            <select
              className="border p-2"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
            >
              <option value="">Select Section</option>
              {filteredSections.map((section) => (
                <option key={section} value={section}>
                  Section {section}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
      <div className="w-full h-full bg-white rounded-lg shadow-lg p-5 overflow-y-auto hide-scrollbar">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <button className="bg-green-500 p-2 text-sm rounded-sm flex items-center gap-1 cursor-pointer text-white">
              <GoPlus /> New question
            </button>
            <button className="border-1 border-green-500 p-2 text-sm rounded-sm flex items-center gap-2 cursor-pointer text-green-500">
              Add questions
            </button>
          </div>
        </div>
        <p className="text-sm font-semibold text-blue-500">
          Students count: {students.length}
        </p>
        <div className="mt-5">
          {selectedGroup && (
            <div className="bg-gray-100 p-3 rounded">
              <strong>
                Students in {selectedBranch} - {selectedSection}:
              </strong>
              <ul className="list-disc ml-5">
                {selectedGroup.students.map((mail, idx) => (
                  <li key={idx}>{mail}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentsPage;
