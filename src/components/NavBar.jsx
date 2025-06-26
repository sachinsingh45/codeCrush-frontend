import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { useEffect, useState, useRef } from "react";
import { FaUser, FaComments, FaUserFriends, FaUserPlus, FaSun, FaMoon, FaSearch, FaBars, FaSignOutAlt, FaHome } from "react-icons/fa";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState("abyss");
  const [menuOpen, setMenuOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const navMenuRef = useRef(null);

  // Theme toggle handler
  const toggleTheme = () => {
    const newTheme = theme === "abyss" ? "lemonade" : "abyss";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Logout handler
  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Helper for active link
  const isActive = (path) => location.pathname === path;

  // Close burger menu on outside click
  // useEffect(() => {
  //   if (!navOpen) return;
  //   function handleClickOutside(event) {
  //     if (navMenuRef.current && !navMenuRef.current.contains(event.target)) {
  //       setNavOpen(false);
  //     }
  //   }
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, [navOpen]);

  return (
    <nav className="navbar fixed top-0 left-0 right-0 z-40 glass py-2 px-2 md:px-8 shadow-lg border-b border-base-200 flex items-center justify-between">
      {/* Left: Logo */}
      <div className="flex items-center gap-2 min-w-0">
        <Link to="/" className="flex items-center gap-2 btn btn-ghost text-2xl font-extrabold tracking-tight px-2" aria-label="Home">
          <img alt="CodeCrush logo" src="/logo.png" className="w-8 h-8" />
          <span className="hidden sm:inline-block">CodeCrush</span>
        </Link>
      </div>
      {/* Center: Spacer (for future use or centering) */}
      <div className="flex-1" />
      {/* Right: Actions */}
      {user ? (
        <div className="flex items-center gap-1 sm:gap-2 relative z-40">
          {/* Theme toggle */}
          <button
            className="btn btn-ghost btn-circle swap swap-rotate mx-1"
            aria-label="Toggle Theme"
            onClick={toggleTheme}
          >
            <input type="checkbox" checked={theme === "abyss"} readOnly />
            <FaSun className="swap-off h-6 w-6 text-yellow-400" />
            <FaMoon className="swap-on h-6 w-6 text-blue-500" />
          </button>

          {/* Home button (next to burger) */}
          <Link
            to="/"
            className="btn btn-ghost btn-circle mx-1 flex items-center justify-center"
            aria-label="Home"
          >
            <FaHome className="h-6 w-6" />
          </Link>

          {/* Burger menu for navigation (button only here) */}
          <button
            className={`btn btn-ghost btn-circle mx-1 flex items-center justify-center transition-transform duration-200 ${navOpen ? 'bg-primary/10 scale-110' : ''}`}
            aria-label={navOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setNavOpen((open) => !open)}
            tabIndex={0}
            type="button"
          >
            {/* Modern animated burger/close icon */}
            <span className="relative w-7 h-7 flex flex-col items-center justify-center">
              <span
                className={`block absolute h-0.5 w-7 bg-base-content rounded transition-all duration-300 ease-in-out ${navOpen ? 'rotate-45 top-3.5' : 'top-2'}`}
              ></span>
              <span
                className={`block absolute h-0.5 w-7 bg-base-content rounded transition-all duration-300 ease-in-out ${navOpen ? 'opacity-0 left-4' : 'top-3.5'}`}
              ></span>
              <span
                className={`block absolute h-0.5 w-7 bg-base-content rounded transition-all duration-300 ease-in-out ${navOpen ? '-rotate-45 top-3.5' : 'top-5'}`}
              ></span>
            </span>
          </button>

          {/* Avatar dropdown for profile/signout only */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar focus:outline-none focus:ring-2 focus:ring-primary">
              <div className="w-10 border-2 border-primary rounded-full overflow-hidden shadow">
                <img alt="user avatar" src={user.photoUrl} />
              </div>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[60] mt-3 w-44 p-2 shadow-lg border border-base-200">
              <li>
                <Link to="/profile" className="flex items-center gap-2 font-semibold text-base-content hover:bg-primary hover:text-primary-content rounded-lg transition">
                  <FaUser className="text-base" />
                  Show Profile
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="flex items-center gap-2 font-semibold text-error hover:bg-error hover:text-white rounded-lg transition">
                  <FaSignOutAlt className="text-base" />
                  Sign Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <button
            className="btn btn-primary btn-md rounded-full px-6 font-semibold shadow-md"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        </div>
      )}
      {/* Burger menu dropdown rendered outside the flex row for proper stacking and no layout shift */}
      {user && navOpen && (
        <div ref={navMenuRef} className="fixed right-4 top-16 w-56 bg-base-100 rounded-xl shadow-lg border border-base-200 z-50 animate-fade-in flex flex-col p-4 gap-2">
          <Link to="/discover" onClick={() => setNavOpen(false)} className="btn btn-secondary btn-sm w-full rounded-full flex items-center gap-2 justify-start">
            <FaSearch className="text-lg" />
            Find Friends
          </Link>
          <Link to="/blogs" onClick={() => setNavOpen(false)} className="btn btn-ghost btn-sm w-full flex items-center gap-2 justify-start">
            <svg className="text-base" width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 19.5V6.75C4 5.23122 5.23122 4 6.75 4H17.25C18.7688 4 20 5.23122 20 6.75V19.5M4 19.5C4 20.3284 4.67157 21 5.5 21H18.5C19.3284 21 20 20.3284 20 19.5M4 19.5V17.25C4 15.7312 5.23122 14.5 6.75 14.5H17.25C18.7688 14.5 20 15.7312 20 17.25V19.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Blogs
          </Link>
          <Link to="/code-review" onClick={() => setNavOpen(false)} className="btn btn-ghost btn-sm w-full flex items-center gap-2 justify-start">
            <span className="text-base">📝</span>
            Code Review
          </Link>
          <Link to="/chat" onClick={() => setNavOpen(false)} className="btn btn-ghost btn-sm w-full flex items-center gap-2 justify-start">
            <FaComments className="text-base" />
            Inbox
          </Link>
          <Link to="/connections" onClick={() => setNavOpen(false)} className="btn btn-ghost btn-sm w-full flex items-center gap-2 justify-start">
            <FaUserFriends className="text-base" />
            Connections
          </Link>
          <Link to="/requests" onClick={() => setNavOpen(false)} className="btn btn-ghost btn-sm w-full flex items-center gap-2 justify-start">
            <FaUserPlus className="text-base" />
            Requests
          </Link>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
