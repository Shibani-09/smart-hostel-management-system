import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { apiClient, getAuthHeader } from "../services/api";
import { StatusBadge } from "../components/Table";
import { Modal } from "../components/Modal";
import { useToast } from "../components/Toast";

function WardenComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("pending");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reply, setReply] = useState("");
  const [newStatus, setNewStatus] = useState("pending");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast, Toast } = useToast();

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${apiClient.complaints.all()}?status=${filter === "all" ? "" : filter}&page=${page}&limit=10`,
        { headers: getAuthHeader() }
      );
      setComplaints(response.data?.data?.complaints || []);
      setTotalPages(response.data?.data?.pagination?.pages || 1);
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to fetch complaints", "error");
    } finally {
      setLoading(false);
    }
  }, [filter, page, showToast]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const handleUpdateComplaint = async () => {
    if (!selectedComplaint) return;

    setIsSubmitting(true);
    try {
      await axios.put(
        `${apiClient.complaints.update(selectedComplaint._id)}`,
        {
          status: newStatus,
          reply: reply || undefined
        },
        { headers: getAuthHeader() }
      );
      showToast("Complaint updated successfully", "success");
      setIsModalOpen(false);
      setReply("");
      setNewStatus("pending");
      setSelectedComplaint(null);
      fetchComplaints();
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to update complaint", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openModal = (complaint) => {
    setSelectedComplaint(complaint);
    setNewStatus(complaint.status);
    setReply(complaint.reply || "");
    setIsModalOpen(true);
  };

  return (
    <Layout>
      {Toast}
      <div className="space-y-8">
        {/* Header */}
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
          <div>
            <h1 className="text-3xl font-semibold text-white">Manage Complaints</h1>
            <p className="mt-2 text-slate-400">Review and respond to student complaints</p>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
          <div className="flex gap-2 flex-wrap">
            {["pending", "in-progress", "resolved", "all"].map((status) => (
              <button
                key={status}
                onClick={() => { setFilter(status); setPage(1); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition capitalize ${
                  filter === status
                    ? "bg-indigo-500/20 text-indigo-200 border border-indigo-400/20"
                    : "border border-white/10 text-slate-400 hover:bg-slate-800"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Complaints List */}
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
          {loading ? (
            <div className="text-center py-8 text-slate-400">Loading...</div>
          ) : complaints.length === 0 ? (
            <div className="text-center py-8 text-slate-400">No complaints found</div>
          ) : (
            <div className="space-y-4">
              {complaints.map((complaint) => (
                <div
                  key={complaint._id}
                  className="rounded-lg border border-white/10 bg-slate-950/50 p-4 hover:bg-slate-950/80 transition cursor-pointer"
                  onClick={() => openModal(complaint)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-white line-clamp-2">
                          {complaint.message}
                        </h3>
                        <StatusBadge status={complaint.status} />
                      </div>
                      <p className="text-sm text-slate-400">
                        <strong>Student:</strong> {complaint.student?.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        📧 {complaint.student?.email}
                      </p>
                      <p className="text-sm text-slate-400">
                        📅 {new Date(complaint.createdAt).toLocaleDateString()} at {new Date(complaint.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                      {complaint.reply && (
                        <div className="mt-3 rounded-lg bg-slate-900/50 p-3 border-l-2 border-emerald-500">
                          <p className="text-xs text-slate-400 font-medium">Your Reply:</p>
                          <p className="text-sm text-emerald-200 mt-1 line-clamp-2">{complaint.reply}</p>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(complaint);
                      }}
                      className="px-3 py-2 rounded-lg bg-indigo-500/10 text-indigo-200 border border-indigo-400/20 hover:bg-indigo-500/20 text-sm font-medium transition whitespace-nowrap"
                    >
                      {complaint.status === "resolved" ? "View" : "Respond"}
                    </button>
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

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        title="Complaint Details"
        onClose={() => {
          setIsModalOpen(false);
          setSelectedComplaint(null);
          setReply("");
        }}
        actionButton={
          <button
            onClick={handleUpdateComplaint}
            disabled={isSubmitting}
            className="flex-1 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600 transition disabled:opacity-50"
          >
            {isSubmitting ? "Updating..." : "Update"}
          </button>
        }
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-slate-300">Message:</p>
            <p className="text-sm text-slate-400 mt-1">{selectedComplaint?.message}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-300">Student:</p>
            <p className="text-sm text-slate-400 mt-1">{selectedComplaint?.student?.name} ({selectedComplaint?.student?.email})</p>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300">Status:</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-indigo-400 mt-1"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300">Your Reply:</label>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Type your response to this complaint..."
              className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-indigo-400 min-h-[100px] mt-1"
            />
          </div>
        </div>
      </Modal>
    </Layout>
  );
}

export default WardenComplaints;
