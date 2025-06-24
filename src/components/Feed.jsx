import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Feed = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchBlogs = async (pageNum = 1) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${BASE_URL}/blogs`, {
        params: { page: pageNum, limit: 6 },
      });
      setBlogs(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(page);
  }, [page]);

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-8">Latest Blogs</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
              <Skeleton height={160} />
              <div className="p-5">
                <Skeleton height={24} width={"80%"} className="mb-2" />
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton circle width={32} height={32} />
                  <Skeleton width={80} />
                  <Skeleton width={60} className="ml-auto" />
                </div>
                <Skeleton count={2} height={14} className="mb-3" />
                <div className="flex gap-2 mb-3">
                  <Skeleton width={40} height={20} />
                  <Skeleton width={40} height={20} />
                </div>
                <div className="flex gap-4 mt-auto">
                  <Skeleton width={40} />
                  <Skeleton width={40} />
                  <Skeleton width={40} />
                  <Skeleton width={60} className="ml-auto" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="flex justify-center mt-20 text-red-500">{error}</div>;
  }

  if (!blogs.length) {
    return (
      <div className="mt-20 flex flex-col items-center justify-center mb-10 p-6 rounded-xl">
        <img
          src="/empty-feed.png"
          alt="No blogs found"
          className="w-52 h-52 mb-4 opacity-90"
        />
        <h1 className="text-2xl font-semibold text-base-content flex items-center gap-2">
          No blogs found!
        </h1>
        <p className="text-base-content mb-4 text-center">
          It seems a bit quiet here... Try refreshing to see if there are new blogs!
        </p>
        <button
          onClick={() => fetchBlogs(page)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-700 text-white text-lg font-medium rounded-full shadow-md hover:scale-105 transition duration-300"
        >
          Refresh Feed
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Latest Blogs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/blogs/${blog._id}`)}
          >
            {blog.featuredImage && (
              <img src={blog.featuredImage} alt={blog.title} className="w-full h-40 object-cover" />
            )}
            <div className="p-5 flex flex-col h-full">
              <h2 className="text-xl font-semibold mb-2 line-clamp-2">{blog.title}</h2>
              <div className="flex items-center gap-2 mb-2">
                <img src={blog.author.photoUrl} alt={blog.author.firstName} className="w-8 h-8 rounded-full" />
                <span className="text-sm text-gray-700">{blog.author.firstName} {blog.author.lastName}</span>
                <span className="text-xs text-gray-400 ml-auto">{new Date(blog.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-gray-700 text-sm mb-3 line-clamp-3">{blog.content.slice(0, 120)}...</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {blog.tags.map((tag) => (
                  <span key={tag} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">#{tag}</span>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-auto text-sm text-gray-500">
                <span>👍 {blog.likeCount || 0}</span>
                <span>💬 {blog.commentCount || 0}</span>
                <span>🔗 {blog.shareCount || 0}</span>
                <span className="ml-auto">{blog.readTime} min read</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-10">
        <button onClick={handlePrev} disabled={page === 1} className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50">Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={handleNext} disabled={page === totalPages} className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50">Next</button>
      </div>
    </div>
  );
};

export default Feed;
