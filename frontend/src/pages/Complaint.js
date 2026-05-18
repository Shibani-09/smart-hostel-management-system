import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { apiClient, getAuthHeader } from "../services/api";
import { useToast } from "../components/Toast";

function Complaint() {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { showToast, Toast } = useToast();

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        apiClient.complaints.myComplaints() + `?page=${page}&limit=5`,
        { headers: getAuthHeader() }
      );
      setComplaints(response.data?.data?.complaints || response.data?.complaints || []);
    } catch (err) {
      showToast(err?.response?.data?.message || "Unable to load complaints", "error");
    } finally {
      setLoading(false);
    }
  }, [page, showToast]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const submitComplaint = async (e) => {
    e.preventDefault();

    if (!description) {
      showToast("Description is required", "error");
      return;
    }

    setSubmitting(true);

    try {
      const message = subject ? `${subject}: ${description}` : description;
      await axios.post(
        apiClient.complaints.create(),
        { message },
        { headers: getAuthHeader() }
      );
      showToast("Complaint submitted successfully", "success");
      setSuccess("Complaint submitted successfully");
      setError("");
      setDescription("");
      setSubject("");
      setPage(1);
      await fetchComplaints();
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to submit complaint", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComplaint = async (complaintId) => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) return;

    try {
      await axios.delete(
        apiClient.complaints.delete(complaintId),
        { headers: getAuthHeader() }
      );
      showToast("Complaint deleted successfully", "success");
      fetchComplaints();
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to delete complaint", "error");
    }
  };

  return (
    <Layout>
      {Toast}
      <div className="space-y-8">
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-white">Student Complaints</h1>
              <p className="mt-2 text-slate-400">Report issues and monitor your complaint history.</p>
            </div>
          </div>

          <form onSubmit={submitComplaint} className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-300">Subject</label>
              <input
                className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-5 py-4 text-sm text-white outline-none transition focus:border-indigo-400"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Complaint subject"
              />
            </div>
            <div className="lg:col-span-2 space-y-3">
              <label className="block text-sm font-medium text-slate-300">Description</label>
              <textarea
                className="min-h-[160px] w-full rounded-3xl border border-white/10 bg-slate-950/90 px-5 py-4 text-sm text-white outline-none transition focus:border-indigo-400"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell us what’s happening..."
                required
              />
            </div>

            <div className="lg:col-span-2 flex flex-col gap-4">
              {error && <div className="rounded-3xl bg-rose-500/10 px-5 py-4 text-sm text-rose-200 ring-1 ring-rose-400/20">{error}</div>}
              {success && <div className="rounded-3xl bg-emerald-500/10 px-5 py-4 text-sm text-emerald-200 ring-1 ring-emerald-400/20">{success}</div>}
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center rounded-3xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Submitting..." : "Submit Complaint"}
              </button>
            </div>
          </form>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
          <h2 className="text-2xl font-semibold text-white">Complaint History</h2>
          <p className="mt-2 text-slate-400">Recent complaint submissions and current status.</p>

          <div className="mt-6 space-y-4">
            {loading && <p className="text-slate-300">Loading complaints...</p>}
            {!loading && complaints.length === 0 && <p className="text-slate-300">No complaints found yet.</p>}
            {!loading && complaints.map((complaint) => (
              <div key={complaint._id || complaint.id} className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-lg shadow-black/10">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-white">{complaint.message}</p>
                    <p className="text-sm text-slate-400">{new Date(complaint.createdAt || Date.now()).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-sm text-indigo-200">{complaint.status || "Pending"}</span>
                    {complaint.status === "pending" && (
                      <button
                        onClick={() => handleDeleteComplaint(complaint._id || complaint.id)}
                        className="rounded-full bg-rose-500/10 px-4 py-2 text-sm text-rose-200 hover:bg-rose-500/20 transition"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Complaint;
