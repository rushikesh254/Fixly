import { createContext, useContext, useState } from "react";
// import userData from "../data/userData";
import providerProfileData from "../data/providerProfileData";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(providerProfileData); // Initialize with userData for testing

  const login = () => {
    setUser(providerProfileData);
    return providerProfileData;
  };
  const signup = (role) => {
    const newUser = {
      id: Date.now(),
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
