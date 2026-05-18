import Layout from "../components/Layout";
import DashboardCard from "../components/DashboardCard";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};

  return (
    <Layout>
      <div className="space-y-8">
        <section className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-indigo-300">Welcome back</p>
              <h1 className="mt-4 text-4xl font-semibold text-white">{user.name || "Student"}</h1>
              <p className="mt-3 max-w-2xl text-slate-300">
                Your Smart Hostel dashboard gives you the fastest access to gate passes, notices, and complaint workflows from a polished, modern workspace.
              </p>
            </div>

            <div className="rounded-[1.8rem] bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/10 p-6 shadow-lg shadow-indigo-500/10">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Role</p>
              <p className="mt-3 text-3xl font-semibold text-white capitalize">{user.role || "student"}</p>
              <div className="mt-4 inline-flex rounded-full bg-slate-950/80 px-4 py-2 text-sm text-slate-200 ring-1 ring-white/10">
                Active student account
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <DashboardCard
            title="Active Gate Passes"
            value="2 Pending"
            icon="🚪"
            color="bg-gradient-to-br from-blue-500 to-indigo-600"
          />
          <DashboardCard
            title="Open Complaints"
            value="1 Open"
            icon="⚠️"
            color="bg-gradient-to-br from-fuchsia-500 to-purple-600"
          />
          <DashboardCard
            title="New Notices"
            value="4 Today"
            icon="📢"
            color="bg-gradient-to-br from-emerald-500 to-cyan-500"
          />
          <DashboardCard
            title="Profile Status"
            value="Verified"
            icon="👨‍🎓"
            color="bg-gradient-to-br from-violet-500 to-pink-600"
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-white">Quick Actions</h2>
                <p className="mt-2 text-slate-400">Navigate to your most important student workflows.</p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <button
                onClick={() => navigate("/gatepass")}
                className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5"
              >
                Apply Gate Pass
              </button>
              <button
                onClick={() => navigate("/complaint")}
                className="rounded-3xl bg-gradient-to-r from-rose-500 to-fuchsia-500 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition hover:-translate-y-0.5"
              >
                Submit Complaint
              </button>
              <button
                onClick={() => navigate("/notices")}
                className="rounded-3xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5"
              >
                View Notices
              </button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-white">Recent Activity</h2>
                <p className="mt-2 text-slate-400">Your latest hostel interactions at a glance.</p>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <article className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 transition hover:border-indigo-500/30">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-white">Gate pass approved</p>
                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm text-emerald-300">Completed</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-400">Your recent gate pass was approved by the warden. You can now collect your pass from the hostel office.</p>
              </article>
              <article className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 transition hover:border-indigo-500/30">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-white">New notice received</p>
                  <span className="rounded-full bg-indigo-500/15 px-3 py-1 text-sm text-indigo-200">Notice</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-400">A new hostel maintenance notice was published. Check the notices page for full details.</p>
              </article>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export default StudentDashboard;
