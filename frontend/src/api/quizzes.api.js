import api from "./axios";

export const getAdminQuizHistory = () =>
  api.get("/quizzes/admin/history");
