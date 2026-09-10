import api from "./api";

// ============================================================
// LOGIN
// ============================================================

export const loginUser = async (
  email,
  password
) => {
  const response = await api.post(
    "/auth/login",
    {
      email,
      password,
    }
  );

  return response.data;
};

// ============================================================
// REGISTER
// ============================================================

export const registerUser = async (
  name,
  email,
  password
) => {
  const response = await api.post(
    "/auth/register",
    {
      name,
      email,
      password,
    }
  );

  return response.data;
};

// ============================================================
// LOGOUT
// ============================================================

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// ============================================================
// CURRENT USER
// ============================================================

export const getCurrentUser = () => {
  const user = localStorage.getItem("user");

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch (error) {
    console.error(
      "Unable to parse stored user:",
      error
    );

    return null;
  }
};

// ============================================================
// TOKEN
// ============================================================

export const getToken = () => {
  return localStorage.getItem("token");
};

// ============================================================
// AUTH CHECK
// ============================================================

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};