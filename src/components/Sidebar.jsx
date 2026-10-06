import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // 🚀 Added useNavigate
import { useAuth } from "../context/AuthContext"; // Import your AuthContext if you use it
import "./sidebar.css";
import logo from "../assets/images/logo.png";

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate(); // 🚀 Initialize the router navigator
  const { setIsAuthenticated } = useAuth(); // Call your context updater if it exists

  // Automatically close mobile menu when a link is clicked and path changes
  useEffect(() => {
    if (isOpen) onClose();
  }, [location.pathname]);

  /* =========================================================
     HANDLE LOGOUT ACTION
     ========================================================= */
  const handleLogout = () => {
    // 1. Wipe out your authentication storage keys
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // clear this too if stored separately

    // 2. Clear global React Context state if you are using one
    if (setIsAuthenticated) {
      setIsAuthenticated(false);
    }

    // 3. Close the mobile drawer menu just in case
    onClose();

    // 4. Force bounce the user instantly back to your public sign-in page
    navigate("/signin", { replace: true });
  };

  return (
    <>
      {/* BACKDROP OVERLAY */}
      <div
        className={`sidebar-overlay ${isOpen ? "active" : ""}`}
        onClick={onClose}
      />

      {/* SIDEBAR CONTAINER */}
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        {/* TOP SECTION: Logo + Navigation Links */}
        <div className="sidebar-top-section">
          <div className="sidebar-header">
            <img src={logo} alt="Focuset logo" className="sidebar-logo" />
            <p className="sidebar-tagline">Track your focus effortlessly</p>
          </div>

          <nav className="nav">
            <Link
              to="/dashboard"
              className={`nav-link ${location.pathname === "/dashboard" ? "active" : ""}`}
            >
              Dashboard
            </Link>
            <Link
              to="/goals"
              className={`nav-link ${location.pathname === "/goals" ? "active" : ""}`}
            >
              Goals
            </Link>
            <Link
              to="/progress"
              className={`nav-link ${location.pathname === "/progress" ? "active" : ""}`}
            >
              Progress
            </Link>
            <Link
              to="/profile"
              className={`nav-link ${location.pathname === "/profile" ? "active" : ""}`}
            >
              Profile
            </Link>
            <Link
              to="/settings"
              className={`nav-link ${location.pathname === "/settings" ? "active" : ""}`}
            >
              Settings
            </Link>
          </nav>
        </div>

        {/* BOTTOM SECTION */}
        <div className="sidebar-footer">
          {/* 🚀 FIXED: Attached the logout worker event click listener */}
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
