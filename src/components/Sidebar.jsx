// src/components/Sidebar.jsx
// import React, {
//   useEffect,
//   useImperativeHandle,
//   forwardRef,
//   useRef,
// } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import logo from "../assets/images/logo.png";
// import "./sidebar.css";

// /* small hook to detect mobile breakpoint (keeps render deterministic) */
// function useIsMobile(breakpoint = 768) {
//   const [isMobile, setIsMobile] = React.useState(
//     typeof window !== "undefined" ? window.innerWidth <= breakpoint : false,
//   );

//   useEffect(() => {
//     const onResize = () => setIsMobile(window.innerWidth <= breakpoint);
//     window.addEventListener("resize", onResize);
//     return () => window.removeEventListener("resize", onResize);
//   }, [breakpoint]);

//   return isMobile;
// }

// /**
//  * Sidebar component (forwards ref to the <aside> element)
//  *
//  * Props:
//  *  - isOpen: boolean (controls mobile open state)
//  *  - onClose: function
//  *  - collapsed: boolean
//  *  - onToggleCollapse: function
//  */
// const Sidebar = forwardRef(function Sidebar(
//   {
//     isOpen = false,
//     onClose = () => {},
//     collapsed = false,
//     onToggleCollapse = null,
//   },
//   forwardedRef,
// ) {
//   const navigate = useNavigate();
//   const localRef = useRef(null);
//   // expose the DOM node to parent via forwardedRef
//   useImperativeHandle(forwardedRef, () => localRef.current);

//   const isMobile = useIsMobile(768);

//   useEffect(() => {
//     // Close on Escape key
//     const onKey = (e) => {
//       if (e.key === "Escape" && isOpen) onClose();
//     };
//     document.addEventListener("keydown", onKey);
//     return () => document.removeEventListener("keydown", onKey);
//   }, [isOpen, onClose]);

//   // When opening on mobile, move focus into the sidebar
//   useEffect(() => {
//     if (isOpen && localRef.current) {
//       const first = localRef.current.querySelector(
//         'a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])',
//       );
//       first?.focus();
//     }
//   }, [isOpen]);

//   const handleLogout = () => {
//     localStorage.removeItem("isAuth");
//     navigate("/signin");
//     onClose();
//   };

//   // Only render overlay on mobile when open
//   const showOverlay = isMobile && isOpen;

//   return (
//     <>
//       {showOverlay && (
//         <div
//           className={`sidebar-overlay visible`}
//           onClick={onClose}
//           aria-hidden="false"
//         />
//       )}

//       <aside
//         ref={localRef}
//         className={`sidebar ${isOpen ? "open" : ""} ${collapsed ? "collapsed" : ""}`}
//         // On mobile: hide from AT when closed. On desktop, sidebar is visible so aria-hidden=false.
//         aria-hidden={isMobile ? (!isOpen).toString() : "false"}
//       >
//         <div className="sidebar-header">
//           <button
//             className="collapse-toggle"
//             onClick={() => onToggleCollapse && onToggleCollapse(!collapsed)}
//             aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
//             title={collapsed ? "Expand" : "Collapse"}
//           >
//             ☰
//           </button>

//           <div
//             className="brand"
//             onClick={() => navigate("/dashboard")}
//             role="button"
//             tabIndex={0}
//             onKeyDown={(e) => {
//               if (e.key === "Enter" || e.key === " ") navigate("/dashboard");
//             }}
//           >
//             <img src={logo} alt="Focuset logo" className="sidebar-logo" />
//             {!collapsed && <span className="sidebar-title">Focuset</span>}
//           </div>
//         </div>

//         <nav className="nav" aria-label="Main navigation">
//           <NavLink
//             to="/dashboard"
//             className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
//             onClick={onClose}
//           >
//             <span className="icon">🏠</span>
//             {!collapsed && <span className="label">Dashboard</span>}
//           </NavLink>

//           <NavLink
//             to="/goals"
//             className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
//             onClick={onClose}
//           >
//             <span className="icon">🎯</span>
//             {!collapsed && <span className="label">Goals</span>}
//           </NavLink>

//           <NavLink
//             to="/progress"
//             className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
//             onClick={onClose}
//           >
//             <span className="icon">📈</span>
//             {!collapsed && <span className="label">Progress</span>}
//           </NavLink>

//           <NavLink
//             to="/profile"
//             className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
//             onClick={onClose}
//           >
//             <span className="icon">👤</span>
//             {!collapsed && <span className="label">Profile</span>}
//           </NavLink>

//           <NavLink
//             to="/settings"
//             className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
//             onClick={onClose}
//           >
//             <span className="icon">⚙️</span>
//             {!collapsed && <span className="label">Settings</span>}
//           </NavLink>

//           <div className="nav-spacer" />

//           <button className="nav-link logout-btn" onClick={handleLogout}>
//             <span className="icon">⎋</span>
//             {!collapsed && <span className="label">Log out</span>}
//           </button>
//         </nav>
//       </aside>
//     </>
//   );
// });

// export default Sidebar;

// src/components/Sidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import "../components/sidebar.css";
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
          <span className="sidebar-title">Focuset</span>
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

      {/* Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
    </>
  );
}
