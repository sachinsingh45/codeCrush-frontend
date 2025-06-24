import { useSelector } from "react-redux";
import EditProfile from "./EditProfile";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";

const Profile = () => {
  const user = useSelector((store) => store.user);
  const [stats, setStats] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?._id) return;
    const fetchProfileData = async () => {
      setLoading(true);
      setError("");
      try {
        const [statsRes, blogsRes] = await Promise.all([
          axios.get(`${BASE_URL}/users/${user._id}/blog-stats`),
          axios.get(`${BASE_URL}/users/${user._id}/blogs`)
        ]);
        setStats(statsRes.data.data);
        setBlogs(blogsRes.data.data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load profile data");
        toast.error(err?.response?.data?.message || "Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [user]);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <EditProfile user={user} />
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Blog Stats</h2>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-lg p-4">
                <Skeleton height={32} width={48} className="mb-2" />
                <Skeleton height={16} width={80} />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : stats ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-100 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{stats.totalBlogs}</div>
              <div className="text-gray-700">Total Blogs</div>
            </div>
            <div className="bg-green-100 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{stats.totalLikes}</div>
              <div className="text-gray-700">Total Likes</div>
            </div>
            <div className="bg-yellow-100 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{stats.totalComments}</div>
              <div className="text-gray-700">Total Comments</div>
            </div>
            <div className="bg-purple-100 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{stats.totalShares}</div>
              <div className="text-gray-700">Total Shares</div>
            </div>
            <div className="bg-blue-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{stats.publishedBlogs}</div>
              <div className="text-gray-700">Published</div>
            </div>
            <div className="bg-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{stats.draftBlogs}</div>
              <div className="text-gray-700">Drafts</div>
            </div>
          </div>
        ) : null}
      </div>
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Your Blogs</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
                <Skeleton height={128} />
                <div className="p-5">
                  <Skeleton height={24} width={"80%"} className="mb-2" />
                  <div className="flex gap-2 mb-2">
                    <Skeleton width={40} height={20} />
                    <Skeleton width={40} height={20} />
                  </div>
                  <div className="flex gap-4 mb-2">
                    <Skeleton width={40} />
                    <Skeleton width={40} />
                    <Skeleton width={40} />
                    <Skeleton width={60} className="ml-auto" />
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <Skeleton width={48} height={32} />
                    <Skeleton width={48} height={32} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : blogs.length === 0 ? (
          <div className="text-gray-500">You haven't written any blogs yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogs.map((blog) => (
              <div key={blog._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {blog.featuredImage && (
                  <img src={blog.featuredImage} alt={blog.title} className="w-full h-32 object-cover" />
                )}
                <div className="p-5 flex flex-col h-full">
                  <h3 className="text-lg font-semibold mb-1 line-clamp-2">{blog.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {blog.tags.map((tag) => (
                      <span key={tag} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">#{tag}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                    <span>👍 {blog.likeCount || 0}</span>
                    <span>💬 {blog.commentCount || 0}</span>
                    <span>🔗 {blog.shareCount || 0}</span>
                    <span className="ml-auto">{blog.readTime} min read</span>
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <button
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                      onClick={() => navigate(`/edit-blog/${blog._id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
                      onClick={() => navigate(`/blogs/${blog._id}`)}
                    >
                      View
                    </button>
                    {/* Delete button can be added here */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default Profile;