import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { apiClient, getAuthHeader } from "../services/api";
import { Modal } from "../components/Modal";
import { useToast } from "../components/Toast";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "student" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState("all");
  const { showToast, Toast } = useToast();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        apiClient.admin.users(filter === "all" ? "" : filter, page, 10),
        { headers: getAuthHeader() }
      );
      setUsers(response.data?.data?.users || []);
      setTotalPages(response.data?.data?.pagination?.pages || 1);
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  }, [filter, page, showToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreateUser = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      showToast("All fields are required", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/admin/users`,
        formData,
        { headers: getAuthHeader() }
      );
      showToast("User created successfully", "success");
      setFormData({ name: "", email: "", password: "", role: "student" });
      setIsModalOpen(false);
      setPage(1);
      fetchUsers();
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to create user", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/admin/users/${userId}`,
        { headers: getAuthHeader() }
      );
      showToast("User deleted successfully", "success");
      fetchUsers();
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to delete user", "error");
    }
  };

  return (
    <Layout>
      {Toast}
      <div className="space-y-8">
        {/* Header */}
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-white">Manage Users</h1>
              <p className="mt-2 text-slate-400">Create, view, and manage system users</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-3xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:scale-[1.01] transition"
            >
              + Create User
            </button>
          </div>
        </div>

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          title="Create New User"
          onClose={() => {
            setIsModalOpen(false);
            setFormData({ name: "", email: "", password: "", role: "student" });
          }}
          actionButton={
            <button
              onClick={handleCreateUser}
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
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-2 text-sm text-white outline-none focus:border-indigo-400"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-2 text-sm text-white outline-none focus:border-indigo-400"
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-2 text-sm text-white outline-none focus:border-indigo-400"
            />
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-2 text-sm text-white outline-none focus:border-indigo-400"
            >
              <option value="student">Student</option>
              <option value="warden">Warden</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </Modal>

        {/* Filters */}
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
          <div className="flex gap-2 flex-wrap">
            {["all", "student", "warden", "admin"].map((role) => (
              <button
                key={role}
                onClick={() => { setFilter(role); setPage(1); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === role
                    ? "bg-indigo-500/20 text-indigo-200 border border-indigo-400/20"
                    : "border border-white/10 text-slate-400 hover:bg-slate-800"
                }`}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
          {loading ? (
            <div className="text-center py-8 text-slate-400">Loading...</div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-slate-400">No users found</div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-slate-950/50 p-4 hover:bg-slate-950/80 transition"
                >
                  <div className="flex-1">
                    <p className="font-medium text-white">{user.name}</p>
                    <p className="text-sm text-slate-400">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="inline-block rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-200 border border-indigo-400/20">
                      {user.role}
                    </span>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="text-rose-400 hover:text-rose-300 text-sm font-medium transition"
                    >
                      Delete
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
    </Layout>
  );
}

export default AdminUsers;
