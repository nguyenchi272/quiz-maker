import api from "./axios";

export const login = async (email, password) => {
  const form = new FormData();
  form.append("username", email);
  form.append("password", password);

  const res = await api.post("/auth/login", form);
  return res.data;
};

export const register = async (email, password) => {
  return api.post("/auth/register", { email, password });
};
