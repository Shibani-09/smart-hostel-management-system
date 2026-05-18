import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { apiClient, getAuthHeader } from "../services/api";
import { StatusBadge } from "../components/Table";
import { useToast } from "../components/Toast";

function GatePass() {
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gatePasses, setGatePasses] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { showToast, Toast } = useToast();

  const fetchGatePasses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        apiClient.gatepass.myPasses() + `?page=${page}&limit=5`,
        { headers: getAuthHeader() }
      );
      setGatePasses(response.data?.data?.passes || []);
      setTotalPages(response.data?.data?.pagination?.pages || 1);
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to fetch gate passes", "error");
    } finally {
      setLoading(false);
    }
  }, [page, showToast]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    setName(user.name || "");
    fetchGatePasses();
  }, [fetchGatePasses]);

  const submitGatepass = async (e) => {
    e.preventDefault();
    
    if (!reason || !date || !time) {
      showToast("All fields are required", "error");
      return;
    }

    setSubmitting(true);

    try {
      await axios.post(
        apiClient.gatepass.request(),
        { reason, date, time },
        { headers: getAuthHeader() }
      );
      showToast("Gate pass request submitted successfully", "success");
      setReason("");
      setDate("");
      setTime("");
      setPage(1);
      fetchGatePasses();
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to submit gate pass request", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (passId) => {
    if (!window.confirm("Are you sure you want to delete this gate pass?")) return;

    try {
      await axios.delete(
        apiClient.gatepass.delete(passId),
        { headers: getAuthHeader() }
      );
      showToast("Gate pass deleted successfully", "success");
      fetchGatePasses();
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to delete gate pass", "error");
    }
  };

  return (
    <Layout>
      {Toast}
      <div className="space-y-8">
        {/* Form Section */}
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-white">Gate Pass Request</h1>
              <p className="mt-2 text-slate-400">Complete the form to request permission to leave the campus.</p>
            </div>
            <div className="rounded-3xl bg-slate-950/80 px-4 py-3 text-sm text-slate-200 shadow-lg shadow-black/20">
              <p className="font-medium text-white">Fast, secure request handling</p>
            </div>
          </div>

          <form onSubmit={submitGatepass} className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-300">Student Name</label>
              <input
                readOnly
                className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-5 py-4 text-sm text-slate-400 outline-none"
                value={name}
                placeholder="Student name"
              />
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-300">Reason</label>
              <input
                className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-5 py-4 text-sm text-white outline-none transition focus:border-indigo-400"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason for leaving"
                required
              />
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-300">Date</label>
              <input
                type="date"
                className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-5 py-4 text-sm text-white outline-none transition focus:border-indigo-400"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-300">Time</label>
              <input
                type="time"
                className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-5 py-4 text-sm text-white outline-none transition focus:border-indigo-400"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>

            <div className="lg:col-span-2 flex flex-col gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center rounded-3xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Submitting..." : "Submit Gate Pass"}
              </button>
            </div>
          </form>
        </div>

        {/* Your Gate Passes Section */}
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white">Your Gate Passes</h2>
            <p className="mt-2 text-slate-400">View and manage your gate pass requests</p>
          </div>

          {loading ? (
            <div className="text-center py-8 text-slate-400">Loading...</div>
          ) : gatePasses.length === 0 ? (
            <div className="text-center py-8 text-slate-400">No gate passes found</div>
          ) : (
            <div className="space-y-4">
              {gatePasses.map((pass) => (
                <div
                  key={pass._id}
                  className="rounded-lg border border-white/10 bg-slate-950/50 p-4 hover:bg-slate-950/80 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <p className="font-medium text-white">{pass.reason}</p>
                        <StatusBadge status={pass.status} />
                      </div>
                      <p className="mt-2 text-sm text-slate-400">
                        📅 {new Date(pass.date).toLocaleDateString()} at {pass.time}
                      </p>
                      {pass.remarks && (
                        <p className="mt-1 text-sm text-slate-400">
                          📝 Remarks: {pass.remarks}
                        </p>
                      )}
                    </div>
                    {pass.status === "pending" && (
                      <button
                        onClick={() => handleDelete(pass._id)}
                        className="text-rose-400 hover:text-rose-300 text-sm font-medium transition"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 rounded border border-white/10 text-sm text-slate-300 hover:bg-slate-800 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-slate-400">{page} / {totalPages}</span>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1 rounded border border-white/10 text-sm text-slate-300 hover:bg-slate-800 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default GatePass;
