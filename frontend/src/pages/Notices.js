import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { apiClient, getAuthHeader } from "../services/api";

function Notices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get(apiClient.notices.all(), {
          headers: getAuthHeader(),
        });
        setNotices(response.data?.data?.notices || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Unable to load notices.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  return (
    <Layout>
      <div className="space-y-8">
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-white">Notices</h1>
              <p className="mt-2 text-slate-400">Latest announcements for students and staff.</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {loading && (
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 text-slate-300 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
              Loading notices...
            </div>
          )}

          {error && (
            <div className="rounded-[2rem] border border-rose-500/20 bg-rose-500/10 p-8 text-rose-200 shadow-lg shadow-rose-500/10 backdrop-blur-xl">
              {error}
            </div>
          )}

          {!loading && !error && notices.length === 0 && (
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 text-slate-300 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
              No notices available yet.
            </div>
          )}

          {!loading && notices.map((notice) => (
            <article key={notice._id || notice.id} className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl transition hover:-translate-y-1">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-white">{notice.title}</h2>
                  <p className="mt-2 text-sm text-slate-400">{new Date(notice.createdAt || notice.date || Date.now()).toLocaleDateString()}</p>
                </div>
                <span className="rounded-full bg-indigo-500/10 px-4 py-2 text-sm text-indigo-200">Notice</span>
              </div>
              <p className="mt-6 text-slate-300 leading-7">{notice.message || notice.description || "No details provided."}</p>
            </article>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default Notices;
