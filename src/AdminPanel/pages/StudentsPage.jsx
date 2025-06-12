import axios from "axios";
import React, { useState, useEffect } from "react";
import { RiMenuFoldFill } from "react-icons/ri";
import { GoPlus } from "react-icons/go";
import { PiStudentBold } from "react-icons/pi";
import { CiSearch } from "react-icons/ci";
import { MdOutlineDelete } from "react-icons/md";
import { LuExternalLink } from "react-icons/lu";
import { BsFilePerson } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const StudentsPage = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [branch, setBranch] = useState([]);
  const [searchBranch, setSearchBranch] = useState("");
  const [expandedBranch, setExpandedBranch] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/getstudents")
      .then((response) => {
        setStudents(response.data);
        const allbranches = [...new Set(response.data.map((q) => q.branch))];
        setBranch(allbranches);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [students]);

  const grouped = students.reduce((acc, student) => {
    const { branch, section } = student;
    if (!acc[branch]) acc[branch] = {};
    if (!acc[branch][section]) acc[branch][section] = [];
    acc[branch][section].push(student.student_mail);
    return acc;
  }, {});

  const handleBranchClick = (branch) => {
    setExpandedBranch((prev) => (prev === branch ? null : branch));
    setIsActive(branch);
    setExpandedSection(null);
  };

  const handleSectionClick = (section) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  const filteredStudents = students
    .filter((student) => {
      const branchMatch = isActive === "all" || student.branch === isActive;
      const sectionMatch =
        expandedSection && isActive !== "all"
          ? student.section === expandedSection && student.branch === isActive
          : true;
      const searchMatch = student.student_mail
        .toLowerCase()
        .includes(search.toLowerCase());
      return branchMatch && sectionMatch && searchMatch;
    })
    .map((student) => student.student_mail);

  const deleteBranchOrSection = (branch, section = null) => {
    axios
      .delete("http://localhost:3000/deletebranch", {
        data: section ? { branch, section } : { branch },
      })
      .then((response) => {
        console.log(response.data.message);

        if (section) {
          setStudents((prevStudents) =>
            prevStudents.filter(
              (q) => !(q.branch === branch && q.section === section)
            )
          );
        } else {
          setStudents((prevStudents) =>
            prevStudents.filter((q) => q.branch !== branch)
          );
          setIsActive("all");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
        <div
          className={`${
            isOpen
              ? "hidden"
              : "w-full h-10 flex justify-around items-center border-1 border-gray-500 rounded-lg"
          }`}
        >
          <input
            type="text"
            placeholder="Search category"
            className="text-sm font-semibold outline-none"
            value={searchBranch}
            onChange={(e) => setSearchBranch(e.target.value)}
          />
          <CiSearch color="green" />
        </div>
        <div className={`${isOpen ? "hidden" : "w-full flex flex-col"}`}>
          <div className={`${isOpen ? "hidden" : ""}`}>
            <p className="font-semibold text-lg underline">Branch & Section</p>
          </div>
          <div
            className={`flex items-center text-[12px] font-semibold h-7 pl-5 mt-7 gap-2 capitalize cursor-pointer
                        ${
                          isActive === "all"
                            ? "bg-green-100 text-green-500"
                            : "text-black"
                        }`}
            onClick={() => handleBranchClick("all")}
          >
            <PiStudentBold
              size={isActive === "all" ? 20 : 18}
              className="text-green-500 cursor-pointer"
            />
            <p>all students</p>
          </div>
          {branch
            .filter((cat) =>
              cat.toLowerCase().includes(searchBranch.toLowerCase().trim())
            )
            .map((br, idx) => (
              <div className="w-full">
                <div
                  key={idx}
                  onClick={() => handleBranchClick(br)}
                  className={`flex justify-between items-center text-[12px] font-semibold h-7 pl-5 pr-3 cursor-pointer capitalize ${
                    isActive === br
                      ? "bg-green-100 text-green-500"
                      : "text-black"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <PiStudentBold
                      size={isActive === br ? 20 : 18}
                      className="text-green-500"
                    />
                    <p>{br}</p>
                  </div>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteBranchOrSection(br);
                    }}
                    className="hover:bg-red-100 rounded-full p-[2px] cursor-pointer"
                  >
                    <MdOutlineDelete size={18} color="red" />
                  </div>
                </div>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    expandedBranch === br
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  {expandedBranch === br &&
                    Object.keys(grouped[br])
                      .sort((a, b) => a.localeCompare(b))
                      .map((sec, secIdx) => (
                        <div className="flex items-center gap-5">
                          <div
                            key={secIdx}
                            onClick={() => handleSectionClick(sec)}
                            className={`pl-10 text-[12px] h-6 cursor-pointer font-medium capitalize flex items-center ${
                              expandedSection === sec
                                ? "text-blue-500 underline"
                                : "text-gray-600"
                            }`}
                          >
                            ↳ Section {sec}
                          </div>
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteBranchOrSection(br, sec);
                            }}
                            className="hover:bg-red-100 rounded-full p-[2px] cursor-pointer"
                          >
                            <MdOutlineDelete size={18} color="red" />
                          </div>
                        </div>
                      ))}
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="w-full h-full bg-white rounded-lg shadow-lg p-5 overflow-y-auto hide-scrollbar">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const state = {};

                if (isActive !== "all") {
                  state.selectedBranch = isActive;
                }

                if (expandedSection) {
                  state.selectedSection = expandedSection;
                }

                navigate("/students/add-student", { state });
              }}
              className="bg-green-500 p-2 text-sm rounded-sm flex items-center gap-1 cursor-pointer text-white"
            >
              <GoPlus /> Add Student
            </button>
            <button
              // onClick={() => {
              //   if (isActive !== "all") {
              //     navigate("/questions/upload-questions", {
              //       state: { selectedCategory: isActive },
              //     });
              //   } else {
              //     navigate("/questions/upload-questions");
              //   }
              // }}
              className="border-1 border-green-500 p-2 text-sm rounded-sm flex items-center gap-2 cursor-pointer text-green-500"
            >
              <BsFilePerson size={20} /> Upload Students
            </button>
          </div>
          <div className="w-fit h-8 flex justify-around items-center border-1 border-gray-500 rounded-lg ">
            <input
              type="text"
              placeholder="Search"
              className="w-40 pl-3 h-full text-sm font-semibold outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <CiSearch color="green" className="mr-3" />
          </div>
        </div>
        <p className="text-sm font-semibold text-blue-500">
          Students count: {filteredStudents.length}
        </p>
        <div className="mt-5 ">
          {filteredStudents.map((student, index) => {
            return (
              <div
                key={index}
                className="flex justify-between items-start text-sm font-semibold border-t-2 border-gray-200 text-gray-500 p-3 hover:bg-gray-200 hover:text-black"
              >
                <div className="flex flex-col gap-3 w-full">
                  <p>{student}</p>
                </div>
                <p className="text-[12px] text-blue-500 ml-5 cursor-pointer whitespace-nowrap">
                  <LuExternalLink size={15} />
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudentsPage;
