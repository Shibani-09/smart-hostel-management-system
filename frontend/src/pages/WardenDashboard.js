import { motion } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiBell, FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layouts/Layout';
import StatCard from '../components/cards/StatCard';
import FeatureCard from '../components/cards/FeatureCard';
import ActivityCard from '../components/cards/ActivityCard';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import DashboardCard from '../components/DashboardCard';

function WardenDashboard() {
  const navigate = useNavigate();

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
    <Layout role="warden">
      <motion.div
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <section className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-indigo-300">Warden Console</p>
              <h1 className="mt-4 text-4xl font-semibold text-white">Hostel Oversight</h1>
              <p className="mt-3 max-w-2xl text-slate-300">
                Manage gate passes, complaints, and important notices from a premium command center.
              </p>
            </div>
            <div className="rounded-[1.8rem] bg-gradient-to-br from-fuchsia-500/20 to-sky-500/10 p-6 shadow-lg shadow-indigo-500/10">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Active Session</p>
              <p className="mt-3 text-3xl font-semibold text-white">Warden Mode</p>
              <div className="mt-4 inline-flex rounded-full bg-slate-950/80 px-4 py-2 text-sm text-slate-200 ring-1 ring-white/10">
                Review student requests
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <DashboardCard
            title="Pending Gate Passes"
            value="5 Requests"
            icon="🛂"
            color="bg-gradient-to-br from-sky-500 to-indigo-600"
          />
          <DashboardCard
            title="New Complaints"
            value="3 Open"
            icon="📝"
            color="bg-gradient-to-br from-rose-500 to-purple-600"
          />
          <DashboardCard
            title="Published Notices"
            value="12 Active"
            icon="📣"
            color="bg-gradient-to-br from-emerald-500 to-teal-500"
          />
          <DashboardCard
            title="Residence Alerts"
            value="2 Urgent"
            icon="⚡"
            color="bg-gradient-to-br from-orange-500 to-amber-500"
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-white">Today’s Summary</h2>
                <p className="mt-2 text-slate-400">Track important updates and active approvals.</p>
              </div>
            </div>

            <div className="mt-8 space-y-5">
              <div className="rounded-3xl bg-slate-950/80 p-5 shadow-lg shadow-black/10">
                <p className="text-sm text-slate-400">Gate pass approvals</p>
                <p className="mt-3 text-3xl font-semibold text-white">4 / 5 processed</p>
              </div>
              <div className="rounded-3xl bg-slate-950/80 p-5 shadow-lg shadow-black/10">
                <p className="text-sm text-slate-400">Critical complaints</p>
                <p className="mt-3 text-3xl font-semibold text-white">1 urgent</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
            <h2 className="text-2xl font-semibold text-white">Quick Actions</h2>
            <p className="mt-2 text-slate-400">Focus on the next tasks that need your attention.</p>
            <div className="mt-7 grid gap-4">
              <button className="rounded-3xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5">
                Review Complaints
              </button>
              <button className="rounded-3xl bg-gradient-to-r from-sky-500 to-cyan-500 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:-translate-y-0.5">
                Approve Gate Passes
              </button>
              <button className="rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5">
                Publish Notice
              </button>
            </div>
          </div>
        </section>
      </motion.div>
    </Layout>
  );
}

export default WardenDashboard;
