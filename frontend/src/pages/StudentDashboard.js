import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiFileText, FiBell, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import Layout from '../components/layouts/Layout';
import StatCard from '../components/cards/StatCard';
import FeatureCard from '../components/cards/FeatureCard';
import ActivityCard from '../components/cards/ActivityCard';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

function StudentDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || {};

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <Layout role="student">
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
                <p className="text-sm text-slate-400 uppercase tracking-wide font-semibold">Welcome back</p>
                <h1 className="text-4xl font-bold text-slate-100 mt-2">{user.name || 'Student'}</h1>
                <p className="text-slate-400 mt-3 max-w-lg">
                  Manage your hostel requests, stay updated with notices, and track your submissions all in one place.
                </p>
              </div>

              <motion.div
                className="flex flex-col items-center justify-center p-6 rounded-xl bg-gradient-to-br from-primary-500/10 to-primary-600/10 border border-primary-500/20"
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-sm text-slate-400">Your Status</p>
                <p className="text-2xl font-bold text-success-400 mt-1">Active</p>
                <p className="text-xs text-slate-500 mt-2">Room Assigned</p>
              </motion.div>
            </div>
          </Card>
        </motion.div>

        {/* Statistics */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">Quick Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Gate Passes"
              value="2"
              subtitle="Pending Approval"
              icon={FiArrowRight}
              color="primary"
              trend="3 this month"
            />
            <StatCard
              title="Complaints"
              value="1"
              subtitle="Open"
              icon={FiAlertCircle}
              color="warning"
              trend="Avg 2 days response"
            />
            <StatCard
              title="New Notices"
              value="5"
              subtitle="This Week"
              icon={FiBell}
              color="info"
              trend="View all"
            />
            <StatCard
              title="Profile Status"
              value="100%"
              subtitle="Complete"
              icon={FiCheckCircle}
              color="success"
              trend="Verified"
            />
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FeatureCard
              title="Request Gate Pass"
              description="Apply for an out-pass to leave the hostel premises"
              icon={FiArrowRight}
              path="/gatepass"
              color="primary"
              badge="Popular"
            />
            <FeatureCard
              title="File Complaint"
              description="Report issues or concerns to the management"
              icon={FiAlertCircle}
              path="/complaint"
              color="warning"
            />
            <FeatureCard
              title="View Notices"
              description="Stay updated with important hostel announcements"
              icon={FiBell}
              path="/notices"
              color="info"
            />
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          className="grid gap-6 lg:grid-cols-[1fr_1fr]"
          variants={itemVariants}
        >
          {/* Recent Gate Pass */}
          <Card variant="default">
            <h3 className="text-lg font-bold text-slate-100 mb-4">Recent Gate Pass</h3>
            <div className="space-y-3">
              <ActivityCard
                title="Gate Pass Approved"
                description="Your request to visit home was approved"
                timestamp="2 hours ago"
                status="approved"
                icon={FiCheckCircle}
                action="View Details"
              />
              <ActivityCard
                title="Gate Pass Pending"
                description="Waiting for warden's approval"
                timestamp="5 hours ago"
                status="pending"
                icon={FiArrowRight}
              />
            </div>
          </Card>

          {/* Recent Complaints */}
          <Card variant="default">
            <h3 className="text-lg font-bold text-slate-100 mb-4">Recent Complaints</h3>
            <div className="space-y-3">
              <ActivityCard
                title="Water Supply Issue"
                description="Reported water leakage in room"
                timestamp="1 day ago"
                status="pending"
                icon={FiAlertCircle}
                action="View Details"
              />
              <ActivityCard
                title="WiFi Not Working"
                description="Internet connectivity issue resolved"
                timestamp="3 days ago"
                status="completed"
                icon={FiCheckCircle}
              />
            </div>
          </Card>
        </motion.div>

        {/* Latest Notices */}
        <motion.div variants={itemVariants}>
          <Card variant="default">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-100">Latest Notices</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/notices')}
              >
                View All
              </Button>
            </div>

            <div className="space-y-3">
              {[
                {
                  title: 'Hostel Cleaning Schedule',
                  date: 'Today',
                },
                {
                  title: 'Fee Submission Deadline Extended',
                  date: 'Yesterday',
                },
                {
                  title: 'Guest Visiting Hours Updated',
                  date: '2 days ago',
                },
              ].map((notice, idx) => (
                <motion.div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/30 hover:border-slate-600/50 transition-colors cursor-pointer"
                  whileHover={{ x: 4 }}
                >
                  <p className="text-sm font-medium text-slate-200">{notice.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{notice.date}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </Layout>
  );
}

export default StudentDashboard;
