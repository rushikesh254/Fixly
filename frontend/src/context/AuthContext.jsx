import { createContext, useContext, useState } from "react";
import userData from "../data/userData";
import providerProfileData from "../data/providerProfileData";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(providerProfileData);
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
