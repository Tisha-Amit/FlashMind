import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('flashmind_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (token) {
        try {
          const res = await authApi.me();
          setUser(res.data.user);
        } catch {
          // Token invalid/expired
          localStorage.removeItem('flashmind_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    init();
  }, [token]);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    const { token: t, user: u } = res.data;
    localStorage.setItem('flashmind_token', t);
    setToken(t);
    setUser(u);
    return u;
  };

  const register = async (username, email, password) => {
    const res = await authApi.register({ username, email, password });
    const { token: t, user: u } = res.data;
    localStorage.setItem('flashmind_token', t);
    setToken(t);
    setUser(u);
    return u;
  };

  const logout = () => {
    localStorage.removeItem('flashmind_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
