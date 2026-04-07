import { createContext, useContext, useState } from "react";
import axiosInstance from "../utils/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("okilau-user");
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("okilau-token") || null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const isLoggedIn = !!user;

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  // ── Signup ──
  const signup = async (name, email, password) => {
    try {
      const { data } = await axiosInstance.post("/auth/signup", {
        name,
        email,
        password,
      });

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("okilau-token", data.token);
      localStorage.setItem("okilau-user", JSON.stringify(data.user));

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Something went wrong.",
      };
    }
  };

  // ── Login ──
  const login = async (email, password) => {
    try {
      const { data } = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("okilau-token", data.token);
      localStorage.setItem("okilau-user", JSON.stringify(data.user));

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Something went wrong.",
      };
    }
  };

  // ── Logout ──
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("okilau-token");
    localStorage.removeItem("okilau-user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn,
        login,
        signup,
        logout,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
