import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/conectionSlice";
import { Link } from "react-router-dom";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();

  const fetchConnections = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/connections`, {
        withCredentials: true,
      });

      if (res.data && res.data.data) {
        dispatch(addConnections(res.data.data));
      } else {
        console.error("Invalid API response structure:", res.data);
      }
    } catch (err) {
      console.error("API Error:", err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections)
    return <h1 className="text-center text-base-content">Loading...</h1>;

  if (connections.length === 0)
    return (
      <div className="mt-20 flex flex-col items-center justify-center h-screen text-center text-base-content">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4076/4076581.png"
          alt="No Connections"
          className="w-48 h-48 mb-6 opacity-90"
        />
        <h1 className="text-3xl font-semibold mb-2">No Connections Yet!</h1>
        <p className="	text-base-content mb-6">
          Start exploring and connect with amazing people.
        </p>
        <Link to="/">
          <button className="btn btn-primary px-6 py-2 rounded-lg text-lg shadow-lg hover:scale-105 transition">
            Explore Now
          </button>
        </Link>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto my-10 px-2 sm:px-4 md:px-10">
      <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl text-primary mb-6 sm:mb-8 text-center tracking-tight">Connections</h1>
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {connections.map((connection) => {
          const { _id, firstName, lastName, photoUrl, age, gender, about } = connection || {};
          return (
            <div
              key={_id}
              className="group bg-base-100 dark:bg-base-200 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.03] transition-all cursor-pointer flex flex-col items-center p-4 sm:p-6 relative overflow-hidden min-h-[320px] sm:min-h-[340px] w-full"
              onClick={() => window.location.href = `/users/${_id}`}
              tabIndex={0}
              role="button"
              aria-label={`View profile of ${firstName} ${lastName}`}
            >
              <img
                alt="Profile"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-primary shadow mb-3 sm:mb-4 group-hover:scale-105 transition-transform duration-300"
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
                  className="btn btn-primary btn-xs sm:btn-sm rounded-full px-3 sm:px-4 font-semibold shadow-md hover:scale-105 transition"
                  onClick={e => { e.stopPropagation(); window.location.href = `/chat/${_id}`; }}
                >
                  Chat
                </button>
                <button
                  className="btn btn-outline btn-xs sm:btn-sm rounded-full px-3 sm:px-4 font-semibold shadow-md hover:scale-105 transition"
                  onClick={e => { e.stopPropagation(); window.location.href = `/users/${_id}`; }}
                >
                  View Profile
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
