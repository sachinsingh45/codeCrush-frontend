import { BrowserRouter, Routes, Route } from "react-router-dom";
import Body from "./components/Body";
import Login from "./components/Login";
import Profile from "./components/Profile";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
// import Feed from "./components/Feed"; // Removed as Feed.jsx no longer exists
import Connections from "./components/Connections";
import Requests from "./components/Requests";
import Chat from "./components/Chat";
import BlogDetails from "./components/BlogDetails";
import CreateBlog from "./components/CreateBlog";
import EditBlog from "./components/EditBlog";
import TrendingBlogs from "./components/TrendingBlogs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DiscoverUsers from "./components/DiscoverUsers";
import UserProfile from "./components/UserProfile";
import BlogPage from "./components/BlogPage";
import LandingPage from "./components/LandingPage";

function App() {
  return (
    <>
      <Provider store={appStore}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Body />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/connections" element={<Connections />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/chat/:targetUserId" element={<Chat />} />
              <Route path="/blogs/:id" element={<BlogDetails />} />
              <Route path="/create-blog" element={<CreateBlog />} />
              <Route path="/edit-blog/:id" element={<EditBlog />} />
              <Route path="/trending" element={<TrendingBlogs />} />
              <Route path="/discover" element={<DiscoverUsers />} />
              <Route path="/users/:id" element={<UserProfile />} />
              <Route path="/blogs" element={<BlogPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} />
      </Provider>
    </>
  );
}

export default App;