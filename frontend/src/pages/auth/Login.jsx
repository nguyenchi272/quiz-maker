import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import { useAuth } from "../../auth/AuthContext";
import "./auth.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/topics");
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h2 className="auth-title">Welcome back</h2>
      <p className="auth-subtitle">Sign in to continue</p>

      {error && <div className="auth-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="auth-input"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="auth-input"
        />

        <button
          disabled={loading}
          className="auth-button login"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>

      <p className="auth-footer">
        No account? <Link to="/register">Register</Link>
      </p>
    </AuthLayout>
  );
}
