import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user] = useState({
    isAuthenticated: true,
    role: "Fleet Manager",
    name: "John Doe",
  });

  const login = () => {};

  const logout = () => {};

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}