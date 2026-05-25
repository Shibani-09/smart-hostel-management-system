import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { apiClient } from '../services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Demo credentials hint
  const [showHint, setShowHint] = useState(false);

  const validateInputs = () => {
    if (!email || !password) {
      setError('Email and password are required');
      return false;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateInputs()) return;

    try {
      setLoading(true);
      const res = await axios.post(apiClient.auth.login(), { email, password });
      const payload = res.data?.data;

      if (res.data.success && payload) {
        localStorage.setItem('token', payload.token);
        localStorage.setItem('user', JSON.stringify(payload.user));

        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          const role = payload.user.role;
          if (role === 'admin') {
            navigate('/admin-dashboard');
          } else if (role === 'warden') {
            navigate('/warden-dashboard');
          } else {
            navigate('/student-dashboard');
          }
        }, 800);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-info-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            delay: 2,
          }}
        />
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md relative z-10">
        <motion.div
          className="space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div
            className="text-center space-y-3"
            variants={itemVariants}
          >
            <motion.div
              className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <span className="text-3xl font-bold text-white">H</span>
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-slate-100">Hostel Hub</h1>
              <p className="text-slate-400 mt-1">Smart Management System</p>
            </div>
          </motion.div>

          {/* Alerts */}
          {error && (
            <motion.div variants={itemVariants}>
              <Alert
                type="error"
                title="Login Failed"
                message={error}
                onClose={() => setError('')}
                dismissible
              />
            </motion.div>
          )}

          {success && (
            <motion.div variants={itemVariants}>
              <Alert
                type="success"
                title="Success!"
                message={success}
                dismissible={false}
              />
            </motion.div>
          )}

          {/* Login Card */}
          <motion.div variants={itemVariants}>
            <Card variant="elevated" className="!p-8">
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email Input */}
                <Input
                  type="email"
                  label="Email Address"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={FiMail}
                  required
                  disabled={loading}
                />

                {/* Password Input */}
                <Input
                  type="password"
                  label="Password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={FiLock}
                  required
                  disabled={loading}
                />

                {/* Login Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={loading}
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </motion.div>
              </form>
            </Card>
          </motion.div>

          {/* Demo Credentials */}
          <motion.div
            variants={itemVariants}
            className="text-center"
          >
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="text-sm text-slate-400 hover:text-slate-300 transition-colors"
            >
              Need demo credentials?
            </button>

            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 rounded-lg bg-info-500/10 border border-info-500/30 text-left text-sm text-slate-300"
              >
                <p className="font-semibold text-info-300 mb-2">Demo Accounts:</p>
                <div className="space-y-2 text-xs">
                  <div>
                    <p className="text-slate-400">Admin:</p>
                    <p className="text-slate-300">admin@hostel.com / password123</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Student:</p>
                    <p className="text-slate-300">student@hostel.com / password123</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Warden:</p>
                    <p className="text-slate-300">warden@hostel.com / password123</p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Footer */}
          <motion.div
            variants={itemVariants}
            className="text-center text-xs text-slate-500"
          >
            <p>© 2024 Hostel Hub. All rights reserved.</p>
            <p className="mt-2">Secure enterprise-grade system</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;