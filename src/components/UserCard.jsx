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
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col sm:flex-row bg-white rounded-xl shadow-lg w-full max-w-xl overflow-hidden transition-all duration-300"
    >
      {/* Left Side - Profile Picture (Full height and rectangular, no border) */}
      <div className="w-full sm:w-2/5 h-64 sm:h-full flex justify-center items-center bg-gray-100 overflow-hidden relative">
        <img
          src={photoUrl}
          alt="User"
          className="w-full h-full object-cover transition-transform duration-300 transform hover:scale-110"
        />
      </div>

      {/* Right Side - Details */}
      <div className="w-full sm:w-3/5 p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {firstName} {lastName}
          </h2>
          {age && gender && (
            <p className="text-gray-600 text-sm">{age} • {gender}</p>
          )}
          <p className="text-gray-500 mt-2 text-sm">{about}</p>

          {/* Skills Section */}
          {skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span key={index} className="bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6 justify-start">
          <button
            className="px-4 py-2 text-sm font-semibold rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all"
            onClick={() => handleSendRequest("ignored", _id)}
          >
            Ignore
          </button>
          <button
            className="px-4 py-2 text-sm font-semibold rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-all"
            onClick={() => handleSendRequest("interested", _id)}
          >
            Interested
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default UserCard;
