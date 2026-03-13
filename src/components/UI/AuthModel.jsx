import { useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState("login"); // "login" | "signup"

  // close modal on success
  const handleSuccess = () => {
    closeAuthModal();
    setActiveTab("login"); // reset to login tab for next time
  };

  if (!isAuthModalOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/50"
        onClick={closeAuthModal}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white p-8 shadow-2xl">

        {/* Close button */}
        <button
          onClick={closeAuthModal}
          className="absolute right-4 top-4 text-gray-400 transition-colors hover:text-black"
        >
          <X size={20} />
        </button>

        {/* Tabs */}
        <div className="mb-6 flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab("login")}
            className={`pb-3 pr-6 text-sm font-medium uppercase tracking-widest transition-colors ${
              activeTab === "login"
                ? "border-b-2 border-black text-black"
                : "text-gray-400 hover:text-black"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab("signup")}
            className={`pb-3 pr-6 text-sm font-medium uppercase tracking-widest transition-colors ${
              activeTab === "signup"
                ? "border-b-2 border-black text-black"
                : "text-gray-400 hover:text-black"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        {activeTab === "login" ? (
          <LoginForm
            onSwitch={() => setActiveTab("signup")}
            onSuccess={handleSuccess}
          />
        ) : (
          <SignupForm
            onSwitch={() => setActiveTab("login")}
            onSuccess={handleSuccess}
          />
        )}

      </div>
    </>
  );
};

export default AuthModal;