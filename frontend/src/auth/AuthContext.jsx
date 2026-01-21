import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --------------------
  // LOGIN
  // --------------------
  const login = async (email, password) => {
    const form = new URLSearchParams();
    form.append("username", email);
    form.append("password", password);

    const res = await api.post("/auth/login", form, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    localStorage.setItem("access_token", res.data.access_token);
    await fetchMe();

    const me = await fetchMe();
    return me;
  };

  // --------------------
  // LOGOUT
  // --------------------
  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
  };

  // --------------------
  // GET CURRENT USER
  // --------------------
  const fetchMe = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
      return res.data;
    } catch (err) {
      logout();
      return null;
    } finally {
      setLoading(false);
    }
  };


  // --------------------
  // INIT APP
  // --------------------
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetchMe();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// --------------------
// HOOK
// --------------------
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
