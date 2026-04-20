import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axiosInstance from "../utils/axios"
import Button from "../components/UI/Button"

const ResetPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!password || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)
    try {
      await axiosInstance.post(`/auth/reset-password/${token}`, { password })
      setSuccess(true)
      setTimeout(() => navigate("/"), 3000)
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="mb-8 font-['Anton'] text-3xl uppercase tracking-widest text-black">
          Reset Password
        </h1>

        {success ? (
          <div className="bg-green-50 p-6 text-center">
            <p className="text-sm text-green-600 font-medium">
              Password reset successfully!
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Redirecting to home page...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium uppercase tracking-widest text-gray-500">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium uppercase tracking-widest text-gray-500">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
              />
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}

            <Button
              type="submit"
              variant="black"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>

          </form>
        )}
      </div>
    </section>
  )
}

export default ResetPassword