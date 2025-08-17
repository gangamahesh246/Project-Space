import React from "react";
import { useLocation } from "react-router-dom";

const Violations = () => {
  const location = useLocation();
  const data = location.state;

  return (
    <div className="w-full h-fit bg-white px-5 pb-12">
      <p className="text-2xl font-bold text-amber-500 py-4">Report</p>
      <table className="min-w-full table-cell text-sm shadow-sm overflow-hidden">
        <thead className="bg-amber-100 text-amber-500">
          <tr className="text-center [&>th]:p-3 [&>th]:font-semibold border-b">
            <th>Violation Type</th>
            <th>Violation Count</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 divide-y divide-gray-200">
          <tr className="hover:bg-gray-50 text-center">
            <td className="p-3">Devtools Violation</td>
            <td>{data.violations.devtoolsViolation}</td>
          </tr>
          <tr className="hover:bg-gray-50 text-center">
            <td className="p-3">Fullscreen Violation</td>
            <td>{data.violations.fullscreenViolation}</td>
          </tr>
          <tr className="hover:bg-gray-50 text-center">
            <td className="p-3">Tab Switching Violation</td>
            <td>{data.violations.tabSwitchingViolation}</td>
          </tr>
          <tr className="hover:bg-gray-50 text-center">
            <td className="p-3">RightClick Violation</td>
            <td>{data.violations.rightClickViolation}</td>
          </tr>
          <tr className="hover:bg-gray-50 text-center">
            <td className="p-3">Sound Violation</td>
            <td>{data.violations.soundViolation}</td>
          </tr>
          <tr className="hover:bg-gray-50 text-center">
            <td className="p-3">Webcam Violation</td>
            <td>{data.violations.webcamViolation}</td>
          </tr>
        </tbody>
      </table>

      <div className="grid grid-cols-2 gap-4 p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {data.violationPhotos.map((item, index) => (
            <div className="bg-white p-2 rounded-lg shadow" key={index}>
              <img
                src={`${import.meta.env.VITE_Base_URL}${item}`}
                alt={`Violation ${index + 1}`}
                className="w-full h-fit object-cover rounded"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Violations;
