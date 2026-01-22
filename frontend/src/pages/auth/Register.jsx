import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import axios from "axios";
import "./auth.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await axios.post("http://127.0.0.1:8000/api/auth/register", {
        email,
        password
      });

      setSuccess(
        "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản."
      );
    } catch (err) {
      setError(
        err.response?.data?.detail || "Email đã tồn tại"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h2 className="auth-title">Create account</h2>
      <p className="auth-subtitle">Start your quiz journey</p>

      {error && <div className="auth-error">{error}</div>}
      {success && <div className="auth-success">{success}</div>}

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
          className="auth-button register"
        >
          {loading ? "Creating..." : "Register"}
        </button>
      </form>

      <p className="auth-footer">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </AuthLayout>
  );
}
