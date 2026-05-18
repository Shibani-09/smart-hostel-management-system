export const Table = ({ headers, rows, loading = false, onRowClick = null }) => {
  if (loading) {
    return (
      <div className="rounded-lg border border-white/10 bg-slate-950/50 p-8 text-center text-slate-400">
        Loading...
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <div className="rounded-lg border border-white/10 bg-slate-950/50 p-8 text-center text-slate-400">
        No data found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-white/10 bg-slate-950/50">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            {headers.map((header, idx) => (
              <th
                key={idx}
                className="px-6 py-4 text-left text-sm font-medium text-slate-400"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={idx}
              onClick={() => onRowClick && onRowClick(row)}
              className={`border-b border-white/10 ${
                onRowClick ? "cursor-pointer hover:bg-slate-900/50 transition" : ""
              }`}
            >
              {Object.values(row).map((cell, cellIdx) => (
                <td key={cellIdx} className="px-6 py-4 text-sm text-slate-300">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const StatusBadge = ({ status }) => {
  const colors = {
    pending: "bg-amber-500/10 text-amber-200 border-amber-400/20",
    approved: "bg-emerald-500/10 text-emerald-200 border-emerald-400/20",
    rejected: "bg-rose-500/10 text-rose-200 border-rose-400/20",
    resolved: "bg-emerald-500/10 text-emerald-200 border-emerald-400/20",
    "in-progress": "bg-blue-500/10 text-blue-200 border-blue-400/20"
  };

  return (
    <span
      className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${
        colors[status] || "bg-slate-500/10 text-slate-200 border-slate-400/20"
      }`}
    >
      {status}
    </span>
  );
};
