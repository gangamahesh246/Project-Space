import React, { useState } from "react";
import * as XLSX from "xlsx";
import { RiFileExcel2Fill } from "react-icons/ri";
import { useSelector, useDispatch } from "react-redux";
import { FaPencilAlt } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { setQuestions, setSettings } from "../../../slices/ExamSlice";

const PreSelected = ({ handleFileUpload }) => (
  <div className="p-4 h-5/6 flex flex-col items-center justify-center gap-4">
    <RiFileExcel2Fill size={100} color="#00C951" />
    <input
      type="file"
      accept=".xlsx, .xls"
      onChange={handleFileUpload}
      className="border-2 border-dashed border-gray-300 rounded-md p-4 cursor-pointer w-fit "
    />
  </div>
);
const Categories = () => <div className="p-4">Categories Content</div>;

const AddQuestions = ({ setActiveTab }) => {
  const dispatch = useDispatch();

  const title = useSelector((state) => state.exam.basicInfo.title);

  const [isActive, setIsActive] = useState("PreSelected");
  const [isopen, setIsOpen] = useState(false);
  const [time, setTime] = useState({
    examTime: 30,
    questionTime: 0,
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
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
          correct: keys["correctanswer"],
        };
      });

      dispatch(setQuestions(formattedQuestions));
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="w-full h-fit bg-aliceblue flex justify-center gap-4 p-4">
      <div className="w-4/6 h-full bg-white rounded-md p-4">
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
        <div className="w-full h-98.5">
          {isActive === "PreSelected" ? (
            <PreSelected handleFileUpload={handleFileUpload} />
          ) : (
            <Categories />
          )}
        </div>
      </div>
      <div className="w-2/6 h-fit bg-white rounded-md p-4 flex flex-col justify-center items-start gap-4">
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
      <div className="bg-white w-140 rounded-md p-6 flex flex-col items-center gap-4 shadow-lg">
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
