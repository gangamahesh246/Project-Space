import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import { RiFileExcel2Fill } from "react-icons/ri";
import { setSettings } from "../../../slices/ExamSlice";
import { toast } from "react-toastify";

const ConfigureSettings = ({ setActiveTab, isOpen, setisOpen, id }) => {
  const dispatch = useDispatch();
  const time = useSelector((state) => state.exam.settings);

  const [file, setFile] = useState(null);
  const [students, setStudents] = useState([]);
  const [branch, setBranch] = useState([]);
  const [expandedBranch, setExpandedBranch] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  const [isActive, setIsActive] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/getstudents")
      .then((response) => {
        setStudents(response.data);
        const allbranches = [...new Set(response.data.map((q) => q.branch))];
        setBranch(allbranches);
        setIsActive(allbranches[0]);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error.message);
      });
  }, []);

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

  const filteredStudents = useMemo(() => {
    if (!isActive) return [];
    return students
      .filter((student) => {
        const branchMatch = student.branch === isActive;
        const sectionMatch =
          expandedSection 
            ? student.section === expandedSection && student.branch === isActive
            : true;
        return branchMatch && sectionMatch;
      })
      .map((student) => student.student_mail);
  }, [students, isActive, expandedSection]);

  useEffect(() => {
    if (isOpen && id) {
      axios
        .get(`http://localhost:3000/getexam/${id}`)
        .then((res) => {
          if (res.data?.settings) {
            setLocalSettings(res.data.settings);
          }
        })
        .catch((error) => {
          toast.error(error?.response?.data?.message || error.message);
        });
    }
  }, [isOpen, id]);

  const [settings, setLocalSettings] = useState({
    availability: {
      timeLimitDays: {
        from: "",
        to: "",
      },
      permanent: false,
      lateTime: "",
    },
    examTakenTimes: {
      type: "unlimited",
      multiple: 0,
    },
    answerTimeControl: {
      type: "fixed",
      examTime: time.examTime,
      questionTime: time.questionTime,
    },
    assignExamTo: {
      specificUsers: [],
    },
    autoSubmit: {
      disableAutoSubmit: true,
      autoSubmitAtEnd: false,
    },
    results: {
      displayScore: {
        enabled: true,
        showRankingList: false,
        totalPoints: 0,
        passPercentage: 0,
        negativeMarking: 0,
      },
    },
    antiCheating: {
      switchingScreen: 0,
      copyPastePrevention: false,
      forceFullscreen: false,
      webcam: false,
    },
  });

  const updateExam = async (id, examData) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/updateexam/${id}`,
        {
          examData,
        }
      );

      toast.success(response.data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const handleAvailabilityChange = (e, field) => {
    const selectedDate = e.target.value;
    const now = new Date();

    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;
    const hourStr = hours.toString().padStart(2, "0");

    const time12hr = `${hourStr}:${minutes}:${seconds} ${ampm}`;

    const fullDateTime = `${selectedDate} ${time12hr}`;

    setLocalSettings((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        timeLimitDays: {
          ...prev.availability.timeLimitDays,
          [field]: fullDateTime,
        },
      },
    }));
  };

  useEffect(() => {
    setLocalSettings((prev) => ({
      ...prev,
      assignExamTo: {
        ...prev.assignExamTo,
        specificUsers: filteredStudents,
      },
    }));
  }, [filteredStudents]);

  const handleLateTimeChange = (e) => {
    setLocalSettings((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        lateTime: e.target.value,
      },
    }));
  };

  const handlePassPercentageChange = (e) => {
    setLocalSettings((prev) => ({
      ...prev,
      results: {
        displayScore: {
          ...prev.results.displayScore,
          passPercentage: +e.target.value,
        },
      },
    }));
  };

  const handleTotalPoints = (e) => {
    setLocalSettings((prev) => ({
      ...prev,
      results: {
        displayScore: {
          ...prev.results.displayScore,
          totalPoints: +e.target.value,
        },
      },
    }));
  };

  const handleExamTakenChange = (type, value = 0) => {
    setLocalSettings((prev) => ({
      ...prev,
      examTakenTimes: {
        type,
        multiple: type === "multiple" ? value : 0,
      },
    }));
  };

  const handleAnswerTimeControlChange = (field, value) => {
    setLocalSettings((prev) => ({
      ...prev,
      answerTimeControl: {
        ...prev.answerTimeControl,
        type: field === "type" ? value : prev.answerTimeControl.type,
        [field]: value,
      },
    }));
  };

  const handleQuestionTimeChange = (e) => {
    setLocalSettings((prev) => ({
      ...prev,
      answerTimeControl: {
        ...prev.answerTimeControl,
        questionTime: e.target.value,
      },
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (evt) => {
      const data = evt.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { raw: true });

      const studentEmails = jsonData
        .map((entry) => entry["Student Email"])
        .filter(Boolean);
      toast.success("File uploaded successfully");

      setLocalSettings((prev) => ({
        ...prev,
        assignExamTo: {
          ...prev.assignExamTo,
          specificUsers: studentEmails,
        },
      }));
    };

    reader.readAsBinaryString(file);
  };

  const handleAutoSubmitChange = (field) => {
    setLocalSettings((prev) => ({
      ...prev,
      autoSubmit: {
        disableAutoSubmit: field === "disable",
        autoSubmitAtEnd: field === "end",
      },
    }));
  };

  const handleDisplayScoreChange = (enabled) => {
    setLocalSettings((prev) => ({
      ...prev,
      results: {
        displayScore: {
          ...prev.results.displayScore,
          enabled,
        },
      },
    }));
  };

  const handleRankingListChange = (e) => {
    setLocalSettings((prev) => ({
      ...prev,
      results: {
        displayScore: {
          ...prev.results.displayScore,
          showRankingList: e.target.checked,
        },
      },
    }));
  };

  const handleAntiCheatingChange = (field, value) => {
    setLocalSettings((prev) => ({
      ...prev,
      antiCheating: {
        ...prev.antiCheating,
        [field]: value,
      },
    }));
  };

  const handleNegativeMarkingToggle = (checked) => {
    setLocalSettings((prev) => ({
      ...prev,
      results: {
        ...prev.results,
        displayScore: {
          ...prev.results.displayScore,
          negativeMarking: checked ? 0.25 : 0,
        },
      },
    }));
  };

  const handleNegativeMarkingValueChange = (value) => {
    setLocalSettings((prev) => ({
      ...prev,
      results: {
        ...prev.results,
        displayScore: {
          ...prev.results.displayScore,
          negativeMarking: parseFloat(value),
        },
      },
    }));
  };

  const isVisible = settings.assignExamTo.specificUsers.length > 0;

  return (
    <div className="w-full h-fit bg-white shadow-xl p-5 text-primary">
      <p className="w-full h-fit text-xl font-semibold">General settings</p>

      <p className="w-full block font-semibold border-l-4 border-secondary pl-2 m-5">
        Availability
      </p>
      <div className="ml-6 sm:flex sm:flex-col xl:flex-row xl:gap-5">
        <p>Currently:</p>
        <div className="flex flex-col gap-5">
          <div className="xl:h-5 sm:flex sm:flex-col sm:gap-2 md:flex-row xl:gap-2 md:items-center">
            <input
              type="radio"
              checked={!settings.availability.permanent}
              onChange={() =>
                setLocalSettings((prev) => ({
                  ...prev,
                  availability: { ...prev.availability, permanent: false },
                }))
              }
            />
            set time limit
            <input
              type="date"
              className="border-2 border-primary p-1"
              value={
                settings.availability.timeLimitDays.from?.split(" ")[0] || ""
              }
              onChange={(e) => handleAvailabilityChange(e, "from")}
            />
            To
            <input
              type="date"
              className="border-2 border-primary p-1"
              value={
                settings.availability.timeLimitDays.to?.split(" ")[0] || ""
              }
              onChange={(e) => handleAvailabilityChange(e, "to")}
            />
          </div>
          <div className="flex gap-2">
            <input
              type="radio"
              checked={settings.availability.permanent}
              onChange={() =>
                setLocalSettings((prev) => ({
                  ...prev,
                  availability: { ...prev.availability, permanent: true },
                }))
              }
            />
            Permanent
          </div>
        </div>
      </div>

      <div className="ml-6 mt-5 sm:flex sm:flex-col xl:flex-row xl:items-center gap-2">
        Late time:
        <input
          type="number"
          className="w-20 border-2 border-primary"
          value={settings.availability.lateTime}
          onChange={handleLateTimeChange}
        />
        minutes.
        <p className="text-gray-500 text-sm">
          (Candidates will not be allowed to take the exam, X mins after the
          exam beginning.)
        </p>
      </div>

      <p className="w-full block font-semibold border-l-4 border-secondary pl-2 mt-10 ml-5">
        Exam Taken Times
      </p>
      <div className="ml-13 mt-5 flex flex-col gap-2">
        <p className="flex gap-2 items-center">
          <input
            type="radio"
            name="examTimes"
            checked={settings.examTakenTimes.type === "unlimited"}
            onChange={() => handleExamTakenChange("unlimited")}
          />
          Unlimited
        </p>
        <p className="flex gap-2 items-center">
          <input
            type="radio"
            name="examTimes"
            checked={settings.examTakenTimes.type === "one"}
            onChange={() => handleExamTakenChange("one")}
          />
          One
        </p>
        <p className="flex gap-2 items-center">
          <input
            type="radio"
            name="examTimes"
            checked={settings.examTakenTimes.type === "multiple"}
            onChange={() =>
              handleExamTakenChange(
                "multiple",
                settings.examTakenTimes.multiple
              )
            }
          />
          Multiple:
          <input
            type="number"
            className="w-15 border-2 border-primary"
            value={settings.examTakenTimes.multiple}
            onChange={(e) => handleExamTakenChange("multiple", +e.target.value)}
          />
          times
        </p>
      </div>

      <p className="w-full block font-semibold border-l-4 border-secondary pl-2 mt-10 ml-5">
        Answer Time Control
      </p>
      <div className="ml-10 mt-5 sm:flex sm:flex-col xl:flex-row xl:gap-10">
        <p className="flex gap-2">
          <input
            type="radio"
            name="timeControl"
            checked={settings.answerTimeControl.type === "fixed"}
            onChange={() => handleAnswerTimeControlChange("type", "fixed")}
          />
          Fixed time
        </p>
        <p className="flex gap-2">
          Time to complete exam:
          <input
            type="number"
            className="w-15 border-2 border-primary"
            value={settings.answerTimeControl.examTime}
            onChange={(e) =>
              handleAnswerTimeControlChange("examTime", +e.target.value)
            }
          />
          minutes
        </p>
      </div>

      <div className="text-gray-500 text-sm ml-10">
        (Within the stipulated opening hours, no matter when the candidate
        enters the test, the duration of the test will not be affected, and the
        setting of 0 indicates the unlimited duration.)
      </div>

      <div className="ml-10 mt-3 flex flex-col gap-1">
        <p className="flex gap-2">
          <input
            type="radio"
            name="timeControl"
            checked={settings.answerTimeControl.type === "dynamic"}
            onChange={() => handleAnswerTimeControlChange("type", "dynamic")}
          />
          Dynamic time
        </p>
        <div className="text-gray-500 text-sm">
          (Dynamic time has an effect on the duration of the test. The later the
          candidate enters the test, the shorter the remaining time will be. If
          it is set from 1pm to 3pm, when candidates enter the exam at 2pm,
          there is only one hour left.)
        </div>
      </div>

      <div className="ml-10 mt-5 flex gap-10">
        <p className="flex gap-2">
          Time limit per question:{" "}
          <input
            type="number"
            className="w-15 border-2 border-primary"
            value={settings.answerTimeControl.questionTime}
            onChange={handleQuestionTimeChange}
          />
          seconds
        </p>
      </div>

      <div className="space-y-2">
        <p className="w-full block font-semibold border-l-4 border-secondary pl-2 mt-10 ml-5">
          Assign Exam
        </p>
        <p className="text-gray-500 text-sm ml-7">(Through college mails)</p>
        <div className="w-fit xl:ml-10 xl:mt-3 sm:flex sm:flex-col lg:flex-row items-center sm:gap-5 xl:gap-10">
          <div className="flex h-fit flex-col items-center shadow-lg gap-2 p-3 rounded">
            <RiFileExcel2Fill size={30} color="#00C951" />
            <p className="text-gray-500 font_primary text-center text-sm">
              Drag & drop files here or select a file to upload questions in
              bulk
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
          <div
            className={`w-80 h-40 border-2 rounded overflow-y-auto ${
              isVisible ? "block" : "hidden"
            }`}
          >
            {settings.assignExamTo.specificUsers.map((std, index) => (
              <p key={index} className="font-semibold text-gray-500  p-2">
                {index + 1}. {std}
              </p>
            ))}
          </div>
        </div>
        <p className="text-gray-500 text-sm ml-7">(Through Branch & Section)</p>
        <div className="xl:w-50 xl:ml-10 xl:mt-3 shadow-lg rounded overflow-hidden">
          {branch.map((br, idx) => (
            <div className="w-full">
              <div
                key={idx}
                onClick={() => handleBranchClick(br)}
                className={`flex justify-between items-center text-[12px] font-semibold h-7 md:pl-5 pr-3 cursor-pointer capitalize ${
                  isActive === br ? "bg-green-100 text-green-500" : "text-black"
                }`}
              >
                <div className="flex items-center gap-2">
                  <p>{br}</p>
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
                  grouped[br] &&
                  Object.keys(grouped[br])
                    .sort((a, b) => a.localeCompare(b))
                    .map((sec, secIdx) => (
                      <div className="flex items-center gap-5" key={secIdx}>
                        <div
                          onClick={() => handleSectionClick(sec)}
                          className={`sm:pl-5 md:pl-10 text-[12px] md:h-6 cursor-pointer font-medium capitalize flex items-center ${
                            expandedSection === sec
                              ? "text-blue-500 underline"
                              : "text-gray-600"
                          }`}
                        >
                          ↳ Section {sec}
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="w-full block font-semibold border-l-4 border-secondary pl-2 mt-10 ml-5">
        Auto submit
      </p>
      <div className="ml-10 mt-3 flex flex-col gap-1">
        <p className="flex gap-2">
          <input
            type="radio"
            name="autoSubmit"
            checked={settings.autoSubmit.disableAutoSubmit}
            onChange={() => handleAutoSubmitChange("disable")}
          />
          Disable auto submit
        </p>
        <p className="flex gap-2">
          <input
            type="radio"
            name="autoSubmit"
            checked={settings.autoSubmit.autoSubmitAtEnd}
            onChange={() => handleAutoSubmitChange("end")}
          />
          Auto submit at the end of exam
        </p>
      </div>

      <p className="w-full block font-semibold border-l-4 border-secondary pl-2 mt-10 ml-5">
        Results
      </p>
      <div className="ml-10 mt-3 flex gap-5">
        <p className="flex gap-2">
          <input
            type="radio"
            name="displayScore"
            checked={settings.results.displayScore.enabled}
            onChange={() => handleDisplayScoreChange(true)}
          />
          Display score
        </p>
        <p className="flex gap-2">
          <input
            type="radio"
            name="displayScore"
            checked={!settings.results.displayScore.enabled}
            onChange={() => handleDisplayScoreChange(false)}
          />
          Not display score
        </p>
      </div>

      <p className="ml-10 mt-3 flex gap-2">
        <input
          type="checkbox"
          checked={settings.results.displayScore.showRankingList}
          onChange={handleRankingListChange}
        />
        View ranking list
      </p>
      <p className="ml-10 mt-3 flex gap-2">
        <input
          type="number"
          value={settings.results.displayScore.totalPoints}
          className="w-10 border-2"
          onChange={handleTotalPoints}
        />
        Total Points
      </p>
      <p className="ml-10 mt-3 flex gap-2">
        <input
          type="number"
          value={settings.results.displayScore.passPercentage}
          className="w-10 border-2"
          onChange={handlePassPercentageChange}
        />
        Pass percentage(%)
      </p>
      <p className="ml-10 mt-3 flex gap-2 items-center">
        <input
          type="checkbox"
          checked={settings.results.displayScore.negativeMarking !== 0}
          onChange={(e) => handleNegativeMarkingToggle(e.target.checked)}
        />
        Negative Marking
        <select
          disabled={settings.results.displayScore.negativeMarking === 0}
          value={settings.results.displayScore.negativeMarking}
          onChange={(e) => handleNegativeMarkingValueChange(e.target.value)}
          className="border-2"
        >
          <option value="0.25">0.25</option> <option value="0.5">0.5</option>
          <option value="1">1</option>
        </select>
      </p>

      <p className="w-full block font-semibold border-l-4 border-secondary pl-2 mt-10 ml-5">
        Anti cheating
      </p>
      <div className="ml-10 mt-3 flex flex-col gap-3">
        <p className="flex gap-2">
          <input
            type="checkbox"
            checked={settings.antiCheating.switchingScreen > 0}
            onChange={(e) =>
              handleAntiCheatingChange(
                "switchingScreen",
                e.target.checked ? 1 : 0
              )
            }
          />
          Force to hand in test papers after switching the screen
          <input
            type="number"
            className="w-10 border-2 border-primary"
            value={settings.antiCheating.switchingScreen}
            onChange={(e) =>
              handleAntiCheatingChange("switchingScreen", +e.target.value)
            }
          />
          times.
        </p>
        <p className="flex gap-2">
          <input
            type="checkbox"
            checked={settings.antiCheating.copyPastePrevention}
            onChange={(e) =>
              handleAntiCheatingChange("copyPastePrevention", e.target.checked)
            }
          />
          Disable copy paste
        </p>
        <p className="flex gap-2">
          <input
            type="checkbox"
            checked={settings.antiCheating.forceFullscreen}
            onChange={(e) =>
              handleAntiCheatingChange("forceFullscreen", e.target.checked)
            }
          />
          Enter full screen
        </p>
        <p className="flex gap-2">
          <input
            type="checkbox"
            checked={settings.antiCheating.webcam}
            onChange={(e) =>
              handleAntiCheatingChange("webcam", e.target.checked)
            }
          />
          Enable webcam
        </p>
      </div>
      {isOpen ? (
        <div
          className="w-full h-10 mt-5 border-1 border-secondary text-sm font-bold text-center pt-2 cursor-pointer text-[#00C951] hover:bg-green-500 hover:text-white transition-all duration-200 "
          onClick={() => {
            setisOpen(!isOpen);
            updateExam(id, settings);
          }}
        >
          Publish
        </div>
      ) : (
        <div
          className="w-full h-10 mt-5 border-1 border-secondary text-sm font-bold text-center pt-2 cursor-pointer text-[#00C951] hover:bg-green-500 hover:text-white transition-all duration-200 "
          onClick={() => {
            setActiveTab("finish");
            dispatch(setSettings(settings));
            setLocalSettings({
              availability: {
                timeLimitDays: {
                  from: "",
                  to: "",
                },
                permanent: false,
                lateTime: "",
              },
              examTakenTimes: {
                type: "unlimited",
                multiple: 0,
              },
              answerTimeControl: {
                type: "fixed",
                examTime: time.examTime,
                questionTime: time.questionTime,
              },
              assignExamTo: {
                specificUsers: [],
              },
              autoSubmit: {
                disableAutoSubmit: true,
                autoSubmitAtEnd: false,
              },
              results: {
                displayScore: {
                  enabled: true,
                  showRankingList: false,
                  totalPoints: 0,
                  passPercentage: 0,
                  negativeMarking: 0,
                },
              },
              antiCheating: {
                switchingScreen: 0,
                copyPastePrevention: false,
                forceFullscreen: false,
                webcam: false,
              },
            });
          }}
        >
          Save & Next
        </div>
      )}
    </div>
  );
};

export default ConfigureSettings;
