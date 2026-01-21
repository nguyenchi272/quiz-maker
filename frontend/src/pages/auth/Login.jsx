import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import { useAuth } from "../../auth/AuthContext";

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
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h2 style={title}>Welcome back</h2>
      <p style={subtitle}>Sign in to continue</p>

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
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>

      <p style={footer}>
        No account? <Link to="/register">Register</Link>
      </p>
    </AuthLayout>
  );
}

/* styles */
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
  background: "#4f46e5",
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
