import React, { useState, useEffect } from "react";
import axios from "axios";
import { CiSearch } from "react-icons/ci";
import { RiMenuFoldFill } from "react-icons/ri";
import { TiFolderAdd } from "react-icons/ti";
import { FaFolderOpen } from "react-icons/fa";
import { GoPlus } from "react-icons/go";
import { TbFileUpload } from "react-icons/tb";
import { useNavigate } from "react-router-dom";


const QuestionsPage = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [isActive, setIsActive] = useState("all");
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);
  const [upload, setUpload] = useState(false);
  const [searchCategory, setSearchCategory] = useState("");
  const [addCategory, setAddCategory] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/getquestions")
      .then((response) => {
        setQuestions(response.data);
        const allCats = response.data.map((q) => q.category);
        setCategories(allCats);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const filteredQuestions = (
    isActive === "all"
      ? questions.flatMap((q) => q.questions)
      : questions.find((q) => q.category === isActive)?.questions || [] || setUpload(true)
  ).filter(
    (q) =>
      q.question.toLowerCase().includes(search.toLowerCase()) ||
      q.options.some((opt) => opt.toLowerCase().includes(search.toLowerCase()))
  );

  const AddCategory = () => {
    axios
      .post("http://localhost:3000/addcategory", { category: addCategory })
      .then((response) => {
        console.log(response.data);
        setCategories([...categories, addCategory]);
        setAddCategory("");
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return (
    <div className="w-full h-full bg-aliceblue flex gap-3 overflow-y-auto hide-scrollbar p-3">
      <div className="w-1/3 h-full bg-white flex flex-col gap-5 rounded-lg shadow-lg p-5">
        <div className="flex justify-between items-center">
          <p className="text-xl font-bold">Questions</p>
          <p className="text-xl font-bold text-gray-500">
            <RiMenuFoldFill />
          </p>
        </div>
        <div className=" w-full h-10 flex justify-around items-center border-1 border-gray-500 rounded-lg">
          <input
            type="text"
            placeholder="Search category"
            className="text-sm font-semibold outline-none"
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
          />
          <CiSearch color="green" />
        </div>
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold">Question categories</p>
          <p className="text-xl font-bold text-gray-500">
            <TiFolderAdd className="cursor-pointer" onClick={() => setShow(!show)}/>
          </p>
        </div>
        {show && 
        <div className="flex justify-between items-center gap-2">
          <input
            type="text"
            placeholder="Add category"
            className="text-sm font-semibold outline-none border-1 border-gray-500 rounded-lg shadow-2xl p-1 bg-white "
            value={addCategory}
            onChange={(e) => setAddCategory(e.target.value)}
          />
          <button className="text-sm font-semibold py-1 px-3 bg-blue-500 rounded text-white cursor-pointer outline-none " onClick={AddCategory}>Add</button>
        </div>}
        <div className="w-full flex flex-col">
          <div
            className={`flex items-center text-[12px] font-semibold h-7 pl-5 gap-2 capitalize cursor-pointer
              ${
                isActive === "all"
                  ? "bg-green-100 text-green-500"
                  : "text-black"
              }`}
            onClick={() => setIsActive("all")}
          >
            <FaFolderOpen size={18} className="text-green-500 cursor-pointer" />
            <p>all questions</p>
          </div>
          {categories
            .filter((cat) =>
              cat.toLowerCase().includes(searchCategory.toLowerCase())
            )
            .map((cat, idx) => {
              return (
                <div
                  key={idx}
                  onClick={() => setIsActive(cat)}
                  className={`flex items-center text-[12px] font-semibold h-7 pl-5 gap-2 capitalize cursor-pointer
                ${
                  isActive === cat
                    ? "bg-green-100 text-green-500"
                    : "text-black"
                }`}
                >
                  <FaFolderOpen size={18} className="text-green-500" />
                  <p>{cat}</p>
                </div>
              );
            })}
        </div>
      </div>
      <div className="w-full h-full bg-white rounded-lg shadow-lg p-5 overflow-y-auto hide-scrollbar">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <button 
            onClick={() => {navigate("/questions/add-question")}}
            className="bg-green-500 p-2 text-sm rounded-sm flex items-center gap-1 cursor-pointer text-white">
              <GoPlus /> New question
            </button>
            <button 
            onClick={() => {navigate("/questions/upload-questions")}}
            className="border-1 border-green-500 p-2 text-sm rounded-sm flex items-center gap-2 cursor-pointer text-green-500">
              <TbFileUpload size={20} /> Add questions
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
          Questions count: {filteredQuestions.length}
        </p>
        <div className="mt-5">
          {filteredQuestions.map((question, index) => {
            return (
              <div
                key={index}
                className="flex justify-between items-start text-sm font-semibold border-t-2 border-gray-200 text-gray-500 p-3"
              >
                <div className="flex flex-col gap-3 w-full">
                  <p>
                    {index + 1}. {question.question}
                  </p>
                  {question.options.map((option, idx) => (
                    <p className="ml-5" key={idx}>
                      {String.fromCharCode(65 + idx)}. {option}
                    </p>
                  ))}
                  <p className="flex gap-1">
                    Correct Answer:
                    {question.correct.map((c, i) => (
                      <span key={i}>{c}</span>
                    ))}
                  </p>
                </div>
                <p className="text-[12px] text-blue-500 ml-5 cursor-pointer whitespace-nowrap">
                  Modify
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuestionsPage;
