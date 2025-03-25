import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import { motion } from "framer-motion";

const UserCard = ({ user }) => {
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

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="flex flex-col sm:flex-row bg-gradient-to-br from-white to-gray-400 shadow-lg rounded-xl overflow-hidden w-full max-w-xl transition-all duration-300"
    >
      {/* Profile Picture */}
      <div className="w-full sm:w-2/5 flex justify-center items-center bg-gray-200 relative">
        <img
          src={photoUrl}
          alt="User"
          className="w-full sm:h-full object-cover rounded-t-xl sm:rounded-none sm:rounded-l-xl transition-transform duration-300 transform hover:scale-105"
        />
      </div>

      {/* Details */}
      <div className="w-full sm:w-3/5 p-4 sm:p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-1">
            {firstName} {lastName}
          </h2>
          {age && gender && (
            <p className="text-gray-600 text-sm">{age} • {gender}</p>
          )}
          <p className="text-gray-500 mt-3 text-sm leading-relaxed">{about}</p>

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-indigo-100 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full shadow-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-start sm:justify-start">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2 text-sm font-semibold rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all shadow-md"
            onClick={() => handleSendRequest("ignored", _id)}
          >
            Ignore
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2 text-sm font-semibold rounded-md bg-indigo-500 text-white hover:bg-indigo-600 transition-all shadow-md"
            onClick={() => handleSendRequest("interested", _id)}
          >
            Interested
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default UserCard;
