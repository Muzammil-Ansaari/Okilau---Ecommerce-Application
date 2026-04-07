import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { isLoggedIn, user } = useAuth();

  console.log("isLoggedIn:", isLoggedIn);
  console.log("user:", user);
  console.log("role:", user?.role);

  if (!isLoggedIn) return <Navigate to="/" />;
  if (user?.role !== "admin") return <Navigate to="/" />;

  return children;
};

export default AdminRoute;
