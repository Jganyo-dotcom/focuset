const BASE_URL = "https://capstone-project-9o17.onrender.com/student";
//const BASE_URL = "http://127.0.0.1:45555/student";

async function request(path, options = {}) {
  const token = localStorage.getItem("authToken");

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
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
    // backend might return { message } OR { error }
    const error = new Error(data.message || data.error || "Request failed");
    error.status = res.status;
    error.backend = data;
    throw error;
  }

  return data;
}

/* GET /student/get-profile */
export function getProfile() {
  return request("/get-profile", { method: "GET" });
}

/* PATCH /student/update-profile */
export function updateProfile(payload) {
  return request("/update-profile", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}