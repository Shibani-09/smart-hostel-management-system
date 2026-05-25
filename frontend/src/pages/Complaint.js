import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { apiClient, getAuthHeader } from '../services/api';
import { useToast } from '../components/Toast';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

function Complaint() {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [page, setPage] = useState(1);
  const { showToast, Toast } = useToast();

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(apiClient.complaints.myComplaints() + `?page=${page}&limit=5`, {
        headers: getAuthHeader(),
      });
      setComplaints(response.data?.data?.complaints || response.data?.complaints || []);
    } catch (err) {
      showToast(err?.response?.data?.message || 'Unable to load complaints', 'error');
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
      showToast('Description is required', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const message = subject ? `${subject}: ${description}` : description;
      await axios.post(apiClient.complaints.create(), { message }, { headers: getAuthHeader() });
      showToast('Complaint submitted successfully', 'success');
      setDescription('');
      setSubject('');
      setPage(1);
      await fetchComplaints();
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to submit complaint', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComplaint = async (complaintId) => {
    if (!window.confirm('Are you sure you want to delete this complaint?')) return;
    try {
      await axios.delete(apiClient.complaints.delete(complaintId), { headers: getAuthHeader() });
      showToast('Complaint deleted successfully', 'success');
      fetchComplaints();
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to delete complaint', 'error');
    }
  };

  return (
    <Layout>
      {Toast}
      <div className="space-y-6">
        <Card>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Student Complaints</h1>
            <p className="text-sm text-gray-600 mt-1">Report issues and monitor your complaint history.</p>
          </div>

          <form onSubmit={submitComplaint} className="mt-6 grid gap-4 lg:grid-cols-2">
            <div>
              <label className="text-sm text-gray-600">Subject</label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Complaint subject" />
            </div>

            <div className="lg:col-span-2">
              <label className="text-sm text-gray-600">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell us what’s happening..."
                className="w-full min-h-[140px] p-3 rounded-xl border border-gray-200 mt-2"
              />
            </div>

            <div className="lg:col-span-2 flex items-center gap-3">
              <Button type="submit" variant="primary" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Complaint'}</Button>
            </div>
          </form>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900">Complaint History</h2>
          <p className="text-sm text-gray-600 mt-1">Recent complaint submissions and current status.</p>

          <div className="mt-4 space-y-3">
            {loading && <p className="text-gray-600">Loading complaints...</p>}
            {!loading && complaints.length === 0 && <p className="text-gray-600">No complaints found yet.</p>}

            {!loading && complaints.map((c) => (
              <div key={c._id || c.id} className="p-3 bg-gray-50 rounded-md flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-900">{c.message}</p>
                  <p className="text-sm text-gray-600">{new Date(c.createdAt || Date.now()).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-700">{c.status || 'Pending'}</span>
                  {c.status === 'pending' && (
                    <button onClick={() => handleDeleteComplaint(c._id || c.id)} className="text-sm text-red-600">Delete</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Layout>
  );
}

export default Complaint;
