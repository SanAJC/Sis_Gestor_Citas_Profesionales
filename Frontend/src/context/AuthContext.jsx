import { createContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (userData) => {
    setUser(userData);
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    setLoading(false);
  };

//   preguntar a santiago si su bakend tiene un mensaje de error 

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}