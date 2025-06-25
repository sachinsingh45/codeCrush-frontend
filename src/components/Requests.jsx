import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { useEffect } from "react";
import { FaRegSadTear, FaUserPlus, FaUserTimes } from "react-icons/fa"; 
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reviewRequest = async (status, _id) => {
    try {
      const action = status === 'accepted' ? 'accept' : status === 'rejected' ? 'reject' : status;
      const res = await axios.post(
        `${BASE_URL}/request/review/${action}/${_id}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
      toast.success(res.data.message || `Request ${action}ed!`);
      fetchRequests();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to review request.');
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
    <div className="mt-20 flex flex-col items-center my-10 px-2 sm:px-4">
      <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl text-primary mb-8 text-center tracking-tight">
        Connection Requests
      </h1>

      {requests.length === 0 ? (
        <div className="flex flex-col items-center bg-base-100 dark:bg-base-200 p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
          <FaRegSadTear className="text-5xl sm:text-6xl text-base-content mb-4" />
          <h2 className="text-lg sm:text-xl text-base-content mb-2">No Connection Requests Yet</h2>
          <p className="text-base-content text-sm sm:text-base mb-6">
            Stay active and explore more people to connect with!
          </p>
          <Link to="/">
            <button className="btn btn-primary px-4 sm:px-6 py-2 text-base sm:text-lg rounded-full shadow-md hover:scale-105 transition">
              Explore More
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {requests.map(({ _id, fromUserId }) => {
            const { firstName, lastName, photoUrl, age, gender, about } = fromUserId;

            return (
              <div
                key={_id}
                className="group bg-base-100 dark:bg-base-200 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.03] transition-all cursor-pointer flex flex-col items-center p-4 sm:p-6 relative overflow-hidden min-h-[320px] sm:min-h-[340px] w-full"
                onClick={() => navigate(`/users/${fromUserId._id}`)}
                tabIndex={0}
                role="button"
                aria-label={`View profile of ${firstName} ${lastName}`}
              >
                <img
                  alt="Profile"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-primary shadow mb-3 group-hover:scale-105 transition-transform duration-300"
                  src={photoUrl || "https://via.placeholder.com/80"}
                />
                <h2 className="font-bold text-lg sm:text-xl text-base-content mb-1 text-center group-hover:text-primary transition-colors duration-200">
                  {firstName} {lastName}
                </h2>
                {age && gender && (
                  <p className="text-base-content text-xs sm:text-sm mb-1">{age} • {gender}</p>
                )}
                <p className="text-base-content text-xs sm:text-sm mb-3 text-center line-clamp-2 min-h-[2.5em]">{about || "No details available."}</p>
                <div className="flex flex-col sm:flex-row justify-center gap-2 mt-auto w-full">
                  <button
                    className="btn btn-error btn-xs sm:btn-sm rounded-full px-3 sm:px-4 font-semibold shadow-md hover:scale-105 transition"
                    onClick={e => { e.stopPropagation(); reviewRequest("rejected", _id); }}
                  >
                    <FaUserTimes /> Reject
                  </button>
                  <button
                    className="btn btn-success btn-xs sm:btn-sm rounded-full px-3 sm:px-4 font-semibold shadow-md hover:scale-105 transition"
                    onClick={e => { e.stopPropagation(); reviewRequest("accepted", _id); }}
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
