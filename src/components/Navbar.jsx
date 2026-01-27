import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./navbar.css";
import logo from "../assets/images/logo.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navbarRef = useRef(null);
  const location = useLocation();

  /* HIDE NAVBAR ON DASHBOARD PAGES */
  const hideNavbarRoutes = [
    "/dashboard",
    "/goals",
    "/progress",
    "/settings",
    "/profile",
  ];

  if (hideNavbarRoutes.some((path) => location.pathname.startsWith(path))) {
    return null;
  }

  /* CLOSE MENU WHEN CLICKING OUTSIDE */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navbarRef.current && !navbarRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <nav className="navbar" ref={navbarRef}>
      {/* LOGO */}
      <div className="navbar-left">
        <Link to="/" onClick={closeMenu}>
          <img src={logo} alt="Focuset logo" className="logo" />
        </Link>
      </div>

      {/* LINKS */}
      <div className="navbar-right">
        <ul className={`nav-links ${open ? "open" : ""}`}>
          <li><Link to="/" onClick={closeMenu}>Home</Link></li>
          <li><Link to="/dashboard" onClick={closeMenu}>Dashboard</Link></li>
          <li><Link to="/goals" onClick={closeMenu}>Goals</Link></li>
          <li><Link to="/progress" onClick={closeMenu}>Progress</Link></li>
          <li><Link to="/signin" onClick={closeMenu}>Sign In</Link></li>
          <li>
            <Link to="/signup" className="signup-btn" onClick={closeMenu}>
              Sign Up
            </Link>
          </li>
        </ul>

        {/* HAMBURGER */}
        <button
          className="navbar-hamburger"
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      <div className={`navbar-mobile-menu ${open ? "open" : ""}`}>
        <Link to="/" onClick={closeMenu}>Home</Link>
        <Link to="/dashboard" onClick={closeMenu}>Dashboard</Link>
        <Link to="/goals" onClick={closeMenu}>Goals</Link>
        <Link to="/progress" onClick={closeMenu}>Progress</Link>
        <Link to="/signin" onClick={closeMenu}>Sign In</Link>
        <Link to="/signup" onClick={closeMenu}>Sign Up</Link>
      </div>
    </nav>
  );
}