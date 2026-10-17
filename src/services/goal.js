// services/goalsService.js
const BASE_URL = "https://capstone-project-9o17.onrender.com/student";
//const BASE_URL = "http://127.0.0.1:45555/student";

export async function createGoal(goalData) {
  const token = localStorage.getItem("authToken");

  const res = await fetch(`${BASE_URL}/create/goals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(goalData),
  });

  let data;
  try {
    data = await res.json();
    await getGoals();
  } catch {
    data = {};
  }

  if (!res.ok) {
    // backend might return { message } OR { error }
    alert(data.error || "Registration failed");
    throw new Error(data.message || data.error || "Registration failed");
  }

  return data; // backend returns { message, data } or { error }
}

// const BASE_URL = "https://capstone-project-9o17.onrender.com";

export async function getGoals() {
  const token = localStorage.getItem("authToken");

  const res = await fetch(`${BASE_URL}/create/goals`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    const errorMessage = data.message || data.error || "Failed to fetch goals";
    const error = new Error(errorMessage);
    error.backend = data;
    throw error;
  }

  return data; // backend should return { goals: [...] }
}
