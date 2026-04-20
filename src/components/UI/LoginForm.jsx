import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axios";

const LoginForm = ({ onSwitch, onSuccess }) => {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }

    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      onSuccess();
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  if (showForgotPassword) {
    return <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />;
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-['Anton'] text-2xl uppercase tracking-widest text-black">
          Welcome Back
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Sign in to your Okilau account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium uppercase tracking-widest text-gray-500">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="border border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-black"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium uppercase tracking-widest text-gray-500">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="border border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-black"
          />
        </div>

        {/* Forgot password */}
        <div className="text-right">
          <button
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className="text-xs text-gray-400 underline underline-offset-4 hover:text-black"
          >
            Forgot password?
          </button>
        </div>

        {/* Error */}
        {error && <p className="text-xs text-red-500">{error}</p>}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-black py-3 text-sm font-medium uppercase tracking-widest text-white transition-all hover:bg-gray-800 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      {/* Switch to signup */}
      <p className="text-center text-sm text-gray-400">
        Don't have an account?{" "}
        <button
          onClick={onSwitch}
          className="font-medium text-black underline underline-offset-4"
        >
          Sign Up
        </button>
      </p>
    </div>
  );
};

const ForgotPasswordForm = ({ onBack }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    if (!email) {
      console.log("khdfksjhd");
      setError("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axiosInstance.post("/auth/forgot-password", {
        email,
      });
      setMessage(data.message);
      console.log(data);
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-['Anton'] text-2xl uppercase tracking-widest text-black">
          Reset Password
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Enter your email to receive a reset link
        </p>
      </div>

      {message ? (
        <div className="bg-green-50 p-4">
          <p className="text-sm text-green-600">{message}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium uppercase tracking-widest text-gray-500">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="bg-black py-3 text-sm font-medium uppercase tracking-widest text-white hover:bg-gray-800 disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </div>
      )}

      <button
        onClick={onBack}
        className="text-xs text-gray-400 underline underline-offset-4 hover:text-black"
      >
        Back to Login
      </button>
    </div>
  );
};

export default LoginForm;
