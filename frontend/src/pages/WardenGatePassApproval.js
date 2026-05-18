import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { apiClient, getAuthHeader } from "../services/api";
import { StatusBadge } from "../components/Table";
import { Modal } from "../components/Modal";
import { useToast } from "../components/Toast";

function WardenGatePassApproval() {
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("pending");
  const [selectedPass, setSelectedPass] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [action, setAction] = useState("approve"); // approve or reject
  const [remarks, setRemarks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast, Toast } = useToast();

  const fetchGatePasses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${apiClient.gatepass.all()}?status=${filter === "all" ? "" : filter}&page=${page}&limit=10`,
        { headers: getAuthHeader() }
      );
      setPasses(response.data?.data?.passes || []);
      setTotalPages(response.data?.data?.pagination?.pages || 1);
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to fetch gate passes", "error");
    } finally {
      setLoading(false);
    }
  }, [filter, page, showToast]);

  useEffect(() => {
    fetchGatePasses();
  }, [fetchGatePasses]);

  const handleUpdatePass = async () => {
    if (!selectedPass) return;

    setIsSubmitting(true);
    try {
      const status = action === "approve" ? "approved" : "rejected";
      await axios.put(
        `${apiClient.gatepass.update(selectedPass._id)}`,
        {
          status,
          remarks: remarks || undefined
        },
        { headers: getAuthHeader() }
      );
      showToast(`Gate pass ${status} successfully`, "success");
      setIsModalOpen(false);
      setRemarks("");
      setSelectedPass(null);
      fetchGatePasses();
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to update gate pass", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openModal = (pass, actionType) => {
    setSelectedPass(pass);
    setAction(actionType);
    setRemarks("");
    setIsModalOpen(true);
  };

  return (
    <Layout>
      {Toast}
      <div className="space-y-8">
        {/* Header */}
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
          <div>
            <h1 className="text-3xl font-semibold text-white">Gate Pass Approvals</h1>
            <p className="mt-2 text-slate-400">Review and approve/reject student gate pass requests</p>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
          <div className="flex gap-2 flex-wrap">
            {["pending", "approved", "rejected", "all"].map((status) => (
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

        {/* Gate Passes List */}
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
          {loading ? (
            <div className="text-center py-8 text-slate-400">Loading...</div>
          ) : passes.length === 0 ? (
            <div className="text-center py-8 text-slate-400">No gate passes found</div>
          ) : (
            <div className="space-y-4">
              {passes.map((pass) => (
                <div
                  key={pass._id}
                  className="rounded-lg border border-white/10 bg-slate-950/50 p-4 hover:bg-slate-950/80 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-white">
                          {pass.student?.name || "Unknown"}
                        </h3>
                        <StatusBadge status={pass.status} />
                      </div>
                      <p className="text-sm text-slate-400">
                        <strong>Reason:</strong> {pass.reason}
                      </p>
                      <p className="text-sm text-slate-400">
                        📅 {new Date(pass.date).toLocaleDateString()} at {pass.time}
                      </p>
                      <p className="text-xs text-slate-500">
                        📧 {pass.student?.email}
                      </p>
                      {pass.remarks && (
                        <p className="text-sm text-slate-300 mt-2">
                          <strong>Remarks:</strong> {pass.remarks}
                        </p>
                      )}
                    </div>
                    {pass.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => openModal(pass, "approve")}
                          className="px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-200 border border-emerald-400/20 hover:bg-emerald-500/20 text-sm font-medium transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => openModal(pass, "reject")}
                          className="px-3 py-2 rounded-lg bg-rose-500/10 text-rose-200 border border-rose-400/20 hover:bg-rose-500/20 text-sm font-medium transition"
                        >
                          Reject
                        </button>
                      </div>
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

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        title={`${action === "approve" ? "Approve" : "Reject"} Gate Pass`}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPass(null);
          setRemarks("");
        }}
        actionButton={
          <button
            onClick={handleUpdatePass}
            disabled={isSubmitting}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium text-white transition disabled:opacity-50 ${
              action === "approve"
                ? "bg-emerald-500 hover:bg-emerald-600"
                : "bg-rose-500 hover:bg-rose-600"
            }`}
          >
            {isSubmitting ? "Processing..." : action === "approve" ? "Approve" : "Reject"}
          </button>
        }
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-400">
              <strong>Student:</strong> {selectedPass?.student?.name}
            </p>
            <p className="text-sm text-slate-400">
              <strong>Reason:</strong> {selectedPass?.reason}
            </p>
            <p className="text-sm text-slate-400">
              <strong>Date:</strong> {selectedPass && new Date(selectedPass.date).toLocaleDateString()} at {selectedPass?.time}
            </p>
          </div>
          <textarea
            placeholder="Add remarks or reason for rejection..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-2 text-sm text-white outline-none focus:border-indigo-400 min-h-[100px]"
          />
        </div>
      </Modal>
    </Layout>
  );
}

export default WardenGatePassApproval;
