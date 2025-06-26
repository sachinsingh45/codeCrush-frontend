import { BrowserRouter, Routes, Route } from "react-router-dom";
import Body from "./components/Body";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Connections from "./components/Connections";
import Requests from "./components/Requests";
import Chat from "./components/Chat";
import BlogDetails from "./components/BlogDetails";
import CreateBlog from "./components/CreateBlog";
import EditBlog from "./components/EditBlog";
import TrendingBlogs from "./components/TrendingBlogs";
import DiscoverUsers from "./components/DiscoverUsers";
import UserProfile from "./components/UserProfile";
import BlogPage from "./components/BlogPage";
import LandingPage from "./components/LandingPage";
import CodeReviewPage from "./components/CodeReviewPage";
import CodeReviewDetails from "./components/CodeReviewDetails";
import { useSelector } from "react-redux";

function AppRoutes() {
  const user = useSelector((store) => store.user);
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<Body />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          {user && <>
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
            <Route path="/code-review" element={<CodeReviewPage />} />
            <Route path="/code-review/:id" element={<CodeReviewDetails />} />
          </>}
          {/* If not logged in, redirect all other routes to /login */}
          {!user && <Route path="*" element={<Login />} />}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes; 