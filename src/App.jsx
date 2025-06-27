import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./Home_page/Home";
import Login from "./Home_page/Login";
import MainPanel from "./AdminPanel/MainPanel";
import StudentPanel from "./StudentPanel/StudentPanel";
import Test from "./StudentPanel/components/Test";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./ProctectedRoute";
import { useDispatch } from "react-redux";
import { loginSuccess } from "./slices/adminAuthSlice";
import { useEffect } from "react";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth"));

    if (auth && auth.token && auth.user) {
      dispatch(
        loginSuccess({
          token: auth.token,
          user: auth.user,
          isAdmin: auth.user.isAdmin,
        })
      );
    }
  }, []);
  return (
    <>
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
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/test" element={<Test />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute adminOnly={true}>
              <MainPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/*"
          element={
            <ProtectedRoute>
              <StudentPanel />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;
