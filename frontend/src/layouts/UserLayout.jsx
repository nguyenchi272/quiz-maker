import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "../pages/user/user.css";

export default function UserLayout() {
  const { user, logout } = useAuth();

  return (
    <>
      <header className="user-header">
        <Link to="/topics" className="logo">Quiz System</Link>

        <div className="user-info">
          <span>{user.email}</span>
          <button onClick={logout} className="action-delete">Logout</button>
        </div>
      </header>

      <main className="user-main">
        <Outlet />
      </main>
    </>
  );
}
