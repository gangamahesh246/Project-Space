import React, { Suspense } from "react";
import { PiNumberSquareOne } from "react-icons/pi";
import { PiNumberSquareOneFill } from "react-icons/pi";
import { PiNumberSquareTwo } from "react-icons/pi";
import { PiNumberSquareTwoFill } from "react-icons/pi";
import { PiNumberSquareThree } from "react-icons/pi";
import { PiNumberSquareThreeFill } from "react-icons/pi";
import { PiNumberSquareFour } from "react-icons/pi";

const BasicInfo = React.lazy(() => import("./BasicInfo"));

let steps = [
  {
    key: "basicInfo",
    name: "Basic information",
    normal: <PiNumberSquareOne size={20} />,
    fill: <PiNumberSquareOneFill size={20} color="#00C951" />,
  },
  {
    key: "addQuestions",
    name: "Add questions",
    normal: <PiNumberSquareTwo size={20} />,
    fill: <PiNumberSquareTwoFill size={20} color="#00C951" />,
  },
  {
    key: "customizedSettings",
    name: "Customized settings",
    normal: <PiNumberSquareThree size={20} />,
    fill: <PiNumberSquareThreeFill size={20} color="#00C951" />,
  },
  {
    key: "finish",
    name: "Finish",
    normal: <PiNumberSquareFour size={20} />,
  },
];

const StepWrapper = () => {
  const [activeTab, setActiveTab] = React.useState("basicInfo");

  const activeStepIndex = steps.findIndex((step) => step.key === activeTab);

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "basicInfo":
        return <BasicInfo setActiveTab={setActiveTab} />;
      case "addQuestions":
        return <div>Exam Component</div>;
      case "customizedSettings":
        return <div>Questions Component</div>;
      case "finish":
        return <div>Students Component</div>;
      default:
        return <BasicInfo />;
    }
  };
  return (
    <div className="w-full h-fit bg-aliceblue p-10">
      <div className="w-full h-fit bg-white shadow-lg text-sm rounded-lg p-5 font_primary flex justify-around items-center">
        {steps.map((step, index) => {
          return (
            <>
              <div className="flex items-center gap-1">
                {index < activeStepIndex ? step.fill : step.normal} {step.name}
              </div>
              {index < steps.length - 1 && (
                <div
                  className="w-1/8 h-1 rounded-full"
                  style={{
                    backgroundColor:
                      index < activeStepIndex ? "#00C951" : "aliceblue",
                  }}
                ></div>
              )}
            </>
          );
        })}
      </div>
      <div className="w-full h-full p-5">
        <Suspense fallback={<div>Loading...</div>}>
          {renderActiveComponent()}
        </Suspense>
      </div>
    </div>
  );
};

export default StepWrapper;

