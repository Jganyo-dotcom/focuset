// src/components/Topbar.jsx
import { useState, useEffect } from "react";
import "../styles/topbar.css";

export default function Topbar({ onMenuClick }) {
  const [open, setOpen] = useState(false);

  // Close mobile menu on resize / escape
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header className="topbar">
      <div className="topbar-left">
        {/* HAMBURGER */}
        <button
          className="menu-btn"
          aria-label="Open sidebar"
          onClick={onMenuClick}
        >
          ☰
        </button>

        <input
          type="text"
          placeholder="Search for goals..."
          className="search-input"
        />
      </div>

      <div className="topbar-right">
        <span className="welcome">Welcome back</span>
        <span className="avatar">👤</span>
      </div>
    </header>
  );
}