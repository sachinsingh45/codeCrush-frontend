import { Outlet, useNavigate, useLocation } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser, setLoading, setError, removeUser } from "../utils/userSlice";
import { useEffect } from "react";
import Spinner from "./Spinner";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: userData, loading, error } = useSelector((store) => store.user);
  const location = useLocation();

  const fetchUser = async () => {
    try {
      dispatch(setLoading(true));
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      dispatch(addUser(res.data));
    } catch (err) {
      // Only set error if it's not a 401 (unauthorized)
      if (err.response?.status !== 401) {
        dispatch(setError(err.message));
      } else {
        // For 401, just remove user without error
        dispatch(removeUser());
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size={48} />
      </div>
    );
  }

  // Show error message if there's an error
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-red-500 text-center text-lg mb-4">
          Connection Error: {error}
        </div>
        <button
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <div className="mt-16 min-h-[66vh]">
        <Outlet />
      </div>
      {!(location.pathname.startsWith("/chats") || location.pathname.startsWith("/chat")) && <Footer />}
    </div>
  );
};
export default Body;