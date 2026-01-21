import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function UserLayout() {
  const { user, logout } = useAuth();

  return (
    <div>
      <header className="bg-white shadow px-6 py-3 flex justify-between">
        <Link to="/" className="font-bold">Quiz System</Link>

        <div className="flex gap-4 items-center">
          <span>{user.email}</span>
          <button onClick={logout} className="text-red-500">
            Logout
          </button>
        </div>
      </header>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
