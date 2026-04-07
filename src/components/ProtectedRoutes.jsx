import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, openAuthModal } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      openAuthModal();
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return null; 
  }

  return children;
};

export default ProtectedRoute;