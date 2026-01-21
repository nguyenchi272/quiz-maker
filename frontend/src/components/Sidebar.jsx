import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside style={{
      width: 240,
      background: "#1e293b",
      color: "#fff",
      padding: 20
    }}>
      <h2 style={{ marginBottom: 30 }}>Quiz Maker</h2>

      <nav style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Link to="/topics" style={linkStyle}>📚 Topics</Link>
        <Link to="/history" style={linkStyle}>🕘 History</Link>
      </nav>

      <button
        onClick={logout}
        style={{
          marginTop: 40,
          background: "#ef4444",
          color: "#fff",
          border: "none",
          padding: 10,
          cursor: "pointer"
        }}
      >
        Logout
      </button>
    </aside>
  );
}

const linkStyle = {
  color: "#fff",
  textDecoration: "none",
  padding: "8px 0"
};
