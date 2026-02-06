const BASE_URL = "https;//capstone-project-9o17.onrender.com";

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
export async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem("authToken");

  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (res.status === 401) {
    const refresh = await refreshToken();
    if (!refresh) throw new Error("Session expired");

    return fetchWithAuth(url, options);
  }

  return res.json();
}

async function refreshToken() {
  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) return false;

  const data = await res.json();
  localStorage.setItem("authToken", data.token);
  return true;
}
/**
 * Fetch wrapper with token support
 * (ready for refresh-token logic later)
 */

/**
 * Logout helper
 */
export function logoutUser() {
  localStorage.removeItem("authToken");
}