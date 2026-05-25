import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiUsers, FiFileText, FiBell, FiEdit, FiLogOut, FiX } from 'react-icons/fi';
import { useState, useEffect } from 'react';

function Sidebar({ onClose, role = 'student' }) {
  const location = useLocation();
  const [user, setUser] = useState({});

  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(userData);
    } catch {
      setUser({});
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const menuItems =
    role === 'admin' || user?.role === 'admin'
      ? [
          { name: 'Dashboard', path: '/admin-dashboard', icon: <FiHome /> },
          { name: 'User Management', path: '/admin-users', icon: <FiUsers /> },
          { name: 'Room Management', path: '/rooms', icon: <FiEdit /> },
          { name: 'Complaints', path: '/manage-complaints', icon: <FiFileText /> },
          { name: 'Notices', path: '/notices', icon: <FiBell /> },
        ]
      : role === 'warden' || user?.role === 'warden'
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
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-72 bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-800/50 h-screen flex flex-col shadow-2xl"
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-800/50">
        <div className="flex items-center justify-between">
          <div>
            <motion.h1
              className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Hostel Hub
            </motion.h1>
            <p className="text-xs text-slate-400 mt-1">Management System</p>
          </div>
          <button
            onClick={onClose}
            className="md:hidden p-1 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {menuItems.map((item, index) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={onClose}
              as={motion.div}
              component={motion.div}
            >
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200
                  ${
                    active
                      ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-300'
                  }
                `}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-slate-800/50 space-y-4">
        {/* User Info */}
        <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
          <p className="text-xs text-slate-500 uppercase tracking-wide">Current User</p>
          <p className="text-sm font-semibold text-slate-200 mt-1">{user.name || 'User'}</p>
          <p className="text-xs text-slate-400 mt-0.5 capitalize">{user.role || 'student'}</p>
        </div>

        {/* Logout Button */}
        <motion.button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-error-500/10 hover:bg-error-500/20 text-error-400 font-medium transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FiLogOut size={18} />
          Logout
        </motion.button>
      </div>
    </motion.aside>
  );
}

export default Sidebar;
