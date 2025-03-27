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
      whileHover={{ scale: 1.02, boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)" }}
      whileTap={{ scale: 0.98 }}
      className="flex flex-col lg:flex-row mx-4 lg:mx-auto bg-base-200 shadow-xl rounded-3xl overflow-hidden w-full max-w-3xl transition-all duration-300"
    >
      {/* Profile Picture */}
      <div className="w-full lg:w-2/5 flex justify-center items-center bg-gradient-to-br from-base-300 to-base-100 relative">
        <img
          src={photoUrl}
          alt="User"
          className="w-full lg:h-full object-cover rounded-t-3xl lg:rounded-none lg:rounded-l-3xl transition-transform duration-300 transform hover:scale-105"
        />
      </div>

      {/* Details */}
      <div className="w-full lg:w-3/5 p-6 lg:p-10 flex flex-col justify-between">
        <div>
          <h2 className="text-3xl font-bold text-base-content mb-2 tracking-wide">
            {firstName} {lastName}
          </h2>
          {age && gender && (
            <p className="text-sm text-base-content opacity-70">{age} • {gender}</p>
          )}
          <p className="text-base-content text-sm opacity-80 mt-4 leading-relaxed">
            {about || "No details available."}
          </p>

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="badge badge-primary bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-md"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-outline btn-wide border-2 transition-all"
            onClick={() => handleSendRequest("ignored", _id)}
          >
            Ignore
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary btn-wide transition-all shadow-md"
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
