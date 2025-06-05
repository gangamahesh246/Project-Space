import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPanel from "./AdminPanel/MainPanel";
import TakenList from "./AdminPanel/Components/Takenlist/TakenList";
import ExamQuestions from "./AdminPanel/Components/Takenlist/ExamQuestions";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPanel />}>
          <Route path="takenlist" element={<TakenList />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
