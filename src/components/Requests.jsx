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
    <div className="flex flex-col items-center my-10 ">
      <h1 className="font-bold text-white text-4xl mb-6">Connection Requests</h1>

      {requests.length === 0 ? (
        <div className="flex flex-col items-center bg-base-300 p-8 rounded-lg shadow-lg w-96">
          <FaRegSadTear className="text-6xl text-gray-500 mb-4" />
          <h2 className="text-xl text-gray-400 mb-2">No Connection Requests Yet</h2>
          <p className="text-gray-500 text-sm text-center mb-6">
            Stay active and explore more people to connect with!
          </p>
          <Link to="/">
            <button className="btn btn-primary px-6 py-2 text-lg rounded-lg">
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
                className="flex items-center bg-base-300 p-5 rounded-lg shadow-lg mb-5 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
              >
                {/* Profile Image */}
                <img
                  alt="Profile"
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-primary"
                  src={photoUrl || "https://via.placeholder.com/80"}
                />

                {/* User Details */}
                <div className="flex-1 text-left mx-4">
                  <h2 className="font-semibold text-lg md:text-xl text-white">
                    {firstName} {lastName}
                  </h2>
                  {age && gender && <p className="text-gray-300">{age}, {gender}</p>}
                  <p className="text-gray-400 text-sm md:text-base mt-1">{about || "No details available."}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    className="btn btn-error flex items-center gap-2 px-4 py-2"
                    onClick={() => reviewRequest("rejected", _id)}
                  >
                    <FaUserTimes /> Reject
                  </button>
                  <button
                    className="btn btn-success flex items-center gap-2 px-4 py-2"
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
