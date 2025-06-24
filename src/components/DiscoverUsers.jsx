import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import UserCard from "./UserCard";
import Spinner from "./Spinner";

const DiscoverUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const [usersRes, requestsRes] = await Promise.all([
          axios.get(`${BASE_URL}/feed`, { withCredentials: true }),
          axios.get(`${BASE_URL}/user/requests/received`, { withCredentials: true })
        ]);
        setUsers(usersRes.data.data);
        setPendingRequests(requestsRes.data.data.map(r => r.fromUserId._id));
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Discover Developers</h1>
      {loading ? (
        <div className="flex justify-center items-center w-full min-h-[200px]">
          <Spinner size={48} />
        </div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : users.length === 0 ? (
        <div className="text-gray-500">No new users found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {users.map((user) => (
            <UserCard key={user._id} user={user} hasSentRequest={pendingRequests.includes(user._id)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DiscoverUsers; 