import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import axios from "axios";

export default function Register() {
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
      await axios.post("http://127.0.0.1:8000/api/auth/register", {
        email,
        password
      });
      navigate("/login");
    } catch (err) {
      setError("Email already exists");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h2 style={title}>Create account</h2>
      <p style={subtitle}>Start your quiz journey</p>

      {error && <div style={errorStyle}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={input}
        />

        <button disabled={loading} style={button}>
          {loading ? "Creating..." : "Register"}
        </button>
      </form>

      <p style={footer}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </AuthLayout>
  );
}

/* reuse same styles as Login */
const title = { marginBottom: 8 };
const subtitle = { color: "#6b7280", marginBottom: 24 };
const input = {
  width: "100%",
  padding: 12,
  marginBottom: 16,
  borderRadius: 8,
  border: "1px solid #d1d5db"
};
const button = {
  width: "100%",
  padding: 12,
  background: "#16a34a",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer"
};
const errorStyle = {
  background: "#fee2e2",
  color: "#991b1b",
  padding: 10,
  borderRadius: 6,
  marginBottom: 16
};
const footer = {
  marginTop: 20,
  textAlign: "center"
};
