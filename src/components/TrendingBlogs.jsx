import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import Spinner from "./Spinner";

const TrendingBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`${BASE_URL}/blogs/trending`);
        setBlogs(res.data.data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load trending blogs");
        toast.error(err?.response?.data?.message || "Failed to load trending blogs");
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  if (loading) return (
    <div className="max-w-5xl mx-auto py-10 px-4 flex flex-col items-center justify-center min-h-[300px]">
      <h1 className="text-3xl font-bold mb-8">Trending Blogs</h1>
      <div className="flex justify-center items-center w-full mt-10">
        <Spinner size={64} />
      </div>
    </div>
  );
  if (error) return <div className="flex justify-center mt-20 text-red-500">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Trending Blogs</h1>
      {blogs.length === 0 ? (
        <div className="text-gray-500">No trending blogs found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="group bg-white dark:bg-base-200 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden hover:scale-[1.03] hover:shadow-2xl transition-all cursor-pointer flex flex-col"
              onClick={() => navigate(`/blogs/${blog._id}`)}
            >
              {blog.featuredImage && (
                <img src={blog.featuredImage} alt={blog.title} className="w-full h-44 object-cover transition-transform group-hover:scale-105 duration-300" />
              )}
              <div className="p-4 sm:p-5 flex flex-col h-full">
                <div className="flex flex-wrap gap-2 mb-2">
                  {blog.tags.map((tag) => (
                    <span key={tag} className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-2 py-1 rounded text-xs font-semibold tracking-wide">#{tag}</span>
                  ))}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold mb-2 line-clamp-2 text-base-content">{blog.title}</h2>
                <p className="text-base-content text-sm sm:text-base mb-4 line-clamp-3">{blog.content.slice(0, 120)}...</p>
                <div className="flex items-center gap-3 mb-3">
                  <img src={blog.author.photoUrl} alt={blog.author.firstName} className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-blue-400 dark:border-blue-700" />
                  <span className="text-base font-medium text-base-content">{blog.author.firstName} {blog.author.lastName}</span>
                  <span className="text-xs text-neutral ml-auto">{new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-4 mt-auto text-sm text-neutral-content border-t border-base-200 dark:border-base-300 pt-3">
                  <span title="Engagement" className="flex items-center gap-1"><span role="img" aria-label="fire">🔥</span> {blog.engagementScore || 0}</span>
                  <span title="Likes" className="flex items-center gap-1"><span role="img" aria-label="like">👍</span> {blog.likeCount || 0}</span>
                  <span title="Comments" className="flex items-center gap-1"><span role="img" aria-label="comments">💬</span> {blog.commentCount || 0}</span>
                  <span title="Shares" className="flex items-center gap-1"><span role="img" aria-label="shares">🔗</span> {blog.shareCount || 0}</span>
                  <span className="ml-auto" title="Read time">⏱ {blog.readTime} min</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrendingBlogs; 