import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { useEffect } from "react";
import { FaRegSadTear, FaUserPlus, FaUserTimes } from "react-icons/fa"; 
import { Link } from "react-router-dom";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();

  const reviewRequest = async (status, _id) => {
    try {
      await axios.post(
        `${BASE_URL}/request/review/${status}/${_id}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
    } catch (err) {
      console.error("Error reviewing request:", err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/requests/received`, {
        withCredentials: true,
      });
      dispatch(addRequests(res.data.data));
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return null;

  return (
    <div className="mt-20 flex flex-col items-center my-10 px-4">
      <h1 className="font-bold text-base-content text-3xl sm:text-4xl mb-6 text-center">
        Connection Requests
      </h1>

      {requests.length === 0 ? (
        <div className="flex flex-col items-center bg-base-300 p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md text-center">
          <FaRegSadTear className="text-5xl sm:text-6xl text-base-content mb-4" />
          <h2 className="text-lg sm:text-xl text-base-content mb-2">No Connection Requests Yet</h2>
          <p className="text-base-content text-sm sm:text-base mb-6">
            Stay active and explore more people to connect with!
          </p>
          <Link to="/">
            <button className="btn btn-primary px-4 sm:px-6 py-2 text-base sm:text-lg rounded-lg">
              Explore More
            </button>
          </Link>
        </div>
      ) : (
        <div className="w-full max-w-4xl">
          {requests.map(({ _id, fromUserId }) => {
            const { firstName, lastName, photoUrl, age, gender, about } = fromUserId;

            return (
              <div
                key={_id}
                className="flex flex-col sm:flex-row items-center bg-base-300 p-4 sm:p-5 rounded-lg shadow-lg mb-4 sm:mb-5 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] text-center sm:text-left"
              >
                {/* Profile Image */}
                <img
                  alt="Profile"
                  className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-primary"
                  src={photoUrl || "https://via.placeholder.com/80"}
                />

                {/* User Details */}
                <div className="flex-1 mx-4 mt-3 sm:mt-0">
                  <h2 className="font-semibold text-lg sm:text-xl text-base-content">
                    {firstName} {lastName}
                  </h2>
                  {age && gender && (
                    <p className="text-sm sm:text-base text-base-content">{age}, {gender}</p>
                  )}
                  <p className="text-xs sm:text-sm md:text-base text-base-content mt-1">
                    {about || "No details available."}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-3 sm:mt-0">
                  <button
                    className="btn btn-error flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base"
                    onClick={() => reviewRequest("rejected", _id)}
                  >
                    <FaUserTimes /> Reject
                  </button>
                  <button
                    className="btn btn-success flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base"
                    onClick={() => reviewRequest("accepted", _id)}
                  >
                    <FaUserPlus /> Accept
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Requests;
