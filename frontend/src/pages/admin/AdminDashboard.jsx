import "./admin.css";

export default function AdminDashboard() {
  return (
    <>
      <h1 className="admin-title">Dashboard</h1>

      <div className="stat-grid">
        <div className="stat-card">
          <span>Topics</span>
          <h3>—</h3>
        </div>

        <div className="stat-card">
          <span>Questions</span>
          <h3>—</h3>
        </div>

        <div className="stat-card">
          <span>Users</span>
          <h3>—</h3>
        </div>
      </div>

      <div className="welcome-box">
        <h2>Welcome 👋</h2>
        <p>Đây là khu vực quản trị hệ thống ngân hàng câu hỏi.</p>
      </div>
    </>
  );
}
