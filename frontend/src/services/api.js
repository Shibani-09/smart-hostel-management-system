const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const apiClient = {
  auth: {
    register: () => `${API_BASE_URL}/auth/register`,
    login: () => `${API_BASE_URL}/auth/login`,
    profile: () => `${API_BASE_URL}/auth/profile`,
  },

  admin: {
    users: (role = "", page = 1, limit = 10) =>
      `${API_BASE_URL}/admin/users${role ? `?role=${role}&page=${page}&limit=${limit}` : `?page=${page}&limit=${limit}`}`,
    stats: () => `${API_BASE_URL}/admin/stats`,
  },

  gatepass: {
    request: () => `${API_BASE_URL}/gatepass/request`,
    all: () => `${API_BASE_URL}/gatepass/all`,
    myPasses: () => `${API_BASE_URL}/gatepass/my-passes`,
    update: (id) => `${API_BASE_URL}/gatepass/update/${id}`,
    delete: (id) => `${API_BASE_URL}/gatepass/${id}`,
  },

  notices: {
    create: () => `${API_BASE_URL}/notices/create`,
    all: () => `${API_BASE_URL}/notices/all`,
    delete: (id) => `${API_BASE_URL}/notices/${id}`,
  },

  complaints: {
    create: () => `${API_BASE_URL}/complaints/create`,
    all: () => `${API_BASE_URL}/complaints/all`,
    myComplaints: () => `${API_BASE_URL}/complaints/my-complaints`,
    update: (id) => `${API_BASE_URL}/complaints/update/${id}`,
    delete: (id) => `${API_BASE_URL}/complaints/${id}`,
  },
};

export const getAuthHeader = () => {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
};