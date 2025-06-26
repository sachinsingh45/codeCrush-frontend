import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSelector, useDispatch } from "react-redux";
import { FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import { addConnections } from "../utils/conectionSlice";
import Spinner from "./Spinner";

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("desc"); // 'desc' for newest first, 'asc' for oldest first
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const connections = useSelector((store) => store.connections) || [];
  const dispatch = useDispatch();
  const [fetchingConnections, setFetchingConnections] = useState(false);

  useEffect(() => {
    if (filter === "friends" && connections.length === 0 && !fetchingConnections) {
      setFetchingConnections(true);
      axios.get(`${BASE_URL}/user/connections`, { withCredentials: true })
        .then(res => {
          if (res.data && res.data.data) {
            dispatch(addConnections(res.data.data));
          }
        })
        .finally(() => setFetchingConnections(false));
    }
    // eslint-disable-next-line
  }, [filter, dispatch]);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError("");
      try {
        let url = `${BASE_URL}/blogs`;
        let params = { page, limit: 6, sort };
        if (filter === "my") {
          url = `${BASE_URL}/users/${user?._id}/blogs`;
        }
        let res = await axios.get(url, { params });
        let data = res.data.data;
        if (filter === "friends") {
          if (fetchingConnections || connections.length === 0) {
            setLoading(false);
            return;
          }
          const friendIds = connections.map(c => c._id);
          data = data.filter(b => friendIds.includes(b.author._id));
        }
        if (sort === "asc") {
          data = [...data].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }
        setBlogs(data);
        setTotalPages(res.data.pagination?.totalPages || 1);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load blogs");
      } finally {
        setLoading(false);
      }
    };
    fetch();
    // eslint-disable-next-line
  }, [page, filter, sort, user, connections.length, fetchingConnections]);

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  const sortFilterBar = (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 p-2 sm:p-4 card bg-base-100/80 dark:bg-base-200/80 shadow-lg border border-base-200 dark:border-base-300 backdrop-blur-md w-full">
      <div className="flex items-center gap-2 w-full md:w-auto flex-nowrap min-w-0">
        <button
          type="button"
          aria-label={sort === "desc" ? "Sort: Newest First" : "Sort: Oldest First"}
          title={sort === "desc" ? "Sort: Newest First" : "Sort: Oldest First"}
          className="btn btn-ghost btn-xs sm:btn-sm text-lg text-base-content ml-0"
          onClick={() => setSort(sort === "desc" ? "asc" : "desc")}
        >
          Sort:
          <FaSortAmountDown className={sort === "desc" ? "rotate-0" : "rotate-180 transition-transform duration-200"} />
        </button>
      </div>
      <div className="flex gap-2 w-full md:w-auto justify-center flex-wrap">
        <button
          className={`btn btn-xs sm:btn-sm md:btn-md rounded-full font-semibold transition-all border-2 shadow-sm focus:outline-none ${filter === "all" ? "btn-primary text-primary-content" : "btn-ghost text-base-content"}`}
          onClick={() => { setFilter("all"); setPage(1); }}
        >
          All Blogs
        </button>
        <button
          className={`btn btn-xs sm:btn-sm md:btn-md rounded-full font-semibold transition-all border-2 shadow-sm focus:outline-none ${filter === "my" ? "btn-primary text-primary-content" : "btn-ghost text-base-content"}`}
          onClick={() => { setFilter("my"); setPage(1); }}
        >
          My Blogs
        </button>
        <button
          className={`btn btn-xs sm:btn-sm md:btn-md rounded-full font-semibold transition-all border-2 shadow-sm focus:outline-none ${filter === "friends" ? "btn-primary text-primary-content" : "btn-ghost text-base-content"}`}
          onClick={() => { setFilter("friends"); setPage(1); }}
        >
          Friend Blogs
        </button>
      </div>
      {user && (
        <button
          className="btn btn-success btn-xs sm:btn-sm md:btn-md rounded-full font-semibold shadow-md text-white ml-0 md:ml-4 w-full md:w-auto"
          onClick={() => navigate("/create-blog")}
        >
          Create Blog
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto py-6 sm:py-10 px-2 sm:px-4">
      {sortFilterBar}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] w-full">
          <div className="flex justify-center items-center w-full mt-10">
            <Spinner size={64} />
          </div>
        </div>
      ) : error ? (
        <div className="flex justify-center mt-20 text-red-500 w-full text-center px-2">{error}</div>
      ) : fetchingConnections && filter === "friends" ? (
        <div className="flex justify-center items-center min-h-[200px] w-full">
          <Spinner size={40} />
          <span className="ml-4 text-base-content text-lg font-semibold">Loading your connections...</span>
        </div>
      ) : !blogs.length ? (
        <div className="mt-20 flex flex-col items-center justify-center mb-10 p-4 sm:p-6 rounded-xl w-full">
          <img
            src="/empty-feed.png"
            alt="No blogs found"
            className="w-36 h-36 sm:w-52 sm:h-52 mb-4 opacity-90"
          />
          <h1 className="text-xl sm:text-2xl font-semibold text-base-content flex items-center gap-2 text-center">
            No blogs found!
          </h1>
          <p className="text-base-content mb-4 text-center text-sm sm:text-base">
            It seems a bit quiet here... Try refreshing to see if there are new blogs!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
            <button
              onClick={() => {
                setFilter("all");
                setPage(1);
                setSort("desc");
              }}
              className="flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-2.5 bg-gradient-to-r from-blue-500 to-blue-700 text-white text-base sm:text-lg font-medium rounded-full shadow-md hover:scale-105 transition duration-300 w-full sm:w-auto"
            >
              Refresh Feed
            </button>
            {filter === "my" && (
              <button
                onClick={() => navigate("/create-blog")}
                className="flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-2.5 bg-gradient-to-r from-green-500 to-green-700 text-white text-base sm:text-lg font-medium rounded-full shadow-md hover:scale-105 transition duration-300 w-full sm:w-auto"
              >
                Create Blog
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="group bg-white dark:bg-base-200 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden hover:scale-[1.03] hover:shadow-2xl transition-all cursor-pointer flex flex-col"
                onClick={() => navigate(`/blogs/${blog._id}`)}
              >
                {blog.featuredImage && (
                  <img src={blog.featuredImage} alt={blog.title} className="w-full h-36 sm:h-44 object-cover transition-transform group-hover:scale-105 duration-300" />
                )}
                <div className="p-3 sm:p-5 flex flex-col h-full">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {blog.tags.map((tag) => (
                      <span key={tag} className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-2 py-1 rounded text-xs font-semibold tracking-wide">#{tag}</span>
                    ))}
                  </div>
                  <h2 className="text-lg sm:text-2xl font-bold mb-2 line-clamp-2 text-base-content">{blog.title}</h2>
                  <p className="text-base-content text-sm sm:text-base mb-4 line-clamp-3">{blog.content.slice(0, 120)}...</p>
                  <div className="flex items-center gap-3 mb-3">
                    <img src={blog.author.photoUrl} alt={blog.author.firstName} className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-blue-400 dark:border-blue-700" />
                    <span className="text-base font-medium text-base-content">{blog.author.firstName} {blog.author.lastName}</span>
                    <span className="text-xs text-neutral ml-auto">{new Date(blog.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-auto text-xs sm:text-sm text-neutral-content border-t border-base-200 dark:border-base-300 pt-3 flex-wrap">
                    <span title="Likes" className="text-base-content flex items-center gap-1"><span role="img" aria-label="like">👍</span> {blog.likeCount || 0}</span>
                    <span title="Comments" className="text-base-content flex items-center gap-1"><span role="img" aria-label="comments">💬</span> {blog.commentCount || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-8">
            <button
              className="btn btn-outline btn-xs sm:btn-sm rounded-full"
              onClick={handlePrev}
              disabled={page === 1}
            >
              Prev
            </button>
            <span className="text-base-content text-xs sm:text-base font-semibold mx-2">
              Page {page} of {totalPages}
            </span>
            <button
              className="btn btn-outline btn-xs sm:btn-sm rounded-full"
              onClick={handleNext}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BlogPage; 