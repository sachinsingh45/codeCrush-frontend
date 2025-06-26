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

  // Debug logging
  console.log('Body component render:', { userData, loading, error });

  const fetchUser = async () => {
    try {
      console.log('Fetching user...');
      dispatch(setLoading(true));
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      console.log('User fetch successful:', res.data);
      dispatch(addUser(res.data));
    } catch (err) {
      console.error("Authentication error:", err);
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
    console.log('Body useEffect triggered');
    fetchUser();
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  // Show loading spinner while checking authentication
  if (loading) {
    console.log('Showing loading spinner');
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size={48} />
      </div>
    );
  }

  // Show error message if there's an error
  if (error) {
    console.log('Showing error message:', error);
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

  console.log('Rendering main app content');
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