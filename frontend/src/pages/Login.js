import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const validateInputs = () => {
    if (!email || !password) {
      setError("Email and Password required");
      return false;
    }

    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!validateInputs()) return;

    try {
      setLoading(true);

      const res = await axios.post(
        apiClient.auth.login(),
        {
          email,
          password,
        }
      );

      const payload = res.data?.data;

      if (res.data.success && payload) {
        localStorage.setItem("token", payload.token);

        localStorage.setItem(
          "user",
          JSON.stringify(payload.user)
        );

        const role = payload.user.role;

        if (role === "admin") {
          navigate("/admin-dashboard");
        } else if (role === "warden") {
          navigate("/warden-dashboard");
        } else {
          navigate("/student-dashboard");
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">

      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-8">

        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🏨</div>

          <h1 className="text-4xl font-bold text-white">
            Smart Hostel
          </h1>

          <p className="text-gray-300 mt-2">
            Hostel Management System
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 text-red-200 border border-red-400 p-3 rounded-lg mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-pink-400"
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-pink-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-4 rounded-xl transition duration-300"
          >
            {loading ? "Loading..." : "Login"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;