import { useNavigate } from "react-router-dom";

function Navbar({ setSidebarOpen }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header className="flex items-center justify-between gap-4 rounded-b-[2rem] border-b border-white/10 bg-slate-950/80 px-4 py-4 shadow-2xl shadow-black/20 backdrop-blur-xl md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/90 text-slate-100 transition hover:bg-slate-800 md:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          ☰
        </button>

        <div className="rounded-3xl bg-slate-900/90 px-4 py-3 text-sm text-slate-200 shadow-lg shadow-black/20">
          <p className="text-slate-400">Hostel Control Center</p>
          <p className="mt-1 text-base font-semibold text-white">Dashboard Overview</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/90 text-slate-200 transition hover:border-indigo-300 hover:text-white">
          🔔
        </button>

        <div className="hidden rounded-3xl bg-slate-900/90 px-4 py-3 shadow-lg shadow-black/20 md:block">
          <p className="text-xs uppercase tracking-[0.3em] text-indigo-300">{user.role || "student"}</p>
          <p className="mt-1 text-sm font-semibold text-white">{user.name || "Guest User"}</p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="hidden rounded-3xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 md:inline-flex"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;
