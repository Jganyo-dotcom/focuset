import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/SignIn.css";
import { loginUser } from "../services/auth";

import illustration from "../assets/images/signin-illustration.png";

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [main, setmain] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

    // Add this hook import at the top if your context provides state updaters
    // const { setIsAuthenticated } = useAuth();

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
        }),
      );

      // 🚀 CRITICAL FIX: If your AuthContext exports a state function, trigger it here:
      // setIsAuthenticated(true);

      setSuccess(result.message || "Login successful");

      // Redirect to dashboard layout view ports
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
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
              type="text" /* 🚀 FIX: Changed 'string' to valid 'text' input type */
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

          {/* Cleaned link redirection interface */}
          <Link to="/forgot-password" className="forgot-password">
            Forgot password?
          </Link>

          {error && <p className="error-text">{error}</p>}
          {success && (
            <p
              className="success-text"
              style={{
                color: "#22c55e",
                textAlign: "center",
                fontSize: "13px",
              }}
            >
              {success}
            </p>
          )}

          <button className="signin-btn" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <div className="divider">or</div>

          <button className="google-btn" type="button">
            <span>Google</span>
          </button>

          <p className="signup-text">
            Don’t have an account? <Link to="/signup">Create one</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/SignIn.css";

// const SignIn = () => {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault(); // ✅ REQUIRED
//     setError("");
//     setLoading(true);

//     try {
//       const res = await fetch("http://localhost:5000/api/auth/signin", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.message || "Invalid credentials");
//         setLoading(false);
//         return;
//       }

//       // ✅ MUST SAVE TOKEN / USER
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify(data.user));

//       // ✅ REDIRECT
//       navigate("/dashboard");
//     } catch (err) {
//       setError("Unable to connect to server");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="signin-container">
//       <form className="signin-form" onSubmit={handleSubmit}>
//         <h2>Sign In</h2>

//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />

//         {error && <p className="error-text">{error}</p>}

//         <button type="submit" disabled={loading}>
//           {loading ? "Signing in..." : "Sign In"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default SignIn;
