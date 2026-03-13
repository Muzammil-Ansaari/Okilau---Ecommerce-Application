import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // ── Registered users array (persists in localStorage) ──
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem("okilau-users");
    return saved ? JSON.parse(saved) : [];
  });

  // ── Currently logged in user ──
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("okilau-user");
    return saved ? JSON.parse(saved) : null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // ── Computed ──
  const isLoggedIn = !!user;

  // ── Modal controls ──
  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  // ── Signup ──
  const signup = (name, email, password) => {
    // check if email already registered
    const exists = registeredUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (exists) {
      return { success: false, error: "An account with this email already exists." };
    }

    // create new user
    const newUser = {
      id: Date.now(),
      name,
      email: email.toLowerCase(),
      password, // in real app this would be hashed!
    };

    // add to registered users array
    const updatedUsers = [...registeredUsers, newUser];
    setRegisteredUsers(updatedUsers);
    localStorage.setItem("okilau-users", JSON.stringify(updatedUsers));

    // auto login after signup
    const loggedInUser = { id: newUser.id, name: newUser.name, email: newUser.email };
    setUser(loggedInUser);
    localStorage.setItem("okilau-user", JSON.stringify(loggedInUser));

    return { success: true };
  };

  // ── Login ──
  const login = (email, password) => {
    // find user in registered users
    const found = registeredUsers.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password
    );

    if (!found) {
      return { success: false, error: "Invalid email or password" };
    }

    // login user (don't store password in active session)
    const loggedInUser = { id: found.id, name: found.name, email: found.email };
    setUser(loggedInUser);
    localStorage.setItem("okilau-user", JSON.stringify(loggedInUser));

    return { success: true };
  };

  // ── Logout ──
  const logout = () => {
    setUser(null);
    localStorage.removeItem("okilau-user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
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