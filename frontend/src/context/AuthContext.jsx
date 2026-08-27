import { createContext, useContext, useState } from "react";
// import userData from "../data/userData";
import SingleProvider from "../data/SingleProvider";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(SingleProvider); // Initialize with userData for testing

  const login = () => {
    setUser(SingleProvider); // Set user to userData for testing
  };
  const logout = () => {
    setUser(null);
  };
  const updateUser = (updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };
  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth() {
  return useContext(AuthContext);
}

export { useAuth };
