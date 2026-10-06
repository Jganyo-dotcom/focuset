import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/auth";

import "../styles/SignUp.css";

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      if (!/^[0-9+]*$/.test(value)) return;
    }

    setFormData({
      ...formData,
      [name]: value, // Used structured destructuring variables directly
    });
  };

  const user = JSON.parse(localStorage.getItem("user"));

  const validatePassword = (password) => {
    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);

    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (!hasNumber || !hasLetter) {
      return "Password must contain letters and numbers";
    }
    return "";
  };

  const validatePhone = (phone) => {
    const cleaned = phone.replace(/\D/g, "");

    if (cleaned.length < 10 || cleaned.length > 15) {
      return "Phone number must be between 10 and 15 digits";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const phoneError = validatePhone(formData.phone);
    if (phoneError) return setError(phoneError);

    const passwordError = validatePassword(formData.password);
    if (passwordError) return setError(passwordError);

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      const result = await registerUser(formData);

      // Save auth data

      setSuccess(result.message || "Account created successfully!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Create an account</h2>

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
          inputMode="numeric"
          pattern="[0-9+]*"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        {/* Password */}
        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button
            type="button"
            className="password-icon"
            disabled={!formData.password}
            onClick={() => setShowPassword(!showPassword)}
          >
            {/* 🔽 Replace with Figma SVG */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 10V8a6 6 0 1112 0v2"
                stroke="currentColor"
                strokeWidth="2"
              />
              <rect
                x="5"
                y="10"
                width="14"
                height="10"
                rx="2"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </button>
        </div>

        {/* Confirm Password */}
        <div className="password-field">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button
            type="button"
            className="password-icon"
            disabled={!formData.confirmPassword}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {/* 🔽 SAME SVG ICON FROM FIGMA */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 10V8a6 6 0 1112 0v2"
                stroke="currentColor"
                strokeWidth="2"
              />
              <rect
                x="5"
                y="10"
                width="14"
                height="10"
                rx="2"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </button>
        </div>

        {error && <p className="error-text">{error}</p>}

        {success && <div className="success-toast">{success}</div>}

        <button type="submit" className="signup-btn">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
