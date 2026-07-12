import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
const [user] = useState({
    isAuthenticated: true,
    name: "John Doe",
    role: "Fleet Manager",
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