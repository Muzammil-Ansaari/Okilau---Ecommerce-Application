import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const LoginForm = ({ onSwitch, onSuccess }) => {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

export default LoginForm;
