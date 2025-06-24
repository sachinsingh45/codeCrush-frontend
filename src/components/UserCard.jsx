import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const UserCard = ({ user, hasSentRequest = false }) => {
  const { _id, firstName, lastName, photoUrl, age, gender, about, skills = [] } = user;
  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    try {
      await axios.post(
        `${BASE_URL}/request/send/${status}/${userId}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.error("Request failed:", err);
    }
  };

  const handleReviewRequest = async (status) => {
    // Accept or reject a received request
    try {
      // Find the requestId by fetching /user/requests/received (should be passed in future for optimization)
      // For now, just reload page after action
      const res = await axios.get(`${BASE_URL}/user/requests/received`, { withCredentials: true });
      const req = res.data.data.find(r => r.fromUserId._id === _id);
      if (!req) return;
      await axios.post(`${BASE_URL}/request/review/${status}/${req._id}`, {}, { withCredentials: true });
      window.location.reload();
    } catch (err) {
      console.error("Review request failed:", err);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)" }}
      whileTap={{ scale: 0.98 }}
      className="mt-10 flex flex-col lg:flex-row mx-4 lg:mx-auto bg-white dark:bg-base-200 shadow-xl rounded-3xl overflow-hidden w-full max-w-3xl border border-gray-200 dark:border-gray-700 transition-all duration-300"
    >
      {/* Profile Picture */}
      <div className="w-full lg:w-2/5 flex justify-center items-center bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-base-300 dark:to-base-100 relative">
        <img
          src={photoUrl}
          alt="User"
          className="w-full lg:h-full object-cover rounded-t-3xl lg:rounded-none lg:rounded-l-3xl transition-transform duration-300 transform hover:scale-105"
        />
        {hasSentRequest && (
          <span className="absolute top-3 left-3 bg-yellow-400 dark:bg-yellow-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow">Requested You</span>
        )}
      </div>

      {/* Details */}
      <div className="w-full lg:w-3/5 p-6 lg:p-10 flex flex-col justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-base-content mb-2 tracking-wide">
            <Link to={`/users/${_id}`}>{firstName} {lastName}</Link>
          </h2>
          {age && gender && (
            <p className="text-sm text-gray-500 dark:text-gray-400 opacity-70">{age} • {gender}</p>
          )}
          <p className="text-gray-700 dark:text-gray-300 text-sm opacity-80 mt-4 leading-relaxed">
            {about || "No details available."}
          </p>

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="badge bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-md"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mt-6">
          {hasSentRequest ? (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-success btn-wide transition-all shadow-md dark:btn-success dark:bg-green-700"
                onClick={() => handleReviewRequest("accepted")}
              >
                Accept
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-error btn-wide transition-all shadow-md dark:btn-error dark:bg-red-700"
                onClick={() => handleReviewRequest("rejected")}
              >
                Reject
              </motion.button>
            </>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-outline btn-wide border-2 transition-all dark:border-gray-500 dark:text-base-content"
                onClick={() => handleSendRequest("ignored", _id)}
              >
                Ignore
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary btn-wide transition-all shadow-md dark:btn-primary dark:bg-blue-700"
                onClick={() => handleSendRequest("interested", _id)}
              >
                Interested
              </motion.button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default UserCard;
