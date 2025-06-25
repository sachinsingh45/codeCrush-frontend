import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import UserCard from "./UserCard";
import Spinner from "./Spinner";
import { useSelector } from "react-redux";

const DiscoverUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const loggedInUser = useSelector((store) => store.user);

  useEffect(() => {
    const fetchData = async () => {
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
    fetchData();
  }, []);

  const filteredUsers = (users || []).filter(user => user._id !== loggedInUser?._id);

  return (
    <div className="max-w-6xl mx-auto py-10 px-2 sm:px-4">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center tracking-tight text-primary drop-shadow-sm">Discover Developers</h1>
      {loading ? (
        <div className="flex flex-col items-center justify-center w-full min-h-[200px] py-10">
          <Spinner size={48} />
          <span className="mt-4 text-base-content text-lg font-semibold">Loading developers...</span>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center w-full min-h-[200px] py-10">
          <span className="text-red-500 text-lg font-semibold">{error}</span>
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full min-h-[200px] py-10">
          <img src="/empty-feed.png" alt="No users" className="w-28 h-28 opacity-70 mb-4" />
          <span className="text-gray-500 text-lg font-medium text-center">No new users found.</span>
        </div>
      ) : (
        <div className="flex flex-col gap-8 w-full">
          {filteredUsers.map((user) => (
            user ? <UserCard key={user._id} user={user} /> : null
          ))}
        </div>
      )}
    </div>
  );
};

export default DiscoverUsers; 