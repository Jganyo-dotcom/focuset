import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import "../styles/ResetPassword.css";
// Make sure to export requestPasswordReset (or forgotPassword) from your auth service
import { resetPassword, requestPasswordReset } from "../services/auth";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const navigate = useNavigate();

  // State for Forgot Password view
  const [email, setEmail] = useState("");

  // State for Reset Password view
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  // Shared feedback states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Password strength logic
  const strength =
    password.length < 6 ? "weak" : password.length < 10 ? "medium" : "strong";

  // Handle requesting a reset link (Email View)
  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await requestPasswordReset(email);
      setSuccess("Reset link sent! Please check your email inbox.");
      // setEmail("");
    } catch (err) {
      setError(err.message || "Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle setting a new password (Token View)
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, password);
      setSuccess("Password reset successful! Redirecting to sign in...");

      setTimeout(() => navigate("/signin"), 1500);
    } catch (err) {
      setError(err.message || "Invalid or expired token.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-page">
      {token ? (
        /* ================= VIEW 2: RESET PASSWORD (TOKEN PRESENT) ================= */
        <form className="reset-card" onSubmit={handleResetPassword}>
          <h2>Reset Password</h2>
          <p className="card-subtitle">
            Enter your new password below to reset your account.
          </p>

          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className={`strength ${strength}`} />

          <input
            type="password"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />

          {error && <p className="error-text">{error}</p>}
          {success && <p className="success-text">{success}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          <div className="card-footer">
            <Link to="/signin" className="back-link">
              ← Back to Sign In
            </Link>
          </div>
        </form>
      ) : (
        /* ================= VIEW 1: FORGOT PASSWORD (NO TOKEN) ================= */
        <form className="reset-card" onSubmit={handleRequestReset}>
          <h2>Forgot Password</h2>
          <p className="card-subtitle">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {error && <p className="error-text">{error}</p>}
          {success && <p className="success-text">{success}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Sending link..." : "Send Reset Link"}
          </button>

          <div className="card-footer">
            <Link to="/signin" className="back-link">
              ← Back to Sign In
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
