import { useNavigate } from 'react-router-dom';
import { FiMenu, FiBell, FiLogOut, FiUser, FiChevronDown } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [showUserMenu, setShowUserMenu] = useState(false);

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
    navigate('/');
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-30 bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-xl border-b border-slate-700/50"
    >
      <div className="flex items-center justify-between px-4 md:px-8 py-4 max-w-7xl mx-auto w-full">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <motion.button
            onClick={onMenuClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <FiMenu size={20} />
          </motion.button>

          <div className="hidden md:flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold">
              H
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">Hostel Hub</p>
              <p className="text-xs text-slate-400">Management</p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative inline-flex items-center justify-center h-10 w-10 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-300 transition-colors"
          >
            <FiBell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
          </motion.button>

          {/* User Menu */}
          <div className="relative">
            <motion.button
              onClick={() => setShowUserMenu(!showUserMenu)}
              whileHover={{ scale: 1.02 }}
              className="hidden md:flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-sm">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-slate-200">{user.name || 'User'}</p>
                <p className="text-xs text-slate-400 capitalize">{user.role || 'student'}</p>
              </div>
              <motion.div
                animate={{ rotate: showUserMenu ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <FiChevronDown size={16} className="text-slate-400" />
              </motion.div>
            </motion.button>

            {/* User Dropdown */}
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-48 rounded-lg bg-slate-800 border border-slate-700/50 shadow-xl overflow-hidden"
              >
                <div className="p-4 border-b border-slate-700/50">
                  <p className="text-sm text-slate-400">Signed in as</p>
                  <p className="text-sm font-semibold text-slate-200 mt-1">{user.email || user.name}</p>
                </div>

                <motion.button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 flex items-center gap-2 text-sm text-error-400 hover:bg-error-500/10 transition-colors"
                  whileHover={{ x: 4 }}
                >
                  <FiLogOut size={16} />
                  Logout
                </motion.button>
              </motion.div>
            )}
          </div>

          {/* Mobile Logout */}
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg hover:bg-slate-800 text-error-400 transition-colors"
          >
            <FiLogOut size={20} />
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}

export default Navbar;
