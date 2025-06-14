import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { RiFileExcel2Fill } from "react-icons/ri";
import { useSelector, useDispatch } from "react-redux";
import { FaPencilAlt } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { setQuestions, setSettings } from "../../../slices/ExamSlice";
import { toast } from "react-toastify";
import axios from "axios";

const PreSelected = ({ handleFileUpload, file }) => (
  <div className="p-4 xl:h-5/6 flex flex-col items-center justify-center gap-2">
    <RiFileExcel2Fill size={100} color="#00C951" />
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
      className="bg-green-500 text-white rounded-md font-semibold py-2 px-8 cursor-pointer text-center"
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
);
const Categories = () => {
  const dispatch = useDispatch();
  const [qquestions, setQQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isActive, setIsActive] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/getquestions")
      .then((response) => {
        setQQuestions(response.data);
        const allCats = [...new Set(response.data.map((q) => q.category))];
        setCategories(allCats);
        setIsActive(allCats[0]);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error.message);
      });
  }, []);

  const filteredQuestions =
    qquestions.find((q) => q.category === isActive)?.questions || [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Question Categories</h1>

      <div className="flex flex-wrap gap-3 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 cursor-pointer
              ${
                isActive === cat
                  ? "bg-green-500 text-white border-green-500"
                  : "bg-white text-gray-700 border-green-300 hover:bg-green-100"
              }`}
            onClick={() => {setIsActive(cat); dispatch(setQuestions(filteredQuestions))}}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((q, idx) => (
            <div
              key={idx}
              className="border border-gray-200 p-4 rounded-lg shadow-sm bg-white"
            >
              <h2 className="font-semibold mb-2">
                Q{idx + 1}: {q.question}
              </h2>
              <ul className="list-disc pl-6 text-gray-700">
                {q.options.map((opt, i) => (
                  <li key={i}>
                    {String.fromCharCode(65 + i)}. {opt}
                  </li>
                ))}
              </ul>
              <p className="text-green-600 mt-2 text-sm">
                Correct Answer(s): {q.correct.join(", ")}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">
            No questions available for this category.
          </p>
        )}
      </div>
    </div>
  );
};

const AddQuestions = ({ setActiveTab }) => {
  const dispatch = useDispatch();

  const title = useSelector((state) => state.exam.basicInfo.title);

  const [isActive, setIsActive] = useState("PreSelected");
  const [isopen, setIsOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [time, setTime] = useState({
    examTime: 30,
    questionTime: 0,
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setFile(file);
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (evt) => {
      const data = evt.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
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
          marks: keys["marks"],
        };
      });

      dispatch(setQuestions(formattedQuestions));
      toast.success("Successfully uploaded questions");
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="w-full h-fit bg-aliceblue sm:flex sm:flex-col xl:flex-row justify-center gap-4 p-4">
      <div className="xl:w-4/6 h-full bg-white rounded-md p-4">
        <div className="w-full h-10 border-b-2 border-aliceblue text-primary flex items-center font-semibold text-md gap-15">
          <p
            className="cursor-pointer"
            onClick={() => setIsActive("PreSelected")}
            style={
              isActive === "PreSelected"
                ? {
                    borderBottom: "2px solid #00C951",
                    color: "#00C951",
                    transition: "all 0.3s ease-in-out",
                  }
                : {}
            }
          >
            Pre-Selected
          </p>
          <p
            className="cursor-pointer"
            onClick={() => setIsActive("Categories")}
            style={
              isActive === "Categories"
                ? {
                    borderBottom: "2px solid #00C951",
                    color: "#00C951",
                    transition: "all 0.3s ease-in-out",
                  }
                : {}
            }
          >
            Categories
          </p>
        </div>
        <div className="w-full xl:h-98.5 overflow-y-auto">
          {isActive === "PreSelected" ? (
            <PreSelected handleFileUpload={handleFileUpload} file={file} />
          ) : (
            <Categories />
          )}
        </div>
      </div>
      <div className="xl:w-2/6 h-fit bg-white rounded-md p-4 flex flex-col justify-center items-start gap-4">
        <p className="text-primary font-semibold text-md underline">
          Exam Title
        </p>
        <p className="text-primary font-bold text-sm capitalize ml-2">
          ({title})
        </p>
        <div className="w-full h-10 bg-secondary text-primary text-sm font-bold text-center pt-2">
          The Test Time
        </div>
        <div className="w-full h-5 text-primary text-sm font-bold text-center flex justify-around items-center">
          {time.examTime} min{" "}
          <p
            className="flex items-center cursor-pointer gap-1 text-[#00C951]"
            onClick={() => setIsOpen(true)}
          >
            <FaPencilAlt size={13} />
            Edit
          </p>
        </div>
        <div
          className="w-full h-10 border-1 border-secondary text-sm font-bold text-center pt-2 cursor-pointer text-[#00C951] hover:bg-green-500 hover:text-white transition-all duration-200 "
          onClick={() => {
            setActiveTab("customizedSettings");
            const { examTime, questionTime } = time;
            dispatch(setSettings({ examTime, questionTime }));
          }}
        >
          Save & Next
        </div>
      </div>
      {isopen && (
        <TimeSelector
          setIsOpen={setIsOpen}
          time={time}
          setTime={setTime}
          dispatch={dispatch}
        />
      )}
    </div>
  );
};

export default AddQuestions;

const QuestionTimeSetting = ({ handleInputChange, time }) => {
  return (
    <div className="w-full h-full flex justify-center items-center gap-2">
      Time limitation of each question is{" "}
      <input
        type="number"
        className="w-12 h-8 border-2 "
        name="questionTime"
        value={time.questionTime}
        onChange={handleInputChange}
      />{" "}
      seconds.
    </div>
  );
};
const ExamTimeSetting = ({ handleInputChange, time }) => {
  return (
    <div className="w-full h-full flex justify-center items-center gap-2">
      After
      <input
        type="number"
        className="w-12 h-8 border-2"
        name="examTime"
        value={time.examTime}
        onChange={handleInputChange}
      />{" "}
      minutes.
    </div>
  );
};

const TimeSelector = ({ setIsOpen, time, setTime }) => {
  const [selectedOption, setSelectedOption] = useState("Question time setting");

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setTime((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleSave = () => {
    setIsOpen(false);
  };
  return (
    <div className="absolute top-0 left-0 w-full h-full bg-black/30 backdrop-blur-[0.5px] flex justify-center items-center z-50 ">
      <div className="bg-white xl:w-140 rounded-md p-6 flex flex-col items-center sm:gap-2 xl:gap-4 shadow-lg">
        <div className="w-full flex justify-between items-center border-b-2 border-aliceblue">
          <p className="text-primary font-bold text-sm capitalize">
            Edit Test Time
          </p>
          <IoIosClose
            size={20}
            className="cursor-pointer"
            onClick={() => setIsOpen(false)}
          />
        </div>
        <div className="w-full h-5 flex justify-center items-center gap-7">
          <div className="flex justify-center items-center gap-1 text-sm">
            <input
              type="radio"
              className="cursor-pointer text-green-500"
              onChange={() => setSelectedOption("Question time setting")}
              checked={
                selectedOption === "Question time setting" ? true : false
              }
            />
            <p>Question time setting</p>
          </div>
          <div className="flex justify-center items-center gap-1 text-sm">
            <input
              type="radio"
              className="cursor-pointer"
              onChange={() => setSelectedOption("Exam time setting")}
              checked={selectedOption === "Exam time setting" ? true : false}
            />
            <p>Exam time setting</p>
          </div>
        </div>
        <div className="w-full h-40">
          {selectedOption === "Question time setting" ? (
            <QuestionTimeSetting
              handleInputChange={handleInputChange}
              time={time}
            />
          ) : (
            <ExamTimeSetting
              handleInputChange={handleInputChange}
              time={time}
            />
          )}
        </div>
        <div>
          <button
            className="w-24 h-8 border-2 border-secondary text-green-500 text-sm font-bold rounded-md cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
          <button
            className="w-24 h-8 border-2 border-secondary text-green-500 text-sm font-bold rounded-md ml-2 cursor-pointer"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
