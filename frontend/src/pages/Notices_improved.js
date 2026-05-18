import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { apiClient, getAuthHeader } from "../services/api";
import { Modal } from "../components/Modal";
import { useToast } from "../components/Toast";

function Notices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", message: "" });
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast, showToast, Toast } = useToast();

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const isAdmin = user.role === "admin";
  const isWarden = user.role === "warden";

  useEffect(() => {
    fetchNotices();
  }, [page]);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${apiClient.notices.all()}?page=${page}&limit=10`,
        { headers: getAuthHeader() }
      );
      setNotices(response.data?.data?.notices || []);
      setTotalPages(response.data?.data?.pagination?.pages || 1);
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to fetch notices", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNotice = async () => {
    if (!formData.title || !formData.message) {
      showToast("Title and message are required", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(
        apiClient.notices.create(),
        formData,
        { headers: getAuthHeader() }
      );
      showToast("Notice created successfully", "success");
      setFormData({ title: "", message: "" });
      setIsCreateModalOpen(false);
      setPage(1);
      fetchNotices();
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to create notice", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateNotice = async () => {
    if (!selectedNotice || !formData.title || !formData.message) {
      showToast("Title and message are required", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.put(
        `http://localhost:5000/api/notices/${selectedNotice._id}`,
        formData,
        { headers: getAuthHeader() }
      );
      showToast("Notice updated successfully", "success");
      setFormData({ title: "", message: "" });
      setIsEditModalOpen(false);
      setSelectedNotice(null);
      fetchNotices();
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to update notice", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteNotice = async (noticeId) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) return;

    try {
      await axios.delete(
        `${apiClient.notices.delete(noticeId)}`,
        { headers: getAuthHeader() }
      );
      showToast("Notice deleted successfully", "success");
      fetchNotices();
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to delete notice", "error");
    }
  };

  const openEditModal = (notice) => {
    setSelectedNotice(notice);
    setFormData({ title: notice.title, message: notice.message });
    setIsEditModalOpen(true);
  };

  return (
    <Layout>
      {Toast}
      <div className="space-y-8">
        {/* Header */}
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-white">
                {isAdmin || isWarden ? "Manage Notices" : "Notices"}
              </h1>
              <p className="mt-2 text-slate-400">
                {isAdmin || isWarden
                  ? "Create and manage hostel notices"
                  : "Read important hostel announcements"}
              </p>
            </div>
            {(isAdmin || isWarden) && (
              <button
                onClick={() => {
                  setFormData({ title: "", message: "" });
                  setSelectedNotice(null);
                  setIsCreateModalOpen(true);
                }}
                className="rounded-3xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:scale-[1.01] transition"
              >
                + Create Notice
              </button>
            )}
          </div>
        </div>

        {/* Create Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          title="Create New Notice"
          onClose={() => {
            setIsCreateModalOpen(false);
            setFormData({ title: "", message: "" });
          }}
          actionButton={
            <button
              onClick={handleCreateNotice}
              disabled={isSubmitting}
              className="flex-1 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600 transition disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create"}
            </button>
          }
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Notice Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-2 text-sm text-white outline-none focus:border-indigo-400"
            />
            <textarea
              placeholder="Notice Message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-2 text-sm text-white outline-none focus:border-indigo-400 min-h-[150px]"
            />
          </div>
        </Modal>

        {/* Edit Modal */}
        <Modal
          isOpen={isEditModalOpen}
          title="Edit Notice"
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedNotice(null);
            setFormData({ title: "", message: "" });
          }}
          actionButton={
            <button
              onClick={handleUpdateNotice}
              disabled={isSubmitting}
              className="flex-1 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600 transition disabled:opacity-50"
            >
              {isSubmitting ? "Updating..." : "Update"}
            </button>
          }
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Notice Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-2 text-sm text-white outline-none focus:border-indigo-400"
            />
            <textarea
              placeholder="Notice Message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-2 text-sm text-white outline-none focus:border-indigo-400 min-h-[150px]"
            />
          </div>
        </Modal>

        {/* Notices List */}
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
          {loading ? (
            <div className="text-center py-8 text-slate-400">Loading...</div>
          ) : notices.length === 0 ? (
            <div className="text-center py-8 text-slate-400">No notices found</div>
          ) : (
            <div className="space-y-4">
              {notices.map((notice) => (
                <div
                  key={notice._id}
                  className="rounded-lg border border-white/10 bg-slate-950/50 p-4 hover:bg-slate-950/80 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-white mb-2">{notice.title}</h3>
                      <p className="text-sm text-slate-300 mb-3">{notice.message}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>📅 {new Date(notice.createdAt).toLocaleDateString()}</span>
                        <span>👤 {notice.createdBy?.name}</span>
                      </div>
                    </div>
                    {(isAdmin || (isWarden && notice.createdBy?._id === user.id)) && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(notice)}
                          className="px-3 py-2 rounded-lg bg-indigo-500/10 text-indigo-200 border border-indigo-400/20 hover:bg-indigo-500/20 text-sm font-medium transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteNotice(notice._id)}
                          className="px-3 py-2 rounded-lg bg-rose-500/10 text-rose-200 border border-rose-400/20 hover:bg-rose-500/20 text-sm font-medium transition"
                        >
                          Delete
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
    </Layout>
  );
}

export default Notices;
