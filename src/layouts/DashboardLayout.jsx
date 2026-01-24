import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/DashboardLayout.css";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className={`dashboard-layout ${sidebarOpen ? "sidebar-open" : ""}`}>
      {/* SIDEBAR */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* OVERLAY — click closes sidebar */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
        />
      )}

      {/* MAIN CONTENT */}
      <div className="dashboard-main">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <div className="dashboard-content">{children}</div>
      </div>
    </div>
  );
}