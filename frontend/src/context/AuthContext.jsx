import { createContext, useState, useContext, useEffect } from "react";
import axios from "../utils/axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load session on refresh
  useEffect(() => {
    const savedToken = sessionStorage.getItem("token");
    const savedUser = sessionStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  // =============================
  // AUTH FUNCTIONS
  // =============================

  const register = async (name, email, password, role) => {
    try {
      const res = await axios.post("/auth/register", {
        name,
        email,
        password,
        role,
      });
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      const res = await axios.post("/auth/verify-otp", { email, otp });
      const { token: newToken, user: newUser } = res.data;

      saveSession(newToken, newUser);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post("/auth/login", { email, password });
      const { token: newToken, user: newUser } = res.data;

      saveSession(newToken, newUser);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
  };

  // =============================
  // PROFILE UPDATE (NEW)
  // =============================

  const updateProfile = async (name) => {
    try {
      const res = await axios.put("/users/update-profile", { name });

      if (res.data.success) {
        const updatedUser = { ...user, name };
        saveSession(token, updatedUser);
      }

      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  // =============================
  // PASSWORD RESET FLOW
  // =============================

  const requestPasswordReset = async (email) => {
    try {
      const res = await axios.post("/auth/request-password-reset", { email });
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  const verifyPasswordResetOTP = async (email, otp) => {
    try {
      const res = await axios.post("/auth/verify-password-reset-otp", {
        email,
        otp,
      });
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  const resetPassword = async (email, otp, newPassword) => {
    try {
      const res = await axios.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });

      const { token: newToken, user: newUser } = res.data;
      saveSession(newToken, newUser);

      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  // =============================
  // HELPER FUNCTION
  // =============================

  const saveSession = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    sessionStorage.setItem("token", newToken);
    sessionStorage.setItem("user", JSON.stringify(newUser));
  };

  const value = {
    user,
    token,
    loading,
    register,
    verifyOTP,
    login,
    logout,
    updateProfile, // ✅ added
    requestPasswordReset,
    verifyPasswordResetOTP,
    resetPassword,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
