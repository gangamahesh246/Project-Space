import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainPanel from "./AdminPanel/MainPanel";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/*" element={<MainPanel />} /> 
      </Routes>
    </Router>
  );
};

export default App;
