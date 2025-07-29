import React, { useState, useEffect } from "react";
import { RiMenuFoldFill } from "react-icons/ri";
import { GoPlus } from "react-icons/go";
import { PiStudentBold } from "react-icons/pi";
import { CiSearch } from "react-icons/ci";
import { MdOutlineDelete } from "react-icons/md";
import { BsFilePerson } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";
import { useSelector } from "react-redux";

const StudentsPage = () => {
  const admin = useSelector((state) => state.login.user._id);

  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [technology, setTechnology] = useState([]);
  const [searchTech, setSearchTech] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    axiosInstance
      .get("/getstudents", { params: { faculty_id: admin } })
      .then((response) => {
        console.log(response.data);
        setStudents(response.data);
        const allTechs = [
          ...new Set(
            response.data
              .map((q) => q.technology)
              .filter((t) => typeof t === "string" && t.trim() !== "")
          ),
        ];
        setTechnology(allTechs);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error.message);
      });
  }, []);

  const handleTechClick = (tech) => {
    setIsActive(tech);
  };

  const filteredStudents = students
    .filter((item) => {
      const techMatch = isActive === "all" || item.technology === isActive;

      const hasMatchingStudent = item.students.some((stu) =>
        stu.student_mail.toLowerCase().includes(search.toLowerCase())
      );

      return techMatch && hasMatchingStudent;
    })
    .flatMap((item) =>
      item.students
        .filter((stu) =>
          stu.student_mail.toLowerCase().includes(search.toLowerCase())
        )
        .map((stu) => stu.student_mail)
    );

  const deleteTechnology = (tech) => {
    axiosInstance
      .delete("/deletebranch", {
        data: { faculty_id: admin, technology: tech },
      })
      .then((response) => {
        toast.success(response.data.message);
        setStudents((prev) => prev.filter((q) => q.technology !== tech));
        setIsActive("all");
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error.message);
      });
  };

  const handleDelete = (mail) => {
    axiosInstance
      .delete(`/deletestudent/${mail}`, {
        data: {
          faculty_id: admin,
          technology: technology,
        },
      })
      .then((response) => {
        toast.success(response.data.message);
        setStudents((prev) => prev.filter((q) => q.student_mail !== mail));
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error.message);
      });
  };

  return (
    <div className="w-full h-full bg-gray-100 flex sm:gap-1 md:gap-3 overflow-y-auto hide-scrollbar sm:p-1 md:p-3">
      <div
        className={`${
          isOpen ? "md:w-15" : "sm:w-35 md:w-1/3"
        } h-full bg-white flex flex-col gap-5 sm:p-2 md:p-5 transition-all duration-300`}
      >
        <div className="flex justify-between items-center">
          <p
            className={`${
              isOpen
                ? "hidden"
                : "sm:text-lg md:text-xl font-bold text-gray-900"
            }`}
          >
            Students
          </p>
          <RiMenuFoldFill
            className="text-xl font-bold text-gray-500 cursor-pointer sm:hidden md:block"
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>
        <input
          type="text"
          placeholder="Search"
          className={`${
            isOpen
              ? "hidden"
              : "w-full h-10 rounded-lg border border-gray-500 px-2 text-sm focus:outline-none"
          }`}
          onChange={(e) => setSearchTech(e.target.value)}
        />
        <div className={`${isOpen ? "hidden" : "w-full flex flex-col"}`}>
          <p className="font-semibold text-lg underline text-gray-900">
            Technology
          </p>
          <div
            className={`flex items-center text-[12px] font-semibold h-7 md:pl-5 mt-3 gap-2 capitalize cursor-pointer ${
              isActive === "all" ? "bg-amber-100 text-amber-500" : "text-black"
            }`}
            onClick={() => handleTechClick("all")}
          >
            <PiStudentBold
              size={isActive === "all" ? 20 : 18}
              className="text-amber-500"
            />
            <p>all students</p>   
          </div>
          {technology
            .filter(
              (cat) =>
                typeof cat === "string" &&
                cat.toLowerCase().includes(searchTech.toLowerCase().trim())
            )
            .map((tech, idx) => (
              <div className="w-full" key={idx}>
                <div
                  onClick={() => handleTechClick(tech)}
                  className={`flex justify-between items-center text-[12px] font-semibold h-7 md:pl-5 pr-3 cursor-pointer capitalize ${
                    isActive === tech
                      ? "bg-amber-100 text-amber-500"
                      : "text-black"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <PiStudentBold
                      size={isActive === tech ? 20 : 18}
                      className="text-amber-500"
                    />
                    <p>{tech}</p>         
                  </div>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTechnology(tech);
                    }}
                    className="hover:bg-red-100 rounded-full p-[2px] cursor-pointer"
                  >
                    <MdOutlineDelete size={18} color="red" />         
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="w-full h-full bg-white p-5 overflow-y-auto hide-scrollbar">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const state = {};
                if (isActive !== "all") {
                  state.selectedTechnology = isActive;
                }
                navigate("/admin/students/add-student", { state });
              }}
              className="bg-[#C3E76D] p-2 text-sm rounded-sm flex items-center gap-1 cursor-pointer text-gray-700"
            >
              <GoPlus size={18} />     
              <p className="sm:hidden md:block">Add Student</p>     
            </button>
            <button
              onClick={() => {
                const state = {};
                if (isActive !== "all") {
                  state.selectedTechnology = isActive;
                }
                navigate("/admin/students/upload-students", { state });
              }}
              className="border-1 border-[#C3E76D] p-2 text-sm rounded-sm flex items-center gap-2 cursor-pointer text-[#8ca84c] hover:bg-[#C3E76D] hover:text-gray-700"
            >
              <BsFilePerson size={20} />         
              <p className="sm:hidden xl:block">Upload Students</p>     
            </button>
          </div>
          <div className="w-fit h-8 flex justify-around items-center border-1 border-gray-500 rounded-lg">
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
        <p className="text-sm font-semibold text-amber-500">
          Students count: {filteredStudents.length}     
        </p>
        <div className="mt-5">
          {filteredStudents.map((student, index) => (
            <div
              key={index}
              className="flex justify-between items-start text-sm font-semibold shadow-sm text-gray-500 p-3 hover:bg-amber-50 hover:text-black"
            >
              <div
                onClick={() =>
                  navigate(`/admin/students/personal-info`, { state: student })
                }
                className="flex flex-col gap-3 w-full cursor-pointer"
              >
                <p>{student}</p>           
              </div>
              <p className="text-[12px] text-red-500 ml-5 cursor-pointer whitespace-nowrap">
                <MdOutlineDelete
                  size={15}
                  onClick={() => handleDelete(student)}
                />
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentsPage;
