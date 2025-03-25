import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Logout handler
  const handleLogout = async () => {
    try {
      // Send logout request to the backend
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      // Remove user from the state
      dispatch(removeUser());
      // Navigate to the login page
      navigate("/login");
    } catch (err) {
      // Handle any error (e.g., network issue)
      console.error("Logout error:", err);
    }
  };

  return (
    <div className="navbar fixed top-0 left-0 right-0 z-10 glass  py-2">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          <div className="flex items-center">
            <div className="w-6 mx-2">
              <img alt="user photo" src="/logo.png" className="w-full" />
            </div>
            CodeCrush
          </div>
        </Link>
      </div>

      {user && (
        <div className="flex items-center gap-1">
          <div className="hidden sm:block form-control">Welcome, {user.firstName}</div>
          <div className="dropdown dropdown-end mx-5 flex">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 border border-indigo-600 rounded-full">
                <img alt="user photo" src={user.photoUrl} />
              </div>
            </div>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to="/profile" className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </Link>
              </li>
              <li>
                <Link to="/connections">Connections</Link>
              </li>
              <li>
                <Link to="/requests">Requests</Link>
              </li>
              {/* <li>
                <Link to="/premium">Premium</Link>
              </li> */}
              <li>
                <a onClick={handleLogout}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;
