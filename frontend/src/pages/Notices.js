import { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { apiClient, getAuthHeader } from '../services/api';
import Card from '../components/ui/Card';

function Notices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get(apiClient.notices.all(), { headers: getAuthHeader() });
        setNotices(response.data?.data?.notices || []);
      } catch (err) {
        setError(err?.response?.data?.message || 'Unable to load notices.');
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <Card>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Notices</h1>
            <p className="text-sm text-gray-600 mt-1">Latest announcements for students and staff.</p>
          </div>
        </Card>

        <div className="grid gap-4">
          {loading && <Card><p className="text-gray-600">Loading notices...</p></Card>}
          {error && <Card className="bg-red-50 text-red-700"><p>{error}</p></Card>}
          {!loading && !error && notices.length === 0 && <Card><p className="text-gray-600">No notices available yet.</p></Card>}

          {!loading && notices.map((notice) => (
            <Card key={notice._id || notice.id} className="transition hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{notice.title}</h2>
                  <p className="text-sm text-gray-600">{new Date(notice.createdAt || notice.date || Date.now()).toLocaleDateString()}</p>
                </div>
                <span className="text-sm text-primary/700">Notice</span>
              </div>
              <p className="mt-3 text-gray-700 leading-7">{notice.message || notice.description || 'No details provided.'}</p>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default Notices;
