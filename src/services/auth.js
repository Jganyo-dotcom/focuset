// services/authService.js
//const BASE_URL = "http://127.0.0.1:45555/student";
const BASE_URL = "https://capstone-project-9o17.onrender.com/student";

export async function registerUser(data) {
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: data.email,
      password: data.password,
      name: data.fullName,
      username: data.username,
      phone: data.phone,
      confirm_password: data.password,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || result.error || "Registration failed");
  }

  // Save token if backend returns it
  if (result.token) {
    localStorage.setItem("authToken", result.token);
  }

  return result; // { id, token }
}

export async function loginUser(main, password) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ main, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || "Invalid email or password");
  }

  // Save token
  if (data.token) {
    localStorage.setItem("authToken", data.token);
  }

  if (data.safe_user) {
    localStorage.setItem("safe_user", JSON.stringify(data.safe_user));
  }
  return data;

   // { user, token }
}

export async function forgotPassword(email) {
  const response = await fetch(`${BASE_URL}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || data.error || "Failed to send reset link"
    );
  }

  return data; 
}