import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  })();

  const role = user.role || "student";

  const menuItems =
    role === "admin"
      ? [
          { name: "Dashboard", path: "/admin-dashboard", icon: "🏠" },
          { name: "Manage Users", path: "/admin-users", icon: "👥" },
          { name: "Gate Pass Approvals", path: "/gatepass-approval", icon: "🛂" },
          { name: "Complaints", path: "/manage-complaints", icon: "📢" },
          { name: "Notices", path: "/notices", icon: "📄" },
        ]
      : role === "warden"
      ? [
          { name: "Dashboard", path: "/warden-dashboard", icon: "🏠" },
          { name: "Gate Pass Approvals", path: "/gatepass-approval", icon: "🛂" },
          { name: "Complaints", path: "/manage-complaints", icon: "📢" },
          { name: "Notices", path: "/notices", icon: "📄" },
        ]
      : [
          { name: "Dashboard", path: "/student-dashboard", icon: "🏠" },
          { name: "Gate Pass", path: "/gatepass", icon: "🚪" },
          { name: "Complaints", path: "/complaint", icon: "📢" },
          { name: "Notices", path: "/notices", icon: "📄" },
        ];

  return (
    <div className="w-72 min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-indigo-900 text-white shadow-2xl flex flex-col">
      
      {/* Logo */}
      <div className="p-8 border-b border-white/10">
        <h1 className="text-3xl font-extrabold tracking-wide">
          Smart Hostel
        </h1>

        <p className="text-sm text-gray-300 mt-2">
          Management System
        </p>
      </div>

      {/* Menu */}
      <div className="flex-1 p-5 space-y-3">
        {menuItems.map((item) => {
          const active = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-medium text-lg
              
              ${
                active
                  ? "bg-white text-purple-900 shadow-lg"
                  : "hover:bg-white/10 text-gray-200"
              }`}
            >
              <span className="text-2xl">
                {item.icon}
              </span>

              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Bottom */}
      <div className="p-5 border-t border-white/10">
        <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-lg">
          <p className="text-sm text-gray-300">
            Smart Hostel System
          </p>

          <p className="text-xs text-gray-400 mt-1">
            MERN Stack Project
          </p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;