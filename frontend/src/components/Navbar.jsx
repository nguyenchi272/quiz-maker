import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { logout } = useAuth();

  return (
    <div className="flex justify-between items-center px-8 py-4 bg-white shadow">
      <h1 className="text-xl font-semibold">Quiz Maker</h1>

      <button
        onClick={logout}
        className="text-sm text-gray-600 hover:text-black"
      >
        Logout
      </button>
    </div>
  );
}
