import { useState, useEffect } from "react";
import "../styles/topbar.css";

export default function Topbar({ onMenuClick }) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");

  // Load user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("safe_user"));
    if (storedUser) setUser(storedUser);
  }, []);

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
        {/* SIDEBAR TOGGLE */}
        <button
          className="menu-btn"
          aria-label="Toggle sidebar"
          onClick={onMenuClick}
        >
          ☰
        </button>

        {/* SEARCH */}
        <input
          type="text"
          className="search-input"
          placeholder="Search goals..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="topbar-right">
        <div className="user-info">
          <span className="welcome">
            {user ? `Welcome back, ${user.username}` : "Welcome"}
          </span>
          <span className="avatar">👤</span>
        </div>
      </div>
    </header>
  );
}
