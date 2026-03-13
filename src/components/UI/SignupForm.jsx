import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const SignupForm = ({ onSwitch, onSuccess }) => {
  const { signup } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // basic validation
    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    // mock delay
    setTimeout(() => {
      const result = signup(name, email, password);
      if (result.success) {
        onSuccess();
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-['Anton'] text-2xl uppercase tracking-widest text-black">
          Create Account
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Join Okilau and start shopping
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Name */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium uppercase tracking-widest text-gray-500">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="border border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-black"
          />
        </div>

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
          <p className="text-xs text-gray-400">Minimum 6 characters</p>
        </div>

        {/* Error */}
        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-black py-3 text-sm font-medium uppercase tracking-widest text-white transition-all hover:bg-gray-800 disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      {/* Switch to login */}
      <p className="text-center text-sm text-gray-400">
        Already have an account?{" "}
        <button
          onClick={onSwitch}
          className="font-medium text-black underline underline-offset-4"
        >
          Sign In
        </button>
      </p>
    </div>
  );
};

export default SignupForm;