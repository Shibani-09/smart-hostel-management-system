import { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { apiClient, getAuthHeader } from '../services/api';

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const res = await axios.get(apiClient.rooms?.list?.() || '/api/rooms', { headers: getAuthHeader() });
        setRooms(res.data?.data?.rooms || res.data?.rooms || []);
      } catch (err) {
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const filtered = rooms.filter(r => r.number?.toString().includes(query) || r.type?.toLowerCase().includes(query.toLowerCase()));

  return (
    <Layout>
      <div className="space-y-6">
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Room Management</h1>
              <p className="text-sm text-gray-600 mt-1">View and manage hostel rooms and assignments.</p>
            </div>
            <div className="flex items-center gap-2">
              <Input placeholder="Search by room or type" value={query} onChange={(e) => setQuery(e.target.value)} />
              <Button variant="primary">Add Room</Button>
            </div>
          </div>
        </Card>

        <div className="grid gap-3">
          {loading && <Card><p className="text-gray-600">Loading rooms...</p></Card>}
          {!loading && filtered.length === 0 && <Card><p className="text-gray-600">No rooms found.</p></Card>}

          {!loading && filtered.map(room => (
            <Card key={room._id || room.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Room {room.number}</p>
                <p className="text-sm text-gray-600">{room.type || 'General'}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline">Edit</Button>
                <Button variant="ghost">View</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default Rooms;
