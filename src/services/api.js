const BASE_URL = "https://reqres.in/api";

/* ============================
   AUTH
============================ */

/**
 * Login user
 * Reqres accepts:
 * email: "eve.holt@reqres.in"
 * password: "cityslicka"
 */
export async function loginUser(email, password) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Invalid credentials");
  }

  // save token
  localStorage.setItem("authToken", data.token);
  return data; // { token }
}

/**
 * Register user (optional, Reqres mock)
 */
export async function registerUser(email, password) {
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Registration failed");
  }

  localStorage.setItem("authToken", data.token);
  return data;
}

/**
 * Forgot password (mock)
 * Reqres has no real reset endpoint,
 * so we simulate success.
 */
export async function forgotPassword(email) {
  if (!email) {
    throw new Error("Email is required");
  }

  // fake delay for UX realism
  await new Promise((res) => setTimeout(res, 1200));

  return {
    message: "Password reset link sent to your email",
  };
}

/* ============================
   AUTH FETCH WRAPPER
============================ */

/**
 * Fetch wrapper with token support
 * (ready for refresh-token logic later)
 */
export async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem("authToken");

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    // token expired → logout
    localStorage.removeItem("authToken");
    throw new Error("Session expired. Please sign in again.");
  }

  return response;
}

/**
 * Logout helper
 */
export function logoutUser() {
  localStorage.removeItem("authToken");
}