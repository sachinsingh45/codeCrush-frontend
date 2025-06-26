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
  const user = useSelector((store) => store.user.user);
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
    <div className="max-w-3xl mx-auto py-6 sm:py-10 px-2 sm:px-4">
      <Skeleton height={180} className="mb-4 sm:mb-6" />
      <Skeleton height={28} width={"60%"} className="mb-2" />
      <div className="flex items-center gap-2 mb-4">
        <Skeleton circle width={32} height={32} />
        <Skeleton width={80} />
        <Skeleton width={60} className="ml-auto" />
      </div>
      <Skeleton count={2} height={16} className="mb-4" />
      <Skeleton count={4} height={12} className="mb-2" />
      <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-6">
        <Skeleton width={40} height={24} />
        <Skeleton width={40} height={24} />
        <Skeleton width={40} height={24} />
        <Skeleton width={80} height={24} className="ml-auto" />
      </div>
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
            <div
              className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
              style={{ background: 'rgba(0,0,0,0.3)' }}
              onClick={e => {
                if (e.target === e.currentTarget) setShowShare(false);
              }}
            >
              <div className="bg-base-100 border border-base-200 rounded-xl shadow-lg p-6 w-full max-w-xs relative animate-fade-in flex flex-col items-center" ref={shareRef}>
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 cursor-pointer" onClick={() => setShowShare(false)} aria-label="Close Share Modal">✕</button>
                <h3 className="text-lg font-bold mb-4 text-center">Share Blog</h3>
                <button
                  className="btn btn-ghost w-full flex items-center gap-2 justify-center text-base-content mb-2"
                  onClick={async () => {
                    await ensureConnections();
                    setShowChatModal(true);
                  }}
                >
                  💬 Share to Chat
                </button>
                <button className="btn btn-outline w-full mb-2" onClick={handleCopyLink}>
                  <FaLink className="mr-2" /> Copy Link
                </button>
                <div className="flex flex-col gap-2 w-full mb-2">
                  <a
                    className="btn btn-sm w-full flex items-center gap-2 justify-center bg-[#4267B2] text-white hover:bg-[#365899]"
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(blogUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
                    Facebook
                  </a>
                  <a
                    className="btn btn-sm w-full flex items-center gap-2 justify-center bg-[#1DA1F2] text-white hover:bg-[#0d8ddb]"
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(blogUrl)}&text=Check%20out%20this%20blog!`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195a4.916 4.916 0 0 0-8.38 4.482C7.691 8.095 4.066 6.13 1.64 3.161c-.542.929-.856 2.01-.857 3.17 0 2.188 1.115 4.116 2.823 5.247a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.058 0 14.009-7.496 14.009-13.986 0-.21 0-.423-.016-.634A9.936 9.936 0 0 0 24 4.557z"/></svg>
                    Twitter
                  </a>
                  <a
                    className="btn btn-sm w-full flex items-center gap-2 justify-center bg-[#25D366] text-white hover:bg-[#1ebe57]"
                    href={`https://wa.me/?text=${encodeURIComponent('Check out this blog: ' + blogUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.029-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.151-.174.2-.298.3-.497.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.077 4.363.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.617h-.001a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.987c-.003 5.451-4.437 9.885-9.888 9.885m8.413-18.297A11.815 11.815 0 0 0 12.05.001C5.495.001.06 5.436.058 12.002c0 2.123.555 4.199 1.607 6.032L.057 24l6.127-1.611a11.888 11.888 0 0 0 5.918 1.515h.005c6.554 0 11.889-5.435 11.891-12.001a11.82 11.82 0 0 0-3.48-8.413"/></svg>
                    WhatsApp
                  </a>
                  <a
                    className="btn btn-sm w-full flex items-center gap-2 justify-center bg-[#0077b5] text-white hover:bg-[#005983]"
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(blogUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.327-.027-3.037-1.849-3.037-1.851 0-2.132 1.445-2.132 2.939v5.667H9.358V9h3.414v1.561h.049c.476-.899 1.637-1.849 3.37-1.849 3.602 0 4.267 2.368 4.267 5.455v6.285zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.554V9h3.565v11.452zM22.225 0H1.771C.792 0 0 .771 0 1.723v20.549C0 23.229.792 24 1.771 24h20.451C23.2 24 24 23.229 24 22.271V1.723C24 .771 23.2 0 22.225 0z"/></svg>
                    LinkedIn
                  </a>
                </div>
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