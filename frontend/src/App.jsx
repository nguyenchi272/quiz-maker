import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import TopicList from "./pages/user/TopicList";
import TopicDetail from "./pages/user/TopicDetail";
import QuizPlay from "./pages/user/QuizPlay";
import Result from "./pages/user/Result";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminTopics from "./pages/admin/AdminTopics";
import AdminImport from "./pages/admin/AdminImport";
import AdminLayout from "./layouts/AdminLayout";
import AdminQuestions from "./pages/admin/AdminQuestions";
import UserLayout from "./layouts/UserLayout";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

export default function App() {
  return (
    <Routes>
      {/* ---------- PUBLIC ---------- */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ---------- USER ---------- */}
      <Route
        element={
          <ProtectedRoute>
            <UserLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/topics" element={<TopicList />} />
        <Route path="/topic/:id" element={<TopicDetail />} />
        <Route path="/quiz/:id" element={<QuizPlay />} />
        <Route path="/result" element={<Result />} />
      </Route>

      {/* ---------- ADMIN ---------- */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="topics" element={<AdminTopics />} />
        <Route path="import" element={<AdminImport />} />
        <Route path="topics/:id/questions" element={<AdminQuestions />} />
      </Route>

      {/* ---------- DEFAULT ---------- */}
      <Route path="/" element={<Navigate to="/topics" replace />} />
      <Route path="*" element={<Navigate to="/topics" replace />} />
    </Routes>
  );
}
