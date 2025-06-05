import React, { useState, Suspense } from "react";

const TakenList = () => {
  const [isActive, setIsActive] = useState("completed");
  const buttonClass = (type) =>
    isActive === type ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700";

  const renderActiveComponent = () => {
    switch (isActive) {
      case "completed":
        return <Completed />;
      case "unfinished":
        return <Unfinished />;
      case "rankings":
        return <Rankings />;
      default:
        return <Completed />;
    }
  };

  return (
    <div className="w-full h-full bg-aliceblue overflow-y-auto hide-scrollbar p-2">
      <div className="flex items-center h-10 w-full text-sm text-gray-500 gap-3 p-2">
        <p>Exams &gt;</p>
        <p className="text-black">(ExamName)</p>
        <p className="text-black">Taken List</p>
      </div>
      <div className="bg-white h-fit w-full rounded-lg overflow-y-auto shadow-2xl">
        <div className="flex items-center h-12 w-full border-b-2 border-gray-200 gap-3 p-2 text-sm font-semibold">
          <button
            className={`rounded-lg cursor-pointer px-4 py-2 ${buttonClass(
              "completed"
            )}`}
            onClick={() => setIsActive("completed")}
          >
            Completed {1}
          </button>
          <button
            className={`rounded-lg cursor-pointer px-4 py-2 ${buttonClass(
              "unfinished"
            )}`}
            onClick={() => setIsActive("unfinished")}
          >
            Unfinished {0}
          </button>
          <button
            className={`rounded-lg cursor-pointer px-4 py-2 ${buttonClass(
              "rankings"
            )}`}
            onClick={() => setIsActive("rankings")}
          >
            Rankings
          </button>
        </div>
        <Suspense fallback="Loading...">{renderActiveComponent()}</Suspense>
      </div>
    </div>
  );
};

export default TakenList;

const Completed = () => {
  return (
    <div className="w-full h-full p-2 flex flex-col gap-5">
      <div className="h-fit">
        <input
          type="text"
          className="border border-gray-300 rounded-lg p-2 text-sm"
          placeholder="Search"
        />
      </div>
      <div>
        <table className="w-full border-collapse text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
                <tr className="[&>th]:p-2 [&>th]:font-semibold text-center">
                    <th>#</th>
                    <th>Candidates</th>
                    <th>Score</th>
                    <th>Scoring rank</th>
                    <th>Start time</th>
                    <th>Last operation time</th>
                    <th>Time spend</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody className="text-gray-600">
                <tr className="border-b [&>td]:p-2 text-center">
                    <td>1</td>
                    <td>23mh5a4213@acoe.edu.in</td>
                    <td>90</td>
                    <td>10</td>
                    <td>2025-06-04 08:14:29 PM</td>
                    <td>2025-06-04 08:20:35 PM</td>
                    <td>00:06:06</td>
                    <td>
        <button className="text-blue-700">
          View
        </button>
      </td>
    </tr>
  </tbody>
</table>

      </div>
    </div>
  );
};

const Unfinished = () => {
  return (
    <div className="w-full h-full p-2 flex flex-col gap-5">
      <div className="h-fit">
        <input
          type="text"
          className="border border-gray-300 rounded-lg p-2 text-sm"
          placeholder="Search"
        />
      </div>
      <div>
        <table className="w-full border-collapse text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
                <tr className="[&>th]:p-2 [&>th]:font-semibold text-center">
                    <th>#</th>
                    <th>Candidates</th>
                    <th>Start time</th>
                </tr>
            </thead>
            <tbody className="text-gray-600">
                <tr className="border-b [&>td]:p-2 text-center">
                    <td>1</td>
                    <td>23mh5a4213@acoe.edu.in</td>
                    <td>2025-06-04 08:14:29 PM</td>
                </tr>
            </tbody>
            </table>

      </div>
    </div>
  );
};

const Rankings = () => {
  return (
    <div className="w-full h-full p-2 flex flex-col justify-center items-center gap-5 ">
        <div className="w-1/2 h-30 flex justify-between items-center rounded p-2 shadow-2xl">
            <p>Mahesh</p>
            <p>100 points</p>
        </div>
    </div>
  );
};
