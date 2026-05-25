import { motion } from 'framer-motion';
import { FiUsers, FiBell, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import Layout from '../components/layouts/Layout';
import StatCard from '../components/cards/StatCard';
import FeatureCard from '../components/cards/FeatureCard';
import ActivityCard from '../components/cards/ActivityCard';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

function AdminDashboard() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <Layout role="admin">
      <motion.div
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Welcome Header */}
        <motion.div variants={itemVariants}>
          <Card variant="elevated">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <p className="text-sm text-slate-400 uppercase tracking-wide font-semibold">Administration Panel</p>
                <h1 className="text-4xl font-bold text-slate-100 mt-2">Hostel Management Hub</h1>
                <p className="text-slate-400 mt-3 max-w-lg">
                  Oversee all hostel operations, manage users, rooms, notices, and track system health.
                </p>
              </div>

              <motion.div
                className="flex flex-col items-center justify-center p-6 rounded-xl bg-gradient-to-br from-error-500/10 to-error-600/10 border border-error-500/20"
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-sm text-slate-400">System Status</p>
                <p className="text-2xl font-bold text-success-400 mt-1">Optimal</p>
                <p className="text-xs text-slate-500 mt-2">All Systems Running</p>
              </motion.div>
            </div>
          </Card>
        </motion.div>

        {/* Key Statistics */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">System Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Students"
              value="128"
              subtitle="Active Residents"
              icon={FiUsers}
              color="primary"
              trend="+12 this month"
            />
            <StatCard
              title="Active Notices"
              value="18"
              subtitle="Live Announcements"
              icon={FiBell}
              color="info"
              trend="5 pending"
            />
            <StatCard
              title="Pending Approvals"
              value="7"
              subtitle="Waiting Review"
              icon={FiCheckCircle}
              color="warning"
              trend="Gate passes & complaints"
            />
            <StatCard
              title="System Alerts"
              value="2"
              subtitle="Requires Attention"
              icon={FiAlertCircle}
              color="error"
              trend="None critical"
            />
          </div>
        </motion.div>

        {/* Admin Features */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">Management Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FeatureCard
              title="Manage Students"
              description="Add, edit, or remove student profiles and records"
              icon={FiUsers}
              path="/admin-users"
              color="primary"
              badge="Essential"
            />
            <FeatureCard
              title="Room Management"
              description="Assign rooms, manage allocations, and track occupancy"
              icon={FiAlertCircle}
              path="/rooms"
              color="info"
            />
            <FeatureCard
              title="Publish Notices"
              description="Create and distribute announcements to all residents"
              icon={FiBell}
              path="/notices"
              color="success"
            />
          </div>
        </motion.div>

        {/* Dashboard Insights */}
        <motion.div
          className="grid gap-6 lg:grid-cols-[1.5fr_1fr]"
          variants={itemVariants}
        >
          {/* Recent Activity */}
          <Card variant="default">
            <h3 className="text-lg font-bold text-slate-100 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <ActivityCard
                title="New Student Registered"
                description="Raj Kumar added to system"
                timestamp="1 hour ago"
                status="completed"
                icon={FiCheckCircle}
              />
              <ActivityCard
                title="Room Allocation Updated"
                description="Block A, Room 101 reassigned"
                timestamp="3 hours ago"
                status="completed"
                icon={FiCheckCircle}
              />
              <ActivityCard
                title="System Backup"
                description="Database backup completed successfully"
                timestamp="Today at 2:00 AM"
                status="completed"
                icon={FiCheckCircle}
              />
            </div>
          </Card>

          {/* Quick Stats */}
          <Card variant="default">
            <h3 className="text-lg font-bold text-slate-100 mb-4">Pending Tasks</h3>
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/30">
                <p className="text-sm text-slate-400">Gate Pass Approvals</p>
                <p className="text-2xl font-bold text-primary-400 mt-2">5</p>
                <p className="text-xs text-slate-500 mt-2">Awaiting review</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/30">
                <p className="text-sm text-slate-400">Open Complaints</p>
                <p className="text-2xl font-bold text-warning-400 mt-2">3</p>
                <p className="text-xs text-slate-500 mt-2">Need investigation</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/30">
                <p className="text-sm text-slate-400">Rooms Vacant</p>
                <p className="text-2xl font-bold text-info-400 mt-2">8</p>
                <p className="text-xs text-slate-500 mt-2">Available for assignment</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Administration Insights */}
        <motion.div variants={itemVariants}>
          <Card variant="default">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-100">System Health</h3>
              <span className="text-xs px-2 py-1 rounded-full bg-success-500/20 text-success-300">Active</span>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm text-slate-400">Database Status</p>
                <div className="mt-3 h-2 bg-slate-700/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-success-500"
                    initial={{ width: 0 }}
                    animate={{ width: '95%' }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">95% Healthy</p>
              </div>

              <div>
                <p className="text-sm text-slate-400">Server Load</p>
                <div className="mt-3 h-2 bg-slate-700/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-info-500"
                    initial={{ width: 0 }}
                    animate={{ width: '45%' }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">45% Utilized</p>
              </div>

              <div>
                <p className="text-sm text-slate-400">API Response</p>
                <div className="mt-3 h-2 bg-slate-700/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-success-500"
                    initial={{ width: 0 }}
                    animate={{ width: '98%' }}
                    transition={{ duration: 1, delay: 0.4 }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">98% Uptime</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </Layout>
  );
}

export default AdminDashboard;
