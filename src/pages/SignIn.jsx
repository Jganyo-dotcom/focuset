import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/SignIn.css";
import { loginUser, forgotPassword } from "../services/auth";

import illustration from "../assets/images/signin-illustration.png";
import googleIcon from "../assets/icons/google.svg";

export default function SignIn() {
  const navigate = useNavigate();

  const [main, setMain] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isForgot, setIsForgot] = useState(false);

  const [emailLocked, setEmailLocked] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  /* =====================
     LOGIN
  ====================== */
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

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: result.safe_user.id,
          name: result.safe_user.name,
          email: result.safe_user.email,
          username: result.safe_user.username,
          phone: result.safe_user.phone,
          role: result.safe_user.role,
          token: result.token,
          isVerified: true,
        })
      );

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* =====================
     FORGOT PASSWORD
  ====================== */
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!main) {
      setError("Please enter your email");
      return;
    }

    setLoading(true);

    try {
      const result = await forgotPassword(main);
      setSuccess(result.message || "Reset link sent to your email");
      setEmailLocked(true);
      startCooldown();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startCooldown = () => {
    setCooldown(30);
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleGoogleLogin = () => {
    window.location.href =
      "https://capstone-project-9o17.onrender.com/auth/google";
  };

  return (
    <div className="signin-page">
      <div className="signin-container">
        {/* ILLUSTRATION */}
        <div className="signin-illustration">
          <img src={illustration} alt="Sign in illustration" />
        </div>

        {/* FORM */}
        <form
          className="signin-form"
          onSubmit={isForgot ? handleForgotPassword : handleSubmit}
        >
          <div className="input-group">
            <label>Email or username</label>
            <input
              type="text"
              placeholder="Enter Email or username"
              value={main}
              onChange={(e) => setMain(e.target.value)}
              disabled={emailLocked}
              required
            />
          </div>

          {!isForgot && (
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
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>
            </div>
          )}

          {!isForgot ? (
            <p className="forgot-password" onClick={() => setIsForgot(true)}>
              Forgot password?
            </p>
          ) : (
            <p className="back-login" onClick={() => setIsForgot(false)}>
              Back to login
            </p>
          )}

          {error && <p className="error-text">{error}</p>}

          {success && (
            <>
              <div className="success-icon">✓</div>
              <p className="success-text">{success}</p>
            </>
          )}

          <button
            className="signin-btn"
            type="submit"
            disabled={loading || cooldown > 0}
          >
            {loading
              ? "Please wait..."
              : isForgot
              ? cooldown > 0
                ? `Resend in ${cooldown}s`
                : "Send reset link"
              : "Sign in"}
          </button>

          {!isForgot && (
            <>
              <div className="divider">or</div>

              <button
                className="google-btn"
                type="button"
                onClick={handleGoogleLogin}
              >
                <img src={googleIcon} alt="Google" />
                <span>Continue with Google</span>
              </button>

              <p className="signup-text">
                Don’t have an account? <Link to="/signup">Create one</Link>
              </p>
            </>
          )}
        </form>
      </div>
    </div>
  );
}