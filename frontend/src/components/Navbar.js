import { useNavigate } from 'react-router-dom';
import { FiMenu, FiBell, FiLogOut, FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';

function Navbar({ setSidebarOpen }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || {};

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
      className="flex items-center justify-between gap-4 px-4 py-4 md:px-6"
    >
      <div className="flex items-center gap-4">
        <button
          aria-label="open menu"
          onClick={() => setSidebarOpen(true)}
          className="md:hidden inline-flex items-center justify-center h-11 w-11 rounded-xl bg-white/10 text-white/90 hover:bg-white/20 smooth-transition"
        >
          <FiMenu size={20} />
        </button>

        <div className="rounded-extra px-4 py-3 glass">
          <p className="text-sm text-primary/80 font-semibold">Smart Hostel</p>
          <p className="text-xs text-gray-600">College Management</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="inline-flex items-center justify-center h-11 w-11 rounded-xl bg-white/10 text-white smooth-transition hover:bg-white/20">
          <FiBell size={18} />
        </button>

        <div className="hidden md:flex items-center gap-3 rounded-extra px-4 py-2 glass">
          <FiUser className="text-primary" />
          <div>
            <p className="text-sm font-semibold text-gray-800">{user.name || 'Guest'}</p>
            <p className="text-xs text-gray-600">{user.role || 'student'}</p>
          </div>
        </div>

        <button onClick={handleLogout} className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-extra bg-primary text-white">
          <FiLogOut /> Logout
        </button>
      </div>
    </motion.header>
  );
}

export default Navbar;
