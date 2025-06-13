import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainPanel from "./AdminPanel/MainPanel";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <Router>
      <ToastContainer 
        toastClassName="toastify-custom"
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/*" element={<MainPanel />} /> 
      </Routes>
    </Router>
  );
};

export default App;
