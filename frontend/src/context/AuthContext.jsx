import { createContext, useContext, useState } from "react";
import userData from "../data/userData";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(userData); // Initialize with userData for testing

  const login = () => {
    setUser(userData);
  };
  const logout = () => {
    setUser(null);
  };
  const updateUser = (updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };
  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth() {
  return useContext(AuthContext);
}

export { useAuth };
