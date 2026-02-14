// import { Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function ProtectedRoute({ children }) {
//   const { isAuthenticated } = useAuth();
//   return isAuthenticated ? children : <Navigate to="/signin" replace />;
// }

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // 1. Show nothing / loader while auth state is being checked
  if (loading) return <p style={{ padding: "24px" }}>Loading...</p>;

  // 2. If not authenticated, redirect to signin
  if (!isAuthenticated) return <Navigate to="/signin" replace />;

  // 3. Authenticated → render children
  return children;
}