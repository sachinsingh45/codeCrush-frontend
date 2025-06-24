import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comment, setComment] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // 'blog' or commentId

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
    try {
      await axios.post(`${BASE_URL}/blogs/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      toast.success("Blog liked!");
      fetchBlog();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to like blog");
    } finally {
      setActionLoading(false);
    }
  };

  const handleShare = async () => {
    setActionLoading(true);
    try {
      await axios.post(`${BASE_URL}/blogs/${id}/share`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      toast.success("Blog shared!");
      fetchBlog();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to share blog");
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
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        toast.success("Blog deleted!");
        navigate("/");
      } else {
        await axios.delete(`${BASE_URL}/blogs/${id}/comments/${deleteTarget}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
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
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
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
    try {
      await axios.post(`${BASE_URL}/blogs/${id}/comments/${commentId}/like`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      toast.success("Comment liked!");
      fetchBlog();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to like comment");
    } finally {
      setActionLoading(false);
    }
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
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-8 shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="mb-6">Are you sure you want to delete {deleteTarget === "blog" ? "this blog" : "this comment"}?</p>
            <div className="flex gap-4 justify-end">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => { setShowDeleteModal(false); setDeleteTarget(null); }}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
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
      <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
      <div className="flex items-center gap-2 mb-4">
        <img src={blog.author.photoUrl} alt={blog.author.firstName} className="w-10 h-10 rounded-full" />
        <span className="text-base font-medium">{blog.author.firstName} {blog.author.lastName}</span>
        <span className="text-xs text-gray-400 ml-auto">{new Date(blog.createdAt).toLocaleDateString()}</span>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {blog.tags.map((tag) => (
          <span key={tag} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">#{tag}</span>
        ))}
      </div>
      <div className="prose max-w-none mb-6">
        <p>{blog.content}</p>
      </div>
      <div className="flex items-center gap-4 mb-6 text-gray-600">
        <button
          className={`px-3 py-1 rounded flex items-center gap-2 ${likedByUser ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
          onClick={handleLike}
          disabled={actionLoading || !user}
        >
          {actionLoading ? <span className="loader inline-block w-4 h-4 border-2 border-blue-200 border-t-transparent rounded-full animate-spin"></span> : null}
          {likedByUser ? "Unlike" : "Like"} ({blog.likeCount || 0})
        </button>
        <button
          className="px-3 py-1 rounded bg-green-500 text-white flex items-center gap-2"
          onClick={handleShare}
          disabled={actionLoading || !user}
        >
          {actionLoading ? <span className="loader inline-block w-4 h-4 border-2 border-green-200 border-t-transparent rounded-full animate-spin"></span> : null}
          Share ({blog.shareCount || 0})
        </button>
        {isAuthor && (
          <button
            className="px-3 py-1 rounded bg-red-500 text-white flex items-center gap-2"
            onClick={() => confirmDelete("blog")}
            disabled={actionLoading}
          >
            {actionLoading && deleteTarget === "blog" ? <span className="loader inline-block w-4 h-4 border-2 border-red-200 border-t-transparent rounded-full animate-spin"></span> : null}
            Delete
          </button>
        )}
        <span className="ml-auto">💬 {blog.commentCount || 0} | {blog.readTime} min read</span>
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
            className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center gap-2"
            disabled={actionLoading || !comment.trim()}
          >
            {actionLoading ? <span className="loader inline-block w-4 h-4 border-2 border-blue-200 border-t-transparent rounded-full animate-spin"></span> : null}
            Comment
          </button>
        </form>
      )}
      {/* Comments Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        {blog.comments && blog.comments.length > 0 ? (
          <div className="space-y-4">
            {blog.comments.map((comment) => {
              const likedComment = comment.likes?.some(like => like.user._id === user?._id);
              const canDelete = user && (user._id === comment.user._id || isAuthor);
              return (
                <div key={comment._id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <img src={comment.user.photoUrl} alt={comment.user.firstName} className="w-7 h-7 rounded-full" />
                    <span className="font-medium text-sm">{comment.user.firstName} {comment.user.lastName}</span>
                    <span className="text-xs text-gray-400 ml-auto">{new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-800 text-sm mb-2">{comment.content}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <button
                      className={`px-2 py-1 rounded flex items-center gap-2 ${likedComment ? "bg-blue-400 text-white" : "bg-gray-200 text-gray-700"}`}
                      onClick={() => handleLikeComment(comment._id)}
                      disabled={actionLoading || !user}
                    >
                      {actionLoading ? <span className="loader inline-block w-4 h-4 border-2 border-blue-200 border-t-transparent rounded-full animate-spin"></span> : null}
                      {likedComment ? "Unlike" : "Like"} ({comment.likes?.length || 0})
                    </button>
                    {canDelete && (
                      <button
                        className="px-2 py-1 rounded bg-red-400 text-white flex items-center gap-2"
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
          <div className="text-gray-500">No comments yet.</div>
        )}
      </div>
    </div>
  );
};

export default BlogDetails; 