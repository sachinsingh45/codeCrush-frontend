import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FaHeart, FaRegHeart, FaPaperPlane, FaWhatsapp, FaTwitter, FaFacebook, FaLink, FaCommentDots, FaShareAlt } from "react-icons/fa";
import { createSocketConnection } from "../utils/socket";
import { addConnections } from "../utils/conectionSlice";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comment, setComment] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // 'blog' or commentId
  const [showShare, setShowShare] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const connections = useSelector((store) => store.connections) || [];
  const blogUrl = window.location.href;
  const shareRef = useRef(null);
  const [fetchingConnections, setFetchingConnections] = useState(false);
  const likeSectionRef = useRef(null);

  const fetchBlog = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${BASE_URL}/blogs/${id}`);
      setBlog(res.data.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load blog");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
    // eslint-disable-next-line
  }, [id]);

  // Blog Interactions
  const handleLike = async () => {
    setActionLoading(true);
    const wasLiked = blog.likes?.some(like => like.user._id === user?._id);
    try {
      await axios.post(`${BASE_URL}/blogs/${id}/like`, {}, {
        withCredentials: true
      });
      toast.success(wasLiked ? "Blog unliked!" : "Blog liked!");
      fetchBlog();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to like blog");
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDelete = (target) => {
    setDeleteTarget(target);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      if (deleteTarget === "blog") {
        await axios.delete(`${BASE_URL}/blogs/${id}`, {
          withCredentials: true
        });
        toast.success("Blog deleted!");
        navigate("/");
      } else {
        await axios.delete(`${BASE_URL}/blogs/${id}/comments/${deleteTarget}`, {
          withCredentials: true
        });
        toast.success("Comment deleted!");
        fetchBlog();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete");
    } finally {
      setActionLoading(false);
      setShowDeleteModal(false);
      setDeleteTarget(null);
    }
  };

  // Comments
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setActionLoading(true);
    try {
      await axios.post(`${BASE_URL}/blogs/${id}/comments`, { content: comment }, {
        withCredentials: true
      });
      setComment("");
      toast.success("Comment added!");
      fetchBlog();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add comment");
    } finally {
      setActionLoading(false);
    }
  };

  const handleLikeComment = async (commentId) => {
    setActionLoading(true);
    const comment = blog.comments.find(c => c._id === commentId);
    const likedComment = comment?.likes?.some(like => like.user._id === user?._id);
    try {
      await axios.post(`${BASE_URL}/blogs/${id}/comments/${commentId}/like`, {}, {
        withCredentials: true
      });
      toast.success(likedComment ? "Comment unliked!" : "Comment liked!");
      fetchBlog();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to like comment");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(blogUrl);
    toast.success("Link copied to clipboard!");
    setShowShare(false);
  };

  const handleShareToChat = (targetUserId) => {
    const userId = user?._id;
    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: `Check out this blog: ${blogUrl}`,
    });
    setShowChatModal(false);
    setShowShare(false);
    toast.success("Blog link sent to chat!");
  };

  // Add a click-away listener to close the share popup
  useEffect(() => {
    if (!showShare) return;
    const handleClick = (e) => {
      if (shareRef.current && !shareRef.current.contains(e.target)) {
        setShowShare(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showShare]);

  const ensureConnections = async () => {
    if (connections && connections.length > 0) return connections;
    setFetchingConnections(true);
    try {
      const res = await axios.get(`${BASE_URL}/user/connections`, { withCredentials: true });
      if (res.data && res.data.data) {
        dispatch(addConnections(res.data.data));
        setFetchingConnections(false);
        return res.data.data;
      }
    } catch (err) {
      setFetchingConnections(false);
      return [];
    }
    setFetchingConnections(false);
    return [];
  };

  if (loading) return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <Skeleton height={256} className="mb-6" />
      <Skeleton height={36} width={"60%"} className="mb-2" />
      <div className="flex items-center gap-2 mb-4">
        <Skeleton circle width={40} height={40} />
        <Skeleton width={100} />
        <Skeleton width={80} className="ml-auto" />
      </div>
      <Skeleton count={2} height={20} className="mb-4" />
      <Skeleton count={6} height={16} className="mb-2" />
      <div className="flex gap-4 mb-6">
        <Skeleton width={60} height={32} />
        <Skeleton width={60} height={32} />
        <Skeleton width={60} height={32} />
        <Skeleton width={120} height={32} className="ml-auto" />
      </div>
      <Skeleton height={40} className="mb-6" />
      <Skeleton count={3} height={60} className="mb-4" />
    </div>
  );
  if (error) return <div className="flex justify-center mt-20 text-red-500">{error}</div>;
  if (!blog) return null;

  // Check if current user liked the blog
  const likedByUser = blog.likes?.some(like => like.user._id === user?._id);
  const isAuthor = user?._id === blog.author._id;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      {/* Quick Action Banner */}
      <div
        className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-blue-50 dark:bg-base-200 border border-blue-100 dark:border-base-300 shadow-sm cursor-pointer hover:bg-blue-100/80 dark:hover:bg-base-300 transition-all"
        onClick={() => {
          likeSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }}
        title="Jump to like, comment, or share"
        role="button"
        tabIndex={0}
        onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') { likeSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); } }}
      >
        <span className="flex items-center gap-2 text-blue-500 text-xl">
          <FaHeart /> <FaCommentDots /> <FaShareAlt />
        </span>
        <span className="text-base font-medium text-base-content">Quick actions: Like, comment, or share this blog</span>
        <span className="ml-auto text-sm text-primary">Click here</span>
      </div>
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-8 shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="mb-6">Are you sure you want to delete {deleteTarget === "blog" ? "this blog" : "this comment"}?</p>
            <div className="flex gap-4 justify-end">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
                onClick={() => { setShowDeleteModal(false); setDeleteTarget(null); }}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
                onClick={handleDelete}
                disabled={actionLoading}
              >
                {actionLoading ? <span className="loader inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
      {blog.featuredImage && (
        <img src={blog.featuredImage} alt={blog.title} className="w-full h-64 object-cover rounded-xl mb-6" />
      )}
      <h1 className="text-3xl font-bold mb-2 text-base-content">{blog.title}</h1>
      <div className="flex items-center gap-2 mb-4">
        <img src={blog.author.photoUrl} alt={blog.author.firstName} className="w-10 h-10 rounded-full" />
        <span
          className="text-base font-medium text-base-content cursor-pointer hover:underline"
          onClick={() => navigate(`/users/${blog.author._id}`)}
          title="View Profile"
        >
          {blog.author.firstName} {blog.author.lastName}
        </span>
        <span className="text-xs text-neutral ml-auto">{new Date(blog.createdAt).toLocaleDateString()}</span>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {blog.tags.map((tag) => (
          <span key={tag} className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-2 py-1 rounded text-xs font-semibold tracking-wide">#{tag}</span>
        ))}
      </div>
      <div className="prose max-w-none mb-6 text-base-content dark:text-base-content">
        <pre className="whitespace-pre-wrap break-words font-sans bg-transparent p-0 m-0 border-0 shadow-none">{blog.content}</pre>
      </div>
      <div className="flex items-center gap-6 mb-6 text-neutral-content" ref={likeSectionRef}>
        {/* Like Button */}
        <button
          className={`flex items-center gap-2 text-2xl transition-transform duration-150 cursor-pointer ${likedByUser ? "text-red-500 scale-110" : "text-base-content hover:text-red-400"}`}
          onClick={handleLike}
          disabled={actionLoading || !user}
          aria-label={likedByUser ? "Unlike" : "Like"}
        >
          {actionLoading ? (
            <span className="loader inline-block w-5 h-5 border-2 border-red-200 border-t-transparent rounded-full animate-spin"></span>
          ) : likedByUser ? (
            <FaHeart />
          ) : (
            <FaRegHeart />
          )}
          <span className="text-base text-base-content font-semibold">{blog.likeCount || 0}</span>
        </button>
        {/* Share Button */}
        <div className="relative" ref={shareRef}>
          <button
            className={`flex items-center gap-2 text-2xl text-base-content hover:text-primary transition-colors px-2 py-1 rounded-full bg-base-200 hover:bg-primary/10 cursor-pointer`}
            onClick={() => setShowShare((v) => !v)}
            disabled={actionLoading || !user}
            type="button"
            aria-label="Share"
          >
            <FaPaperPlane />
            <span className="text-base font-semibold">{blog.shareCount || 0}</span>
          </button>
          {showShare && (
            <div className="absolute z-50 bottom-12 right-0 card bg-base-100 dark:bg-base-200 shadow-lg border border-base-200 dark:border-base-300 w-64 animate-fade-in">
              <div className="flex flex-col gap-2 p-4">
                <button
                  className="btn btn-ghost flex items-center gap-2 justify-start text-base-content"
                  onClick={handleCopyLink}
                >
                  <FaLink /> Copy Link
                </button>
                <a
                  className="btn btn-ghost flex items-center gap-2 justify-start text-base-content"
                  href={`https://wa.me/?text=${encodeURIComponent(blogUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaWhatsapp className="text-green-500" /> WhatsApp
                </a>
                <a
                  className="btn btn-ghost flex items-center gap-2 justify-start text-base-content"
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(blogUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTwitter className="text-sky-500" /> Twitter
                </a>
                <a
                  className="btn btn-ghost flex items-center gap-2 justify-start text-base-content"
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(blogUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebook className="text-blue-600" /> Facebook
                </a>
                <button
                  className="btn btn-ghost flex items-center gap-2 justify-start text-base-content"
                  onClick={async () => {
                    await ensureConnections();
                    setShowChatModal(true);
                  }}
                >
                  💬 Share to Chat
                </button>
              </div>
            </div>
          )}
        </div>
        {isAuthor && (
          <button
            className="px-3 py-1 rounded bg-red-500 text-white flex items-center gap-2 ml-2 cursor-pointer"
            onClick={() => confirmDelete("blog")}
            disabled={actionLoading}
          >
            {actionLoading && deleteTarget === "blog" ? <span className="loader inline-block w-4 h-4 border-2 border-red-200 border-t-transparent rounded-full animate-spin"></span> : null}
            Delete
          </button>
        )}
        <span className="ml-auto text-base-content flex items-center gap-2"><span className="text-xl">💬</span> {blog.commentCount || 0} | <span className="text-xl">⏱</span> {blog.readTime} min read</span>
      </div>
      {/* Add Comment */}
      {user && (
        <form onSubmit={handleAddComment} className="mb-6 flex gap-2">
          <input
            type="text"
            value={comment}
            onChange={e => setComment(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Add a comment..."
            disabled={actionLoading}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center gap-2 cursor-pointer"
            disabled={actionLoading || !comment.trim()}
          >
            {actionLoading ? <span className="loader inline-block w-4 h-4 border-2 border-blue-200 border-t-transparent rounded-full animate-spin"></span> : null}
            Comment
          </button>
        </form>
      )}
      {/* Comments Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-base-content">Comments</h2>
        {blog.comments && blog.comments.length > 0 ? (
          <div className="space-y-4">
            {blog.comments.map((comment) => {
              const likedComment = comment.likes?.some(like => like.user._id === user?._id);
              const canDelete = user && (user._id === comment.user._id || isAuthor);
              return (
                <div key={comment._id} className="bg-base-100 dark:bg-base-200 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <img src={comment.user.photoUrl} alt={comment.user.firstName} className="w-7 h-7 rounded-full" />
                    <span className="font-medium text-sm text-base-content">{comment.user.firstName} {comment.user.lastName}</span>
                  </div>
                  <p className="text-base-content text-sm mb-2">{comment.content}</p>
                  <div className="flex items-center gap-3 text-xs text-neutral-content">
                    <button
                      className={`px-2 py-1 rounded flex items-center gap-2 cursor-pointer ${likedComment ? "bg-primary/10 text-red-500" : "bg-base-200 text-base-content hover:text-red-400"}`}
                      onClick={() => handleLikeComment(comment._id)}
                      disabled={actionLoading || !user}
                    >
                      {actionLoading ? (
                        <span className="loader inline-block w-4 h-4 border-2 border-red-200 border-t-transparent rounded-full animate-spin"></span>
                      ) : likedComment ? (
                        <FaHeart className="text-lg" />
                      ) : (
                        <FaRegHeart className="text-lg" />
                      )}
                      <span className="ml-1 text-base font-semibold">{comment.likes?.length || 0}</span>
                    </button>
                    {canDelete && (
                      <button
                        className="px-2 py-1 rounded bg-error text-error-content flex items-center gap-2 cursor-pointer"
                        onClick={() => confirmDelete(comment._id)}
                        disabled={actionLoading}
                      >
                        {actionLoading && deleteTarget === comment._id ? <span className="loader inline-block w-4 h-4 border-2 border-red-200 border-t-transparent rounded-full animate-spin"></span> : null}
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-neutral">No comments yet.</div>
        )}
      </div>
      {/* Share to Chat Modal */}
      {showChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="card bg-base-100 dark:bg-base-200 p-6 rounded-xl shadow-lg w-full max-w-md relative">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 cursor-pointer"
              onClick={() => setShowChatModal(false)}
            >✕</button>
            <h2 className="text-xl font-bold mb-4">Share to Chat</h2>
            <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
              {fetchingConnections ? (
                <div className="text-base-content text-center py-6">Loading connections...</div>
              ) : connections.length === 0 ? (
                <div className="text-base-content">No connections found.</div>
              ) : (
                connections.map(conn => (
                  <button
                    key={conn._id}
                    className="btn btn-outline flex items-center gap-3 justify-start text-base-content cursor-pointer"
                    onClick={() => handleShareToChat(conn._id)}
                  >
                    <img src={conn.photoUrl || "/default-avatar.png"} alt={conn.firstName} className="w-8 h-8 rounded-full" />
                    {conn.firstName} {conn.lastName}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogDetails; 