import { createContext, useContext, useState } from "react";
import userData from "../data/userData";
import providers from "../data/providers";
import { adminData } from "../data/adminData";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    //providers.find((p) => p.id === "PRV-0001"),
    adminData,
    //userData,
  );
  const login = () => {
    setUser(adminData);
    return userData;
  };
  const signup = (role) => {
    const newUser = {
      id: "USR-0002",
      name: "",
      email: "",
      role: role,
      image: "",
    };
    setUser(newUser);
  };
  const logout = () => {
    setUser(null);
  };
  const updateUser = (updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };
  return (
    <AuthContext.Provider
      value={{ user, setUser, login, signup, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth() {
  return useContext(AuthContext);
}

export { useAuth };
