import { NavLink, useNavigate } from "react-router-dom";
import "./sidebar.css";
import logo from "../assets/images/logo.png";

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuth");
    localStorage.removeItem("token");
    navigate("/signin");
    onClose?.();
  };

  return (
    <>
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        {/* HEADER */}
        <div className="sidebar-header">
          <img src={logo} alt="Focuset logo" className="sidebar-logo" />
          <h4>Build consistent learning habits</h4>
        </div>

        {/* NAVIGATION */}
        <nav className="nav">
          <NavLink to="/dashboard" className="nav-link" onClick={onClose}>
            Dashboard
          </NavLink>
          <NavLink to="/goals" className="nav-link" onClick={onClose}>
            Goals
          </NavLink>
          <NavLink to="/progress" className="nav-link" onClick={onClose}>
            Progress
          </NavLink>
          <NavLink to="/profile" className="nav-link" onClick={onClose}>
            Profile
          </NavLink>
          <NavLink to="/settings" className="nav-link" onClick={onClose}>
            Settings
          </NavLink>

          <button className="logout-btn" onClick={handleLogout}>
            Log out
          </button>
        </nav>
      </aside>

      {/* Overlay for mobile only */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
    </>
  );
}
