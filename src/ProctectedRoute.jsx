import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { token, isAdmin } = useSelector((state) => state.login);

  if (!token) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin)
    return <Navigate to="/student/exam" replace />;

  return children;
};

export default ProtectedRoute;
