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
      <div className="flex flex-col items-center justify-center h-screen text-center text-base-content">
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
    <div className="text-center my-10 px-4 md:px-10">
      <h1 className="font-bold text-3xl text-base-content">Connections</h1>

      <div className="w-full flex flex-wrap justify-center gap-6 mt-6">
        {connections.map((connection) => {
          const { _id, firstName, lastName, photoUrl, age, gender, about } =
            connection || {};

          return (
            <div
              key={_id}
              className="flex flex-col sm:flex-row items-center p-4 rounded-lg bg-base-300 w-full sm:w-[90%] md:w-[60%] lg:w-[50%] xl:w-[40%] mx-auto shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] mb-4"
            >
              {/* Profile Image */}
              <img
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-primary"
                src={photoUrl || "https://via.placeholder.com/80"}
              />

              {/* User Details */}
              <div className="text-left mx-4 flex-1">
                <h2 className="font-bold text-xl text-base-content">
                  {firstName} {lastName}
                </h2>
                {age && gender && (
                  <p className="	text-base-content">
                    {age}, {gender}
                  </p>
                )}
                <p className="	text-base-content text-sm mt-1">
                  {about || "No details available."}
                </p>
              </div>

              {/* Chat Button */}
              <Link to={`/chat/${_id}`}>
                <button className="btn btn-primary">Chat</button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
