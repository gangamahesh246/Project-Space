import React from "react";
import Home from "./Home_page/home";
import MainPanel from "./AdminPanel/MainPanel";
import BasicInfo from "./AdminPanel/Components/CreateExam/BasicInfo";
import StepWrapper from "./AdminPanel/Components/CreateExam/StepWrapper";
import AddQuestions from "./AdminPanel/Components/CreateExam/AddQuestions";

const App = () => {
  return (
    <div>
      <MainPanel />
    </div>
  );
};

export default App;
