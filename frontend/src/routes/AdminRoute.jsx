import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function AdminRoute({ children }) {
  const { loading, isAuthenticated, isAdmin } = useAuth();

  if (loading) return null;

  // Chưa login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Không phải admin
  if (!isAdmin) {
    return <Navigate to="/topics" replace />;
  }

  return children;
}
