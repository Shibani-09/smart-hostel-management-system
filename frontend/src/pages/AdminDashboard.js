import Layout from "../components/Layout";
import DashboardCard from "../components/DashboardCard";

function AdminDashboard() {
  return (
    <Layout>
      <div className="space-y-8">
        <section className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-indigo-300">Admin Hub</p>
              <h1 className="mt-4 text-4xl font-semibold text-white">Hostel Administration</h1>
              <p className="mt-3 max-w-2xl text-slate-300">
                Manage students, staff, notices, and system-wide approvals from a clean, powerful dashboard.
              </p>
            </div>
            <div className="rounded-[1.8rem] bg-gradient-to-br from-cyan-500/20 to-violet-500/10 p-6 shadow-lg shadow-indigo-500/10">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Authority</p>
              <p className="mt-3 text-3xl font-semibold text-white">Administrator</p>
              <div className="mt-4 inline-flex rounded-full bg-slate-950/80 px-4 py-2 text-sm text-slate-200 ring-1 ring-white/10">
                System-wide oversight
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <DashboardCard
            title="Total Students"
            value="128"
            icon="👥"
            color="bg-gradient-to-br from-sky-500 to-indigo-700"
          />
          <DashboardCard
            title="Active Notices"
            value="18 Live"
            icon="📄"
            color="bg-gradient-to-br from-emerald-500 to-teal-600"
          />
          <DashboardCard
            title="Approval Requests"
            value="7 Waiting"
            icon="📝"
            color="bg-gradient-to-br from-fuchsia-500 to-purple-600"
          />
          <DashboardCard
            title="System Alerts"
            value="3 Critical"
            icon="⚠️"
            color="bg-gradient-to-br from-orange-500 to-amber-600"
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-white">Administration Insights</h2>
                <p className="mt-2 text-slate-400">See the health of hostel operations and pending admin responsibilities.</p>
              </div>
            </div>
            <div className="mt-8 space-y-5">
              <div className="rounded-3xl bg-slate-950/80 p-5 shadow-lg shadow-black/10">
                <p className="text-sm text-slate-400">Pending security reviews</p>
                <p className="mt-3 text-3xl font-semibold text-white">2 pending</p>
              </div>
              <div className="rounded-3xl bg-slate-950/80 p-5 shadow-lg shadow-black/10">
                <p className="text-sm text-slate-400">Notice drafts ready</p>
                <p className="mt-3 text-3xl font-semibold text-white">5 drafts</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
            <h2 className="text-2xl font-semibold text-white">Critical Actions</h2>
            <p className="mt-2 text-slate-400">Address the tasks that keep campus running smoothly.</p>
            <div className="mt-7 grid gap-4">
              <button className="rounded-3xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5">
                Manage Students
              </button>
              <button className="rounded-3xl bg-gradient-to-r from-sky-500 to-cyan-500 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:-translate-y-0.5">
                Publish Notice
              </button>
              <button className="rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5">
                Review Complaints
              </button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export default AdminDashboard;
