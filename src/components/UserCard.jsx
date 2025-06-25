import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";

const UserCard = ({ user }) => {
  if (!user) return null;
  const { _id, firstName, lastName, photoUrl, age, gender, about, skills } = user;
  const safeSkills = Array.isArray(skills) ? skills : [];
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('unknown');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/user/relationship/${_id}`, { withCredentials: true });
        setStatus(res.data.status);
      } catch {
        setStatus('unknown');
      }
    };
    fetchStatus();
  }, [_id]);

  const handleSendRequest = async () => {
    setLoading(true);
    toast.dismiss();
    try {
      const res = await axios.post(`${BASE_URL}/request/send/${_id}`, {}, { withCredentials: true });
      setStatus('request_sent');
      dispatch(removeUserFromFeed(_id));
      if (res && res.data && res.data.message) {
        toast.success(res.data.message);
      } else {
        toast.success('Connection request sent!');
      }
    } catch (err) {
      console.error('Send request error:', err);
      const backendMsg = err?.response?.data?.message || err?.message;
      if (backendMsg) {
        toast.error(backendMsg);
      } else {
        toast.error('Failed to send connection request.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async () => {
    setLoading(true);
    try {
      toast.dismiss();
      await axios.delete(`${BASE_URL}/request/cancel/${_id}`, { withCredentials: true });
      setStatus('unknown');
      toast.success('Connection request cancelled.');
    } catch (err) {
      toast.dismiss();
      toast.error(err?.response?.data?.message || 'Failed to cancel connection request.');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewRequest = async (action) => {
    setLoading(true);
    try {
      toast.dismiss();
      // Find the requestId for this user
      const res = await axios.get(`${BASE_URL}/user/requests/received`, { withCredentials: true });
      const req = res.data.data.find(r => r.fromUserId._id === _id);
      if (!req) return;
      await axios.post(`${BASE_URL}/request/review/${action}/${req._id}`, {}, { withCredentials: true });
      setStatus('unknown');
      if (action === 'accept') {
        toast.success('Connection request accepted!');
      } else {
        toast.success('Connection request rejected.');
      }
    } catch (err) {
      toast.dismiss();
      toast.error('Failed to review connection request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.10)" }}
      whileTap={{ scale: 0.98 }}
      className="my-4 flex flex-col sm:flex-row mx-auto bg-white dark:bg-base-200 shadow-xl rounded-3xl overflow-hidden w-full max-w-2xl border border-blue-100 dark:border-blue-700 transition-all duration-300 hover:shadow-2xl hover:border-blue-300 group focus-within:ring-2 focus-within:ring-blue-400"
      tabIndex={0}
      aria-label={`User card for ${firstName} ${lastName}`}
      style={{ minHeight: '220px' }}
    >
      {/* Profile Picture */}
      <div className="w-full sm:w-2/5 flex justify-center items-center bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-base-300 dark:to-base-100 relative min-h-[180px] p-6 sm:p-0">
        <img
          src={photoUrl || "/default-avatar.png"}
          alt={`${firstName} ${lastName}`}
          className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-full border-4 border-white shadow bg-white transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Details */}
      <div className="w-full sm:w-3/5 p-4 sm:p-8 flex flex-col justify-between bg-base-100 dark:bg-base-200">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-base-content mb-2 tracking-tight text-center sm:text-left">
            <Link to={`/users/${_id}`} tabIndex={0} className="hover:underline focus:underline text-primary">{firstName} {lastName}</Link>
          </h2>
          {age && gender && (
            <p className="text-sm text-base-content font-medium mb-1 text-center sm:text-left">{age} • {gender}</p>
          )}
          <p className="text-base-content text-sm sm:text-base opacity-90 mt-1 leading-relaxed text-center sm:text-left">
            {about || <span className="italic text-gray-400 dark:text-gray-500">No details available.</span>}
          </p>

          {/* Skills */}
          {safeSkills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
              {safeSkills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs sm:text-sm font-semibold px-3 py-1 rounded-full shadow border border-blue-200 hover:scale-105 transition-transform cursor-pointer"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mt-6 justify-center sm:justify-start">
          {status === 'request_sent' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-yellow-400 text-white font-semibold rounded-full px-6 py-2 shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-yellow-400 cursor-pointer active:scale-95"
              onClick={handleCancelRequest}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Cancel Request'}
            </motion.button>
          )}
          {status === 'request_got' && (
            <div className="flex flex-row gap-3 w-full justify-center sm:justify-start">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-full px-6 py-2 shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer active:scale-95"
                onClick={() => handleReviewRequest('accept')}
                disabled={loading}
              >
                Accept
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-full px-6 py-2 shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-red-400 cursor-pointer active:scale-95"
                onClick={() => handleReviewRequest('reject')}
                disabled={loading}
              >
                Reject
              </motion.button>
            </div>
          )}
          {status === 'connection' && (
            <motion.button
              className="bg-green-500 text-white font-semibold rounded-full px-6 py-2 shadow-md cursor-default"
              disabled
            >
              Connected
            </motion.button>
          )}
          {status === 'unknown' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-full px-6 py-2 shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer active:scale-95"
              onClick={handleSendRequest}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Send Request'}
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gray-200 text-blue-700 font-semibold rounded-full px-4 py-1 text-sm shadow-md transition-all hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200 border-2 border-blue-200 cursor-pointer active:scale-95 flex items-center gap-2 mt-3 w-full sm:w-auto"
            style={{ minWidth: '120px' }}
            onClick={() => window.location.href = `/users/${_id}`}
            tabIndex={0}
            type="button"
            aria-label="View Details"
          >
            <FaEye className="inline-block text-base" /> View Details
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default UserCard;
