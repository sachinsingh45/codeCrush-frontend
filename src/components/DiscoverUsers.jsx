import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const DiscoverUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`${BASE_URL}/feed`, { withCredentials: true });
        setUsers(res.data.data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Discover Developers</h1>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-6">
              <Skeleton height={32} width={120} className="mb-2" />
              <Skeleton height={20} width={80} className="mb-2" />
              <Skeleton count={2} height={16} className="mb-2" />
              <Skeleton width={80} height={32} />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : users.length === 0 ? (
        <div className="text-gray-500">No new users found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {users.map((user) => (
            <div key={user._id} className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
              <img src={user.photoUrl} alt={user.firstName} className="w-16 h-16 rounded-full mb-2 object-cover" />
              <h2 className="text-lg font-semibold mb-1">{user.firstName} {user.lastName}</h2>
              <p className="text-gray-600 text-sm mb-1">{user.about || "No bio available."}</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {user.skills && user.skills.map((skill, idx) => (
                  <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">{skill}</span>
                ))}
              </div>
              {/* You can add a button to send a connection request here if needed */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiscoverUsers; 