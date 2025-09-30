import { useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import UserCard from "./UserCard";
import Spinner from "./Spinner";
import { useSelector, useDispatch } from "react-redux";
import { addFeed, setFeedLoading, setFeedError } from "../utils/feedSlice";
import { toast } from "react-hot-toast";

const DiscoverUsers = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((store) => store.feed);
  const loggedInUser = useSelector((store) => store.user.user);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setFeedLoading(true));
      try {
        const res = await axios.get(`${BASE_URL}/feed`, { withCredentials: true });
        dispatch(addFeed(res.data.data));
      } catch (err) {
        const errorMessage = err?.response?.data?.message || "Failed to load users";
        dispatch(setFeedError(errorMessage));
        toast.error(err.message || 'An error occurred');
      }
    };
    fetchData();
  }, [dispatch]);

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