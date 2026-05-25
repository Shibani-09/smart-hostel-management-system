function DashboardCard({ title, value, icon }) {
  return (
    <div className="rounded-xl border border-gray-100 p-6 shadow-sm bg-white">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">{title}</h3>
          <p className="mt-3 text-3xl font-bold text-gray-900">{value}</p>
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary text-white text-2xl shadow-md">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default DashboardCard;