// import { useState } from "react";
// import Sidebar from "../components/Sidebar";
// import Topbar from "../components/Topbar";
// import "../styles/DashboardLayout.css";

// export default function DashboardLayout({ children }) {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className="dashboard-layout">
//       {/* SIDEBAR */}
//       <Sidebar
//         isOpen={sidebarOpen}
//         onClose={() => setSidebarOpen(false)}
//       />

//       {/* OVERLAY (mobile only) */}
//       {sidebarOpen && (
//         <div
//           className="sidebar-overlay"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* MAIN CONTENT */}
//       <div className="dashboard-main">
//         <Topbar onMenuClick={() => setSidebarOpen(true)} />

//         <div className="dashboard-content">
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// }


// src/layouts/DashboardLayout.jsx
// import { useState } from "react";
// import Sidebar from "../components/Sidebar";
// import Topbar from "../components/Topbar";
// import "../styles/DashboardLayout.css";

// export default function DashboardLayout({ children }) {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className={`dashboard-layout ${sidebarOpen ? "sidebar-open" : ""}`}>
//       {/* SIDEBAR */}
//       <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

//       {/* MOBILE OVERLAY */}
//       {sidebarOpen && (
//         <div
//           className="sidebar-overlay"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* MAIN CONTENT */}
//       <div className="dashboard-main">
//         <Topbar onMenuClick={() => setSidebarOpen(true)} />
//         <div className="dashboard-content">{children}</div>
//       </div>
//     </div>
//   );
// }

Q// src/layouts/DashboardLayout.jsx
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/DashboardLayout.css";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* MAIN CONTENT */}
      <div className="dashboard-main">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
}