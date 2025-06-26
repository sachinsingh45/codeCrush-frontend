import { useSelector } from "react-redux";
import EditProfile from "./EditProfile";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import { FaUser, FaBirthdayCake, FaVenusMars, FaBlog, FaHeart, FaComment, FaShareAlt, FaCheckCircle, FaRegFileAlt, FaEdit, FaFolderOpen, FaLinkedin, FaGithub, FaPaperPlane } from "react-icons/fa";
import UserCard from "./UserCard";

const statIcons = [
  <FaBlog className="text-blue-500 text-xl mx-auto" />,
  <FaHeart className="text-green-500 text-xl mx-auto" />,
  <FaComment className="text-yellow-500 text-xl mx-auto" />,
  <FaShareAlt className="text-purple-500 text-xl mx-auto" />,
  <FaCheckCircle className="text-blue-700 text-xl mx-auto" />,
  <FaRegFileAlt className="text-gray-500 text-xl mx-auto" />
];

const Profile = () => {
  const user = useSelector((store) => store.user.user);
  const [stats, setStats] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [blogFilter, setBlogFilter] = useState("all"); // 'all', 'published', 'draft'
  const [showDraftsDialog, setShowDraftsDialog] = useState(false);
  const [reviewStats, setReviewStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?._id) return;
    const fetchProfileData = async () => {
      setLoading(true);
      setError("");
      try {
        // Fetch blog stats and blogs
        const [statsRes, blogsRes] = await Promise.all([
          axios.get(`${BASE_URL}/users/${user._id}/blog-stats`),
          axios.get(`${BASE_URL}/users/${user._id}/blogs?status=all`)
        ]);
        setStats(statsRes.data.data);
        setBlogs(blogsRes.data.data);
        
        // Try to fetch review stats separately (optional)
        try {
          const reviewStatsRes = await axios.get(`${BASE_URL}/review-stats/${user._id}`);
          setReviewStats(reviewStatsRes.data);
        } catch (reviewErr) {
          console.warn("Review stats not available:", reviewErr.message);
          setReviewStats(null);
        }
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [user]);

  if (!user) return null;
  if (loading) return <div className="flex justify-center items-center min-h-[300px]"><Spinner size={48} /></div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

  // Defensive: always default blogs to an array
  const safeBlogs = Array.isArray(blogs) ? blogs : [];

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-6 px-2 sm:px-4 relative">
      {showEdit ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-0" onClick={() => setShowEdit(false)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
          <div
            className="bg-white dark:bg-base-200 rounded-2xl shadow-2xl px-2 sm:px-4 py-4 w-full max-w-md max-h-[80vh] overflow-y-auto relative border border-blue-100 animate-fade-in z-10"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-3">Edit Profile</h2>
            <EditProfile user={user} onClose={() => setShowEdit(false)} showToast />
          </div>
        </div>
      ) : (
        <>
          {/* Profile Card */}
          <div className="mb-12 sm:mb-16">
            <div className="h-28 sm:h-40 md:h-48 w-full rounded-2xl bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 shadow-lg flex items-end justify-center">
              <img
                src={user.photoUrl || "/default-avatar.png"}
                alt={user.firstName}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-xl bg-white -mb-12 sm:-mb-14"
                style={{ zIndex: 2 }}
              />
            </div>
            <div className="flex flex-col items-center w-full mt-12 sm:mt-16 relative">
              <div className="bg-base-100 dark:bg-base-200 rounded-xl shadow-lg px-3 sm:px-6 py-4 sm:py-5 mt-4 w-full max-w-xs sm:max-w-xl flex flex-col items-center animate-fade-in border border-blue-50">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-2 text-center text-base-content">
                  <FaUser className="text-blue-500" /> {user.firstName} {user.lastName}
                </h1>
                <div className="flex flex-wrap gap-4 justify-center text-base-content text-xs sm:text-sm mb-2">
                  {user.age && (
                    <span className="flex items-center gap-1"><FaBirthdayCake /> {user.age} yrs</span>
                  )}
                  {user.gender && (
                    <span className="flex items-center gap-1"><FaVenusMars /> {user.gender}</span>
                  )}
                </div>
                <p className="text-base-content text-center mb-3 max-w-xs xs:max-w-sm sm:max-w-lg text-sm sm:text-base">{user.about || <span className="italic text-gray-400">No details available.</span>}</p>
                {(user.linkedin || user.github) && (
                  <div className="flex gap-4 mt-2 flex-wrap justify-center">
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
                      <span key={idx} className="bg-blue-100 text-blue-700 px-3 sm:px-4 py-1 rounded-full text-xs font-semibold shadow hover:bg-blue-200 transition cursor-pointer flex items-center gap-1">
                        <FaCheckCircle className="text-blue-400" /> {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Buttons below the card */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-4 sm:mt-6 w-full items-center">
            <button
              className="bg-blue-500 text-white rounded-full px-4 py-2 sm:px-5 sm:py-2 shadow hover:bg-blue-600 transition flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center text-sm sm:text-base min-w-[120px] sm:min-w-[140px]"
              onClick={() => setShowEdit(true)}
              title="Edit Profile"
              aria-label="Edit Profile"
            >
              <FaEdit size={16} />
              <span className="font-semibold">Edit Profile</span>
            </button>
            <button
              className="bg-gray-200 text-blue-600 rounded-full px-4 py-2 sm:px-5 sm:py-2 shadow hover:bg-blue-100 transition flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center text-sm sm:text-base min-w-[120px] sm:min-w-[140px]"
              onClick={() => setShowPreview(true)}
              title="Preview Profile"
              aria-label="Preview Profile"
            >
              <FaUser size={16} />
              <span className="font-semibold">Preview</span>
            </button>
          </div>

          {/* Blog Stats Section (now below Review Stats) */}
          <div className="mt-8 sm:mt-10">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2"><FaBlog className="text-blue-500" /> Blog Stats</h2>
            {stats ? (
              <div className="grid grid-cols-2 xs:grid-cols-3 gap-4 sm:gap-6 mb-8">
                {[
                  { label: "Total Blogs", value: stats.totalBlogs, filter: "all" },
                  { label: "Total Likes", value: stats.totalLikes },
                  { label: "Total Comments", value: stats.totalComments },
                  { label: "Total Shares", value: stats.totalShares },
                  { label: "Published", value: stats.publishedBlogs, filter: "published" },
                  { label: "Drafts", value: stats.draftBlogs, filter: "draft" },
                ].map((stat, idx) => (
                  <div
                    key={stat.label}
                    className={`bg-white dark:bg-base-200 rounded-xl p-3 sm:p-5 text-center shadow-md hover:shadow-xl transition-all group border border-blue-50 flex flex-col items-center ${stat.filter ? 'cursor-pointer' : ''} ${stat.filter && blogFilter === stat.filter ? 'ring-2 ring-blue-400' : ''}`}
                    onClick={stat.filter ? () => setBlogFilter(stat.filter) : undefined}
                  >
                    <div className="mb-2 flex justify-center">{statIcons[idx]}</div>
                    <div className="text-lg sm:text-2xl font-bold group-hover:text-blue-600 transition">{stat.value}</div>
                    <div className="text-gray-700 text-xs sm:text-sm mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500">No stats available.</div>
            )}
          </div>
          <button
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold shadow hover:bg-blue-200 transition mb-4 text-xs sm:text-base"
            style={{ marginBottom: '1.5rem' }}
            onClick={() => setShowDraftsDialog(true)}
          >
            <FaFolderOpen /> Open Drafts
          </button>

          {showPreview && (
            <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowPreview(false)}>
              <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
              <div className="bg-white dark:bg-base-200 rounded-xl shadow-2xl p-6 w-full max-w-3xl relative z-10" onClick={e => e.stopPropagation()}>
                <button
                  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 cursor-pointer"
                  onClick={() => setShowPreview(false)}
                  aria-label="Close Preview"
                >✕</button>
                <div className="mb-4 text-center text-lg font-semibold text-secondary-content">This is how your profile appears to others:</div>
                <UserCard user={user} />
              </div>
            </div>
          )}

          {showDraftsDialog && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setShowDraftsDialog(false)}>
              <div className="bg-white dark:bg-base-200 rounded-xl shadow-2xl p-6 w-full max-w-md relative z-10" onClick={e => e.stopPropagation()}>
                <button
                  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 cursor-pointer"
                  onClick={() => setShowDraftsDialog(false)}
                  aria-label="Close Drafts"
                >✕</button>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FaFolderOpen /> Your Drafts</h2>
                {safeBlogs.filter(b => b.status === 'draft').length === 0 ? (
                  <div className="text-gray-500 text-center">No drafts available.</div>
                ) : (
                  <ul className="space-y-3">
                    {safeBlogs.filter(b => b.status === 'draft').map(draft => (
                      <li key={draft._id} className="flex items-center gap-3 p-3 bg-base-100 rounded-lg shadow hover:bg-blue-50 transition cursor-pointer"
                        onClick={async () => {
                          try {
                            await axios.put(`${BASE_URL}/blogs/${draft._id}`, { status: 'published' }, { withCredentials: true });
                            setShowDraftsDialog(false);
                            navigate(`/edit-blog/${draft._id}`);
                            // Refresh blogs
                            const res = await axios.get(`${BASE_URL}/users/${user._id}/blogs`);
                            setBlogs(res.data.data);
                          } catch (err) {
                            alert('Failed to open draft');
                          }
                        }}
                      >
                        <span className="font-semibold text-base-content flex-1">{draft.title}</span>
                        <span className="text-xs text-gray-500">{new Date(draft.createdAt).toLocaleDateString()}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* Blogs Section */}
          <div className="mt-10 xs:mt-12">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl xs:text-2xl font-bold"><FaRegFileAlt className="inline text-blue-500 mr-2" /> Your Blogs</h2>
              <div className="flex-grow border-t border-gray-200 ml-2"></div>
            </div>
            {safeBlogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 xs:py-10">
                <img src="/empty-feed.png" alt="No blogs" className="w-24 h-24 xs:w-32 xs:h-32 opacity-70 mb-4" />
                <div className="text-gray-500 text-base xs:text-lg font-medium text-center">You haven't written any blogs yet.</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 xs:gap-6">
                {safeBlogs
                  .filter(blog => blogFilter === 'all' ? true : blog.status === blogFilter)
                  .map((blog) => (
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
                        <div className="flex gap-2 mt-auto">
                          <button
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs xs:text-sm transition"
                            onClick={e => { e.stopPropagation(); navigate(`/edit-blog/${blog._id}`); }}
                          >
                            Edit
                          </button>
                          <button
                            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-xs xs:text-sm transition"
                            onClick={e => { e.stopPropagation(); navigate(`/blogs/${blog._id}`); }}
                          >
                            View
                          </button>
                          {blog.status === 'draft' && (
                            <button
                              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs xs:text-sm transition"
                              onClick={async e => {
                                e.stopPropagation();
                                try {
                                  await axios.put(`${BASE_URL}/blogs/${blog._id}`, { status: 'published' }, { withCredentials: true });
                                  // Refresh blogs
                                  const res = await axios.get(`${BASE_URL}/users/${user._id}/blogs`);
                                  setBlogs(res.data.data);
                                } catch (err) {
                                  alert('Failed to publish draft');
                                }
                              }}
                            >
                              Publish
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
export default Profile;