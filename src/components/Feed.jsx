import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useEffect, useState } from "react";
import UserCard from "./UserCard";
import { IoReload } from "react-icons/io5";
import { MdPersonSearch } from "react-icons/md";
import { toast } from "react-toastify"; 

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const getFeed = async () => {
    if (loading) return; // Prevent multiple calls while loading
    setLoading(true);
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data?.data));
      if (!(res?.data?.data.length)) {
        toast.info("No new users found!", { autoClose: 3000 });
      }
    } catch (err) {
      toast.error(err?.message || "An error occurred", { autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    window.location.reload();  // Reload the page on button click
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (!feed) return null;

  if (feed.length <= 0) {
    return (
      <div className="flex flex-col items-center justify-center my-10 p-6 rounded-xl">
        <img
          src="/empty-feed.png"
          alt="No users found"
          className="w-52 h-52 mb-4 opacity-90"
        />
        <h1 className="text-2xl font-semibold text-base-content flex items-center gap-2">
          <MdPersonSearch className="text-3xl text-blue-500" />
          No new users found!
        </h1>
        <p className="text-base-content mb-4 text-center">
          It seems a bit quiet here... Try refreshing to see if there are new
          users!
        </p>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-700 text-white text-lg font-medium rounded-full shadow-md hover:scale-105 transition duration-300"
        >
          <IoReload className="text-xl" />
          Refresh Feed
        </button>
      </div>
    );
  }

  return (
    feed && (
      <div className="flex justify-center my-10">
        <UserCard user={feed[0]} />
      </div>
    )
  );
};

export default Feed;
