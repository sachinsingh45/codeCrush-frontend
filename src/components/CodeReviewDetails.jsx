import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Spinner from "./Spinner";
import { FaShareAlt, FaLink, FaPaperPlane, FaTrash } from "react-icons/fa";
import Highlight, { defaultProps } from "prism-react-renderer";
import dracula from "prism-react-renderer/themes/dracula";
import duotoneLight from "prism-react-renderer/themes/duotoneLight";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import { createSocketConnection } from "../utils/socket";
import { addConnections } from "../utils/connectionSlice";
import MarkdownWithHighlight from "./MarkdownWithHighlight";
import useTheme from "../utils/useTheme";

const CodeReviewDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user.user);
  const [snippet, setSnippet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const { connections = [] } = useSelector((store) => store.connections);
  const dispatch = useDispatch();
  const [fetchingConnections, setFetchingConnections] = useState(false);
  const shareRef = useRef(null);
  const snippetUrl = window.location.href;
  const theme = useTheme();
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ code: '', description: '', tags: '', language: 'javascript' });

  const fetchSnippet = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${BASE_URL}/code-review/snippet/${id}`);
      if (!res.data.snippet) {
        toast.error("No code snippet found for this review.");
        setSnippet(null);
        setError("No code snippet found for this review.");
        return;
      }
      setSnippet(res.data.snippet);
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to load snippet";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSnippet();
    setAiSummary(null);
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    if (snippet && editing) {
      setEditForm({
        code: snippet.code || '',
        description: snippet.description || '',
        tags: (snippet.tags || []).join(','),
        language: snippet.language || 'javascript',
      });
    }
  }, [snippet, editing]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute('data-theme'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  // Add review
  const handleAddReview = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    try {
      await axios.post(`${BASE_URL}/code-review/snippet/${snippet._id}/review`, { review: reviewText }, { withCredentials: true });
      setReviewText("");
      fetchSnippet();
      toast.success("Review added successfully!");
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to add review";
      setError(msg);
      toast.error(msg);
    } finally {
      setReviewLoading(false);
    }
  };

  // Upvote review
  const handleUpvote = async (reviewId) => {
    setReviewLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/code-review/review/${reviewId}/upvote`, {}, { withCredentials: true });
      fetchSnippet();
      toast.success(res.data.message);
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to upvote";
      setError(msg);
      toast.error(msg);
    } finally {
      setReviewLoading(false);
    }
  };

  // Check if there are enough reviews for AI summary
  const canGenerateAISummary = snippet?.reviews?.length >= 3;
  const reviewsNeeded = 3 - (snippet?.reviews?.length || 0);

  // Generate AI summary
  const handleAISummary = async () => {
    if (!canGenerateAISummary) {
      toast.warning(`You need ${reviewsNeeded} more review(s) to generate an AI summary.`);
      return;
    }
    
    setAiLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/code-review/snippet/${snippet._id}/ai-summary`, 
        {}, 
        { withCredentials: true }
      );
      setAiSummary(res.data.summary);
      toast.success("AI summary generated!");
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to generate summary";
      setError(msg);
      toast.error(msg);
    } finally {
      setAiLoading(false);
    }
  };

  // Share logic
  const handleCopyLink = () => {
    navigator.clipboard.writeText(snippetUrl);
    toast.success("Link copied to clipboard!");
    setShowShare(false);
  };

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

  // Add delete review handler
  const handleDeleteReview = async (reviewId) => {
    setReviewLoading(true);
    try {
      await axios.delete(`${BASE_URL}/code-review/review/${reviewId}`, { withCredentials: true });
      fetchSnippet();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete review");
    } finally {
      setReviewLoading(false);
    }
  };

  // Ensure connections are loaded
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

  const handleShareToChat = (targetUserId) => {
    const userId = user?._id;
    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: `Check out this code review: ${snippetUrl}`,
    });
    setShowChatModal(false);
    setShowShare(false);
    toast.success("Code review link sent to chat!");
  };

  // Only keep this useEffect for API errors
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  // Edit snippet handler
  const handleEditSnippet = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        code: editForm.code,
        description: editForm.description,
        tags: editForm.tags.split(',').map(t => t.trim()).filter(Boolean),
        language: editForm.language,
      };
      await axios.put(`${BASE_URL}/code-review/snippet/${snippet._id}`, payload, { withCredentials: true });
      setEditing(false);
      fetchSnippet();
      toast.success('Snippet updated!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update snippet');
    } finally {
      setLoading(false);
    }
  };

  // Upvote snippet handler (toggle)
  const handleUpvoteSnippet = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/code-review/snippet/${snippet._id}/upvote`, {}, { withCredentials: true });
      fetchSnippet();
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to upvote snippet');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-[300px]"><Spinner size={48} /></div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!snippet) return <div className="text-center text-base-content mt-10">No code snippet found for this review. Please check the link or try another snippet.</div>;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <button className="btn btn-sm btn-ghost mb-4" onClick={() => navigate(-1)}>
        ← Back to all snippets
      </button>
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold text-base-content">Code Review</h1>
        <div className="flex gap-2">
          <button className="btn btn-ghost btn-sm" onClick={() => setShowShare((v) => !v)}>
            <FaShareAlt className="text-lg" /> Share
          </button>
        </div>
      </div>
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
            <h3 className="text-lg font-bold mb-4 text-center">Share Code Review</h3>
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
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(snippetUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
                Facebook
              </a>
              <a
                className="btn btn-sm w-full flex items-center gap-2 justify-center bg-[#1DA1F2] text-white hover:bg-[#0d8ddb]"
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(snippetUrl)}&text=Check%20out%20this%20code%20review!`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195a4.916 4.916 0 0 0-8.38 4.482C7.691 8.095 4.066 6.13 1.64 3.161c-.542.929-.856 2.01-.857 3.17 0 2.188 1.115 4.116 2.823 5.247a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.058 0 14.009-7.496 14.009-13.986 0-.21 0-.423-.016-.634A9.936 9.936 0 0 0 24 4.557z"/></svg>
                Twitter
              </a>
              <a
                className="btn btn-sm w-full flex items-center gap-2 justify-center bg-[#25D366] text-white hover:bg-[#1ebe57]"
                href={`https://wa.me/?text=${encodeURIComponent('Check out this code review: ' + snippetUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.029-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.151-.174.2-.298.3-.497.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.077 4.363.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.617h-.001a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.987c-.003 5.451-4.437 9.885-9.888 9.885m8.413-18.297A11.815 11.815 0 0 0 12.05.001C5.495.001.06 5.436.058 12.002c0 2.123.555 4.199 1.607 6.032L.057 24l6.127-1.611a11.888 11.888 0 0 0 5.918 1.515h.005c6.554 0 11.889-5.435 11.891-12.001a11.82 11.82 0 0 0-3.48-8.413"/></svg>
                WhatsApp
              </a>
              <a
                className="btn btn-sm w-full flex items-center gap-2 justify-center bg-[#0077b5] text-white hover:bg-[#005983]"
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(snippetUrl)}`}
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
      <div className="flex items-center gap-2 mb-2">
        {snippet.author?.photoUrl && (
          <img
            src={snippet.author.photoUrl}
            alt={snippet.author?.firstName}
            className="w-10 h-10 rounded-full cursor-pointer border-2 border-primary"
            onClick={() => snippet.author?._id && navigate(`/users/${snippet.author._id}`)}
            title="View Profile"
          />
        )}
        <span
          className="text-base font-bold text-base-content cursor-pointer hover:underline"
          onClick={() => snippet.author?._id && navigate(`/users/${snippet.author._id}`)}
          title="View Profile"
        >
          {snippet.author?.firstName} {snippet.author?.lastName}
        </span>
        <span className="text-xs text-base-content ml-auto">{new Date(snippet.createdAt).toLocaleString()}</span>
        {user && snippet.author && user._id === snippet.author._id && !editing && (
          <button className="btn btn-xs btn-warning ml-2" onClick={() => setEditing(true)}>Edit</button>
        )}
      </div>
      {editing ? (
        <form onSubmit={handleEditSnippet} className="mb-4 card bg-base-100 p-4 border border-base-200 rounded-xl">
          <textarea
            className="textarea textarea-bordered w-full mb-2"
            rows={6}
            placeholder="Edit your code..."
            value={editForm.code}
            onChange={e => setEditForm({ ...editForm, code: e.target.value })}
            required
          />
          <input
            className="input input-bordered w-full mb-2"
            placeholder="Edit description"
            value={editForm.description}
            onChange={e => setEditForm({ ...editForm, description: e.target.value })}
          />
          <input
            className="input input-bordered w-full mb-2"
            placeholder="Edit tags (comma separated)"
            value={editForm.tags}
            onChange={e => setEditForm({ ...editForm, tags: e.target.value })}
          />
          <select
            className="select select-bordered w-full mb-2"
            value={editForm.language}
            onChange={e => setEditForm({ ...editForm, language: e.target.value })}
            required
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="c">C</option>
            <option value="cpp">C++</option>
            <option value="csharp">C#</option>
            <option value="typescript">TypeScript</option>
            <option value="go">Go</option>
            <option value="ruby">Ruby</option>
            <option value="php">PHP</option>
            <option value="swift">Swift</option>
            <option value="kotlin">Kotlin</option>
            <option value="rust">Rust</option>
            <option value="scala">Scala</option>
            <option value="other">Other</option>
          </select>
          <div className="flex gap-2 justify-end">
            <button className="btn btn-success" type="submit" disabled={loading}>{loading ? <Spinner size={20} /> : 'Save'}</button>
            <button className="btn btn-ghost" type="button" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </form>
      ) : null}
      {/* Language badge */}
      {snippet.language && (
        <span className="badge badge-accent badge-outline text-xs mb-2">{snippet.language}</span>
      )}
      <Highlight {...defaultProps} code={snippet.code} language={snippet.language || "javascript"} theme={theme === 'lemonade' ? duotoneLight : dracula}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className + " rounded p-3 text-sm overflow-x-auto mb-2 bg-base-200 border border-base-300"} style={style}>
            {tokens.map((line, i) => {
              const { key: divKey, ...divProps } = getLineProps({ line, key: i });
              return (
                <div key={divKey} {...divProps}>
                  {line.map((token, key) => {
                    const { key: spanKey, ...spanProps } = getTokenProps({ token, key });
                    return <span key={spanKey} {...spanProps} />;
                  })}
                </div>
              );
            })}
          </pre>
        )}
      </Highlight>
      {/* Tags */}
      {snippet.tags && snippet.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {snippet.tags.map((tag, idx) => (
            <span key={idx} className="badge badge-primary text-xs">#{tag}</span>
          ))}
        </div>
      )}
      {/* Upvote snippet button */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-secondary font-bold">Upvotes: {snippet.upvotes || 0}</span>
        {user && snippet.author && user._id !== snippet.author._id && (
          <button
            className={`btn btn-xs ${snippet.upvotedBy && snippet.upvotedBy.includes(user._id) ? 'btn-success' : 'btn-secondary btn-outline'}`}
            onClick={handleUpvoteSnippet}
            disabled={loading}
          >
            {snippet.upvotedBy && snippet.upvotedBy.includes(user._id) ? '👍 Un-upvote' : '👍 Upvote'}
          </button>
        )}
      </div>
      <div className="text-base-content font-semibold mb-1">{snippet.description}</div>
      {snippet.reviews?.length < 3 && (
        <div className="alert alert-warning mb-2">
          AI summary can only be generated if there are at least 3 reviews present.
        </div>
      )}
      {aiSummary && (
        <div className="alert alert-info mb-4">
          <div>
            <span className="font-bold">AI Summary:</span> {aiSummary}
          </div>
        </div>
      )}
      <div className="relative inline-block">
        <button
          className={`btn ${aiLoading || !snippet.reviews || snippet.reviews.length < 3 ? 'btn-disabled' : 'btn-info'} mb-4`}
          onClick={handleAISummary}
          disabled={aiLoading || !snippet.reviews || snippet.reviews.length < 3}
          title={!snippet.reviews || snippet.reviews.length < 3 ? `AI summary requires at least 3 reviews (${snippet.reviews?.length || 0}/3)` : 'Generate AI summary'}
        >
          {aiLoading ? (
            <span className="flex items-center gap-2">
              <span className="loading loading-spinner loading-sm"></span>
              Generating...
            </span>
          ) : !snippet.reviews || snippet.reviews.length < 3 ? (
            `Need ${3 - (snippet.reviews?.length || 0)} more reviews`
          ) : aiSummary ? (
            'Regenerate AI Summary'
          ) : (
            'Generate AI Summary'
          )}
        </button>
        {(!snippet.reviews || snippet.reviews.length < 3) && (
          <div className="absolute z-10 mt-2 w-64 p-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-md shadow-lg">
            AI summary requires at least 3 reviews. Currently has {snippet.reviews?.length || 0} review(s).
          </div>
        )}
      </div>
      <h2 className="text-xl font-bold mt-4 mb-2">Reviews</h2>
      <div className="space-y-4 mb-4">
        {snippet.reviews?.length === 0 && (
          <div className="text-base-content text-center py-4 italic">No reviews yet. Be the first to add one!</div>
        )}
        {snippet.reviews?.map((review) => (
          <div
            key={review._id}
            className="relative group p-0 bg-transparent rounded-2xl flex items-stretch gap-0"
            style={{ minHeight: '110px' }}
          >
            {/* Accent bar */}
            <div className="rounded-l-2xl bg-primary opacity-70 group-hover:opacity-100 transition-all w-1" />
            <div className="flex-1">
              <div className="p-4 bg-base-100/90 dark:bg-base-300/60 rounded-r-2xl shadow-md border border-base-200 h-full flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:bg-base-200/90 dark:hover:bg-base-300/80">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <img
                      src={review.reviewer?.photoUrl || "/default-avatar.png"}
                      alt={review.reviewer?.firstName}
                      className="w-7 h-7 rounded-full cursor-pointer border-2 border-secondary"
                      onClick={() => review.reviewer?._id && navigate(`/users/${review.reviewer._id}`)}
                      title="View Profile"
                    />
                    <span
                      className="cursor-pointer hover:underline font-semibold text-base-content"
                      onClick={() => review.reviewer?._id && navigate(`/users/${review.reviewer._id}`)}
                      title="View Profile"
                    >
                      {review.reviewer?.firstName} {review.reviewer?.lastName}
                    </span>
                  </div>
                  <div className="text-sm text-base-content mb-1">
                    <MarkdownWithHighlight content={review.review} />
                  </div>
                </div>
                <div>
                  <div className="mb-2">
                    <span className="inline-block bg-primary/10 dark:bg-accent/20 text-primary-content dark:text-accent-content px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                      {new Date(review.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      className={`btn btn-xs ${review.upvotedBy && review.upvotedBy.includes(user._id) ? 'btn-success' : 'btn-primary btn-outline'}`}
                      onClick={() => handleUpvote(review._id)}
                      disabled={reviewLoading}
                    >
                      {review.upvotedBy && review.upvotedBy.includes(user._id) ? '👍 Un-upvote' : '👍 Upvote'}
                    </button>
                    <span className="badge badge-outline text-xs">Upvotes: {review.upvotes}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {user && (
        <form onSubmit={handleAddReview} className="flex flex-col md:flex-row gap-2 mt-4 items-end md:items-baseline">
          <div className="flex-1 flex flex-col">
            <textarea
              className="textarea textarea-bordered min-h-[120px] md:min-h-[120px]"
              placeholder="Write your review... (Markdown supported, use ``` for code blocks)"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              required
            />
            <div className="text-xs text-base-content mt-1">You can use <b>Markdown</b> (including <code>```</code> for code blocks).</div>
          </div>
          <button className="btn btn-primary w-full md:w-auto" type="submit" disabled={reviewLoading}>
            {reviewLoading ? <Spinner size={20} /> : "Add Review"}
          </button>
        </form>
      )}
    </div>
  );
};

export default CodeReviewDetails; 