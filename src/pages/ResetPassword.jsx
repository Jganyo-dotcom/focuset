import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/auth";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, password);
      setSuccess("Password reset successful");
      setTimeout(() => navigate("/signin"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleReset} className="reset-form">
      <h2>Reset Password</h2>

      <input
        type="password"
        placeholder="New password"
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Confirm password"
        onChange={(e) => setConfirm(e.target.value)}
        required
      />

      {error && <p className="error-text">{error}</p>}
      {success && <p className="success-text">{success}</p>}

      <button disabled={loading}>
        {loading ? "Resetting..." : "Reset password"}
      </button>
    </form>
  );
}