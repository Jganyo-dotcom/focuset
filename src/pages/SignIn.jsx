import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/SignIn.css";
import { loginUser } from "../services/auth";

import illustration from "../assets/images/signin-illustration.png";
import googleIcon from "../assets/icons/google.svg";

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [main, setmain] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!main || !password) {
      setError("Email / username and password are required");
      return;
    }

    setLoading(true);

    try {
      const result = await loginUser(main, password);
      console.log("LOGIN RESPONSE:", result);

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: result.safe_user.id,
          name: result.safe_user.name,
          email: result.safe_user.email,
          username: result.safe_user.username,
          phone: result.safe_user.phone,
          role: result.safe_user.role, // "Admin"
          token: result.token,
          isVerified: true, // backend already trusts logged-in users
        }),
      );

      setSuccess(result.message || "Login successful");

      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 800);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-container">
        {/* ILLUSTRATION */}
        <div className="signin-illustration">
          <img src={illustration} alt="Sign in illustration" />
        </div>

        {/* FORM */}
        <form className="signin-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email or username</label>
            <input
              type="string"
              placeholder="Enter Email or username"
              value={main}
              onChange={(e) => setmain(e.target.value)}
              required
            />
          </div>

          <div className="input-group password-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  /* Eye-off icon */
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.11 1 12c.74-1.67 1.9-3.2 3.4-4.5" />
                    <path d="M10.58 10.58a2 2 0 0 0 2.83 2.83" />
                    <path d="M1 1l22 22" />
                  </svg>
                ) : (
                  /* Eye icon */
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </span>
            </div>
          </div>

          <p className="forgot-password">Forgot password?</p>

          {error && <p className="error-text">{error}</p>}
          <button className="signin-btn" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <div className="divider">or</div>

          <button className="google-btn" type="button">
            <img src={googleIcon} alt="Google icon" />
            <span>Google</span> SOCIAL
          </button>

          <p className="signup-text">
            Don’t have an account? <Link to="/signup">Create one</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
