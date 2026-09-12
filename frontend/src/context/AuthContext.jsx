import { createContext, useContext, useState } from "react";
import userData from "../data/userData";
import providers from "../data/providers";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    providers.find((p) => p.id === "PRV-0001"),
  );
  const login = () => {
    setUser(userData);
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
