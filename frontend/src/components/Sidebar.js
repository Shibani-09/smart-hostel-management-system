import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiUsers, FiFileText, FiBell, FiEdit } from 'react-icons/fi';

function Sidebar({ collapsed = false }) {
  const location = useLocation();

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  })();

  const role = user.role || 'student';

  const menuItems =
    role === 'admin'
      ? [
          { name: 'Dashboard', path: '/admin-dashboard', icon: <FiHome /> },
          { name: 'Manage Users', path: '/admin-users', icon: <FiUsers /> },
          { name: 'Room Management', path: '/rooms', icon: <FiEdit /> },
          { name: 'Complaints', path: '/manage-complaints', icon: <FiFileText /> },
          { name: 'Notices', path: '/notices', icon: <FiBell /> },
        ]
      : role === 'warden'
      ? [
          { name: 'Dashboard', path: '/warden-dashboard', icon: <FiHome /> },
          { name: 'Gate Pass Approvals', path: '/gatepass-approval', icon: <FiEdit /> },
          { name: 'Complaints', path: '/manage-complaints', icon: <FiFileText /> },
          { name: 'Notices', path: '/notices', icon: <FiBell /> },
        ]
      : [
          { name: 'Dashboard', path: '/student-dashboard', icon: <FiHome /> },
          { name: 'Gate Pass', path: '/gatepass', icon: <FiEdit /> },
          { name: 'Complaints', path: '/complaint', icon: <FiFileText /> },
          { name: 'Notices', path: '/notices', icon: <FiBell /> },
        ];

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-72 md:fixed md:inset-y-0 md:left-0 z-40 bg-white text-gray-800 shadow-lg"
    >
      <div className="p-6 border-b">
        <h2 className="text-2xl font-extrabold text-primary">Smart Hostel</h2>
        <p className="text-sm text-gray-600">Management</p>
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const active = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium smooth-transition ${
                active ? 'bg-primary text-white shadow' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-4 border-t">
        <div className="text-sm text-gray-600">
          <p>Signed in as</p>
          <p className="font-semibold text-gray-800">{user.name || 'Guest'}</p>
        </div>
      </div>
    </motion.aside>
  );
}

export default Sidebar;