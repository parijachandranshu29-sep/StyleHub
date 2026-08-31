import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser } from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = localStorage.getItem("sh_user");
    const t = localStorage.getItem("sh_token");
    if (u && t) setUser(JSON.parse(u));
    setLoading(false);
  }, []);

  const persist = res => {
    const { token, userId, name, email, role } = res.data;
    const u = { userId, name, email, role };
    localStorage.setItem("sh_token", token);
    localStorage.setItem("sh_user", JSON.stringify(u));
    setUser(u); return u;
  };

  const login = async creds => persist(await loginUser(creds));
  const register = async data => persist(await registerUser(data));
  const logout = () => {
    localStorage.removeItem("sh_token");
    localStorage.removeItem("sh_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === "ROLE_ADMIN" }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const c = useContext(AuthContext);
  if (!c) throw new Error("useAuth outside provider");
  return c;
};
