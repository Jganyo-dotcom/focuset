import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // Backup check: look directly into localStorage to prevent instant-login race conditions
  const hasLocalToken = localStorage.getItem("user");

  // 1. Show loader while context is setting up initial boot state
  if (loading) {
    return <p style={{ padding: "24px" }}>Loading...</p>;
  }

  // 2. Check BOTH the context state AND the fallback localStorage item
  if (!isAuthenticated && !hasLocalToken) {
    return <Navigate to="/signin" replace />;
  }

  // 3. Verified -> render layout dashboard elements safely
  return children;
}
