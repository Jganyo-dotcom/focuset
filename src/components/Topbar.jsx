// src/components/Topbar.jsx
// import { useState, useEffect } from "react";
// import "../styles/topbar.css";

// export default function Topbar() {
//   const [open, setOpen] = useState(false);

//   // Close mobile menu when viewport becomes wide or on Escape
//   useEffect(() => {
//     const onResize = () => {
//       if (window.innerWidth > 768) setOpen(false);
//     };
//     const onKey = (e) => {
//       if (e.key === "Escape") setOpen(false);
//     };
//     window.addEventListener("resize", onResize);
//     window.addEventListener("keydown", onKey);
//     return () => {
//       window.removeEventListener("resize", onResize);
//       window.removeEventListener("keydown", onKey);
//     };
//   }, []);

//   return (
//     <header className="topbar" role="banner">
//       <div className="topbar-left">
//         <input
//           type="text"
//           placeholder="Search for goals..."
//           className="search-input"
//           aria-label="Search goals"
//         />
//       </div>

//       <div className="topbar-right">
//         <div className="user-info" aria-hidden={open ? "true" : "false"}>
//           <span className="welcome">Welcome back, Timi</span>
//           <span className="avatar" aria-hidden="true">
//             👤
//           </span>
//         </div>

//         {/* Hamburger (visible only on small screens) */}
//         <button
//           className="hamburger"
//           aria-label={open ? "Close menu" : "Open menu"}
//           aria-expanded={open}
//           onClick={() => setOpen((s) => !s)}
//         >
//           <span className="hamburger-icon">☰</span>
//         </button>
//       </div>

//       {/* Mobile menu (rendered when open) */}
//       {open && (
//         <nav className="mobile-menu" role="menu" aria-label="Mobile navigation">
//           <a role="menuitem" href="/dashboard">
//             Dashboard
//           </a>
//           <a role="menuitem" href="/goals">
//             Goals
//           </a>
//           <a role="menuitem" href="/progress">
//             Progress
//           </a>
//         </nav>
//       )}
//     </header>
//   );
// }

// src/components/Topbar.jsx
import { useState, useEffect } from "react";
import "../styles/topbar";

export default function Topbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("safe_user"));
    if (storedUser) setUser(storedUser);
  }, []);

  // Close mobile menu when viewport becomes wide or on Escape
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
        {/* Hamburger for mobile */}
        <button
          className="menu-btn"
          aria-label="Toggle sidebar"
          onClick={onMenuClick}
        >
          ☰
        </button>

        <input
          type="text"
          className="search-input"
          placeholder="Search goals..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="topbar-right">
        <div className="user-info" aria-hidden={open ? "true" : "false"}>
          <span className="welcome">
            {user ? `Welcome back, ${user.username}` : "Welcome"}
          </span>
          <span className="avatar" aria-hidden="true">
            👤
          </span>
        </div>

        {/* Hamburger (visible only on small screens) */}
        <button
          className="hamburger"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((s) => !s)}
        >
          <span className="hamburger-icon">☰</span>
        </button>
      </div>
    </header>
  );
}