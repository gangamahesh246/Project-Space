import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const adminAuth = useSelector((state) => state.login);
  const studentAuth = useSelector((state) => state.student);

  const token = adminOnly ? adminAuth.token : studentAuth.token;

  if (!token) {
    return <Navigate to={adminOnly ? "/isadmin" : "/studentlogin"} replace />;
  }

  if (adminOnly && !adminAuth.isAdmin) {
    return <Navigate to="/student/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
