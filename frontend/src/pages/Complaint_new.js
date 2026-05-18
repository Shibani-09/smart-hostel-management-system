import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { apiClient, getAuthHeader } from "../services/api";
import { StatusBadge } from "../components/Table";
import { useToast } from "../components/Toast";

function Complaint() {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast, showToast, Toast } = useToast();

  useEffect(() => {
    fetchComplaints();
  }, [page]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        apiClient.complaints.myComplaints() + `?page=${page}&limit=5`,
        { headers: getAuthHeader() }
      );
      setComplaints(response.data?.data?.complaints || response.data?.complaints || []);
      setTotalPages(response.data?.data?.pagination?.pages || 1);
    } catch (err) {
      showToast(err?.response?.data?.message || "Unable to load complaints", "error");
    } finally {
      setLoading(false);
    }
  };

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
        `${apiClient.complaints.myComplaints().replace("/my-complaints", "")}/${complaintId}`,
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
        {/* Form Section */}
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-white">Student Complaints</h1>
              <p className="mt-2 text-slate-400">Report issues and monitor your complaint history.</p>
            </div>
          </div>

          <form onSubmit={submitComplaint} className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-300">Subject (Optional)</label>
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
                placeholder="Tell us what's happening... (minimum 10 characters)"
                required
              />
            </div>

            <div className="lg:col-span-2 flex flex-col gap-4">
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

        {/* Complaint History Section */}
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white">Complaint History</h2>
            <p className="mt-2 text-slate-400">Recent complaint submissions and current status.</p>
          </div>

          {loading ? (
            <div className="text-center py-8 text-slate-400">Loading...</div>
          ) : complaints.length === 0 ? (
            <div className="text-center py-8 text-slate-400">No complaints found yet.</div>
          ) : (
            <div className="space-y-4">
              {complaints.map((complaint) => (
                <div
                  key={complaint._id}
                  className="rounded-lg border border-white/10 bg-slate-950/50 p-4 hover:bg-slate-950/80 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <p className="font-medium text-white">{complaint.message}</p>
                        <StatusBadge status={complaint.status || "pending"} />
                      </div>
                      <p className="mt-2 text-sm text-slate-400">
                        📅 {new Date(complaint.createdAt).toLocaleDateString()} at {new Date(complaint.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                      {complaint.reply && (
                        <div className="mt-3 rounded-lg bg-slate-900/50 p-3 border-l-2 border-emerald-500">
                          <p className="text-xs text-slate-400 font-medium">Warden's Reply:</p>
                          <p className="text-sm text-emerald-200 mt-1">{complaint.reply}</p>
                        </div>
                      )}
                    </div>
                    {complaint.status === "pending" && (
                      <button
                        onClick={() => handleDeleteComplaint(complaint._id)}
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

export default Complaint;
