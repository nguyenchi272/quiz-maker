import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <main style={{
        flex: 1,
        padding: "24px",
        background: "#f5f7fb"
      }}>
        <Outlet />
      </main>
    </div>
  );
}
