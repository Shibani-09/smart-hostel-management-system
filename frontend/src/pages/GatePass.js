import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { apiClient, getAuthHeader } from '../services/api';
import { useToast } from '../components/Toast';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

function GatePass() {
  const [name, setName] = useState('');
  const [reason, setReason] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gatePasses, setGatePasses] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { showToast, Toast } = useToast();

  const fetchGatePasses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(apiClient.gatepass.myPasses() + `?page=${page}&limit=5`, {
        headers: getAuthHeader(),
      });
      setGatePasses(response.data?.data?.passes || []);
      setTotalPages(response.data?.data?.pagination?.pages || 1);
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to fetch gate passes', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, showToast]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    setName(user.name || '');
    fetchGatePasses();
  }, [fetchGatePasses]);

  const submitGatepass = async (e) => {
    e.preventDefault();
    if (!reason || !date || !time) {
      showToast('All fields are required', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(apiClient.gatepass.request(), { reason, date, time }, { headers: getAuthHeader() });
      showToast('Gate pass request submitted successfully', 'success');
      setReason('');
      setDate('');
      setTime('');
      setPage(1);
      fetchGatePasses();
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to submit gate pass request', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (passId) => {
    if (!window.confirm('Are you sure you want to delete this gate pass?')) return;
    try {
      await axios.delete(apiClient.gatepass.delete(passId), { headers: getAuthHeader() });
      showToast('Gate pass deleted successfully', 'success');
      fetchGatePasses();
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to delete gate pass', 'error');
    }
  };

  return (
    <Layout>
      {Toast}
      <div className="space-y-6">
        <Card>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Gate Pass Request</h1>
            <p className="text-sm text-gray-600 mt-1">Complete the form to request permission to leave the campus.</p>
          </div>

          <form onSubmit={submitGatepass} className="mt-4 grid gap-4 lg:grid-cols-2">
            <div>
              <label className="text-sm text-grey-600">Student Name</label>
              <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
               placeholder="Enter Student Name"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Reason</label>
              <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason for leaving" />
            </div>

            <div>
              <label className="text-sm text-gray-600">Date</label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>

            <div>
              <label className="text-sm text-gray-600">Time</label>
              <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>

            <div className="lg:col-span-2">
              <Button type="submit" variant="primary" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Gate Pass'}</Button>
            </div>
          </form>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900">Your Gate Passes</h2>
          <p className="text-sm text-gray-600 mt-1">View and manage your gate pass requests</p>

          <div className="mt-4 space-y-3">
            {loading && <p className="text-gray-600">Loading...</p>}
            {!loading && gatePasses.length === 0 && <p className="text-gray-600">No gate passes found</p>}

            {!loading && gatePasses.map((pass) => (
              <div key={pass._id} className="p-3 bg-gray-50 rounded-md flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-900">{pass.reason}</p>
                  <p className="text-sm text-gray-600">📅 {new Date(pass.date).toLocaleDateString()} at {pass.time}</p>
                  {pass.remarks && <p className="text-sm text-gray-600">📝 Remarks: {pass.remarks}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-700">{pass.status}</span>
                  {pass.status === 'pending' && <button onClick={() => handleDelete(pass._id)} className="text-red-600">Delete</button>}
                </div>
              </div>
            ))}

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-3">
                <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1 rounded border">Previous</button>
                <span className="px-3 py-1">{page} / {totalPages}</span>
                <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="px-3 py-1 rounded border">Next</button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </Layout>
  );
}

export default GatePass;
