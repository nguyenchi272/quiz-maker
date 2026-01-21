import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "../pages/admin/admin.css";

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Admin Panel</h2>
          <p>{user.email}</p>
        </div>

        <nav className="admin-menu">
          <NavLink to="/admin" end>📊 Dashboard</NavLink>
          <NavLink to="/admin/topics">📚 Topics</NavLink>
          <NavLink to="/admin/import">⬆️ Import Excel</NavLink>
        </nav>

        <div className="admin-logout">
          <button onClick={logout}>Logout</button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
