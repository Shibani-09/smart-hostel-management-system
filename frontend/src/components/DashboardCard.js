function DashboardCard({ title, value, icon, color }) {
  return (
    <div
      className={`group rounded-[2rem] border border-white/10 p-6 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl transition duration-300 hover:-translate-y-1 ${color}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">{title}</h2>
          <p className="mt-4 text-4xl font-semibold text-white">{value}</p>
        </div>

        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 text-4xl text-white shadow-lg shadow-black/20">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default DashboardCard;
