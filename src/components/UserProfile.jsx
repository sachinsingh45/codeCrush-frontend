import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import Spinner from "./Spinner";
import { FaUser, FaBirthdayCake, FaVenusMars, FaBlog, FaHeart, FaComment, FaShareAlt, FaCheckCircle, FaRegFileAlt, FaLinkedin, FaGithub } from "react-icons/fa";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const statIcons = [
  <FaBlog className="text-blue-500 text-xl mx-auto" />,
  <FaHeart className="text-green-500 text-xl mx-auto" />,
  <FaComment className="text-yellow-500 text-xl mx-auto" />,
  <FaShareAlt className="text-purple-500 text-xl mx-auto" />,
  <FaCheckCircle className="text-blue-700 text-xl mx-auto" />,
  <FaRegFileAlt className="text-gray-500 text-xl mx-auto" />
];

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const connections = useSelector((store) => store.connections) || [];
  const loggedInUser = useSelector((store) => store.user);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [relationship, setRelationship] = useState('unknown');

  useEffect(() => {
    if (!id) return;
    const fetchUserProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const [userRes, statsRes, blogsRes, relRes] = await Promise.all([
          axios.get(`${BASE_URL}/users/${id}`),
          axios.get(`${BASE_URL}/users/${id}/blog-stats`),
          axios.get(`${BASE_URL}/users/${id}/blogs`),
          axios.get(`${BASE_URL}/user/relationship/${id}`, { withCredentials: true })
        ]);
        setUser(userRes.data.data);
        setStats(statsRes.data.data);
        setBlogs(blogsRes.data.data);
        setRelationship(relRes.data.status);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [id]);

  useEffect(() => {
    // If viewing own profile, redirect to /profile
    if (loggedInUser && id === loggedInUser._id) {
      navigate('/profile', { replace: true });
      return;
    }
  }, [loggedInUser, id, navigate]);

  if (loading) return <div className="flex justify-center items-center min-h-[300px]"><Spinner size={48} /></div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!user) return null;

  // Check if the viewed user is a friend/connection
  const isFriend = connections.some(conn => conn._id === id);

  // Defensive: always default blogs to an array
  const safeBlogs = Array.isArray(blogs) ? blogs : [];

  return (
    <div className="max-w-4xl mx-auto py-6 px-2 sm:px-4">
      {/* Profile Card */}
      <div className="mb-16">
        <div className="h-32 sm:h-40 md:h-48 w-full rounded-2xl bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 shadow-lg flex items-end justify-center">
          <img
            src={user.photoUrl || "/default-avatar.png"}
            alt={user.firstName}
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-xl bg-white -mb-14"
            style={{ zIndex: 2 }}
          />
        </div>
        <div className="flex flex-col items-center w-full mt-16 relative">
          <div className="bg-white dark:bg-base-200 rounded-xl shadow-lg px-6 py-5 mt-4 w-full max-w-xl flex flex-col items-center animate-fade-in border border-blue-50">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2 text-center">
              <FaUser className="text-blue-500" /> {user.firstName} {user.lastName}
            </h1>
            <div className="flex flex-wrap gap-4 justify-center text-gray-500 text-sm mb-2">
              {user.age && (
                <span className="flex items-center gap-1"><FaBirthdayCake /> {user.age} yrs</span>
              )}
              {user.gender && (
                <span className="flex items-center gap-1"><FaVenusMars /> {user.gender}</span>
              )}
            </div>
            <p className="text-base-content text-center mb-3 max-w-xs xs:max-w-sm sm:max-w-lg text-base">{user.about || <span className="italic text-gray-400">No details available.</span>}</p>
            {(user.linkedin || user.github) && (
              <div className="flex gap-4 mt-2">
                {user.linkedin && (
                  <a
                    href={user.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-700 hover:underline"
                    title="View LinkedIn Profile"
                  >
                    <FaLinkedin className="text-blue-600 text-xl" />
                    <span className="break-all">LinkedIn</span>
                  </a>
                )}
                {user.github && (
                  <a
                    href={user.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-800 hover:underline"
                    title="View GitHub Profile"
                  >
                    <FaGithub className="text-gray-800 text-xl" />
                    <span className="break-all">GitHub</span>
                  </a>
                )}
              </div>
            )}
            {user.skills && user.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2 justify-center">
                {user.skills.map((skill, idx) => (
                  <span key={idx} className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-xs font-semibold shadow hover:bg-blue-200 transition cursor-pointer flex items-center gap-1">
                    <FaCheckCircle className="text-blue-400" /> {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Relationship Actions */}
      {isFriend ? (
        <div className="flex justify-center mb-8">
          <button
            className="btn btn-primary px-6 py-2 rounded-full font-semibold shadow-md hover:scale-105 transition flex items-center gap-2"
            onClick={() => navigate(`/chat/${id}`)}
          >
            <FaComment className="mr-2" /> Chat
          </button>
        </div>
      ) : relationship === 'unknown' ? (
        <div className="flex justify-center mb-8">
          <button
            className="btn btn-success px-6 py-2 rounded-full font-semibold shadow-md hover:scale-105 transition flex items-center gap-2"
            onClick={async () => {
              try {
                const res = await axios.post(`${BASE_URL}/request/send/${id}`, {}, { withCredentials: true });
                setRelationship('request_sent');
                toast.success(res.data.message || 'Connection request sent!');
              } catch (err) {
                toast.error(err?.response?.data?.message || 'Failed to send connection request.');
              }
            }}
          >
            <FaUser className="mr-2" /> Request
          </button>
        </div>
      ) : null}

      {/* Blog Stats Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><FaBlog className="text-blue-500" /> Blog Stats</h2>
        {stats ? (
          <div className="grid grid-cols-2 xs:grid-cols-3 gap-6 mb-8">
            {[
              { label: "Total Blogs", value: stats.totalBlogs },
              { label: "Total Likes", value: stats.totalLikes },
              { label: "Total Comments", value: stats.totalComments },
              { label: "Total Shares", value: stats.totalShares },
              { label: "Published", value: stats.publishedBlogs },
              { label: "Drafts", value: stats.draftBlogs },
            ].map((stat, idx) => (
              <div key={stat.label} className="bg-white dark:bg-base-200 rounded-xl p-5 text-center shadow-md hover:shadow-xl transition-all group border border-blue-50 flex flex-col items-center">
                <div className="mb-2 flex justify-center">{statIcons[idx]}</div>
                <div className="text-2xl font-bold group-hover:text-blue-600 transition">{stat.value}</div>
                <div className="text-gray-700 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500">No stats available.</div>
        )}
      </div>

      {/* Blogs Section */}
      <div className="mt-10 xs:mt-12">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl xs:text-2xl font-bold"><FaRegFileAlt className="inline text-blue-500 mr-2" /> Blogs</h2>
          <div className="flex-grow border-t border-gray-200 ml-2"></div>
        </div>
        {safeBlogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 xs:py-10">
            <img src="/empty-feed.png" alt="No blogs" className="w-24 h-24 xs:w-32 xs:h-32 opacity-70 mb-4" />
            <div className="text-gray-500 text-base xs:text-lg font-medium text-center">No blogs found for this user.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 xs:gap-6">
            {safeBlogs.map((blog) => (
              <div
                key={blog._id}
                className="group bg-white dark:bg-base-200 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden hover:scale-[1.03] hover:shadow-2xl transition-all flex flex-col animate-fade-in cursor-pointer"
                onClick={() => navigate(`/blogs/${blog._id}`)}
              >
                {blog.featuredImage && (
                  <img src={blog.featuredImage} alt={blog.title} className="w-full h-28 xs:h-36 object-cover transition-transform group-hover:scale-105 duration-300" />
                )}
                <div className="p-3 xs:p-4 sm:p-5 flex flex-col h-full">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {blog.tags.map((tag) => (
                      <span key={tag} className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-2 py-1 rounded text-xs font-semibold tracking-wide">#{tag}</span>
                    ))}
                  </div>
                  <h3 className="text-base xs:text-lg sm:text-xl font-bold mb-1 line-clamp-2 text-base-content group-hover:text-blue-600 transition">{blog.title}</h3>
                  <p className="text-gray-500 text-xs xs:text-sm mb-2 line-clamp-2">{blog.excerpt || blog.content?.slice(0, 80) + "..."}</p>
                  <div className="flex items-center gap-2 xs:gap-3 mb-2">
                    <img src={user.photoUrl} alt={user.firstName} className="w-7 h-7 xs:w-8 xs:h-8 rounded-full border-2 border-blue-400 dark:border-blue-700" />
                    <span className="text-xs xs:text-base font-medium text-base-content">{user.firstName} {user.lastName}</span>
                    <span className="text-xs text-neutral ml-auto">{new Date(blog.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 xs:gap-4 text-xs xs:text-sm text-neutral-content border-t border-base-200 dark:border-base-300 pt-2 xs:pt-3 mb-2">
                    <span title="Likes" className="flex items-center gap-1"><FaHeart className="text-red-400" /> {blog.likeCount || 0}</span>
                    <span title="Comments" className="flex items-center gap-1"><FaComment className="text-yellow-500" /> {blog.commentCount || 0}</span>
                    <span title="Shares" className="flex items-center gap-1"><FaShareAlt className="text-purple-500" /> {blog.shareCount || 0}</span>
                    <span className="ml-auto" title="Read time">⏱ {blog.readTime} min</span>
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

export default UserProfile; 