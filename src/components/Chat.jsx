import { useEffect, useState, useRef, Fragment } from "react"; 
import { useParams, useNavigate } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addConnections, setConnectionLoading, setConnectionError } from "../utils/connectionSlice";
import { FaBars, FaExternalLinkAlt, FaSpinner } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaRegSadTear, FaCommentSlash } from "react-icons/fa"; 
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Footer from "./Footer";
import Highlight, { defaultProps } from "prism-react-renderer";
import dracula from "prism-react-renderer/themes/dracula";
import duotoneLight from "prism-react-renderer/themes/duotoneLight";
import { format, isToday, isYesterday, isSameDay } from "date-fns";

const Chat = () => {
  const { targetUserId: paramTargetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(paramTargetUserId || null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [blogPreviews, setBlogPreviews] = useState({});
  const [search, setSearch] = useState("");
  const [codeReviewPreviews, setCodeReviewPreviews] = useState({});

  const user = useSelector((store) => store.user.user);
  const { connections = [] } = useSelector((store) => store.connections);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userId = user?._id;

  // Track which blogs have been shared in this session (to avoid double increment)
  const [sharedInSession, setSharedInSession] = useState({});
  const [shareLoadingBlogId, setShareLoadingBlogId] = useState(null);

  const messagesEndRef = useRef(null);

  // Responsive state for mobile/desktop
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchConnections = async () => {
    dispatch(setConnectionLoading(true));
    try {
      const res = await axios.get(`${BASE_URL}/user/connections`, {
        withCredentials: true,
      });
      if (res.data?.data) {
        dispatch(addConnections(res.data.data));
      } else {
        dispatch(setConnectionError("No connections data received"));
      }
    } catch (err) {
      console.error("Connections fetch error:", err);
      dispatch(setConnectionError(err.message || "Failed to load connections"));
    }
  };

  const fetchChatMessages = async (targetUserId) => {
    try {
      const chat = await axios.get(`${BASE_URL}/chat/${targetUserId}`, {
        withCredentials: true,
      });
      const chatMessages = chat?.data?.messages.map((msg) => ({
        firstName: msg.senderId?.firstName,
        lastName: msg.senderId?.lastName,
        text: msg.text,
        createdAt: msg.createdAt,
      }));
      setMessages(chatMessages);
    } catch (err) {
      console.error("Error fetching chat:", err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, [dispatch]);

  useEffect(() => {
    if (selectedUserId) {
      fetchChatMessages(selectedUserId);
    }
  }, [selectedUserId]);

  useEffect(() => {
    if (!userId || !selectedUserId) return;

    const socket = createSocketConnection();
    socket.emit("joinChat", {
      userId,
      targetUserId: selectedUserId,
    });

    socket.on("messageReceived", ({ firstName, lastName, text, createdAt }) => {
      setMessages((prev) => {
        if (firstName === user.firstName) {
          // This is a confirmation of a message sent by the current user
          const idx = prev.findIndex(
            (msg) => msg.pending && msg.text === text && msg.firstName === firstName
          );
          if (idx !== -1) {
            const newMsgs = [...prev];
            newMsgs[idx] = { firstName, lastName, text, createdAt };
            return newMsgs;
          }
        } else {
          // This is a new message from the other user
          return [...prev, { firstName, lastName, text, createdAt }];
        }
        // If it's a self-message but no pending version is found, do nothing to avoid duplicates
        return prev;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, selectedUserId]);

  const [pendingMessages, setPendingMessages] = useState([]);

  const formatWhatsAppDate = (dateString) => {
    let date;
    try {
      date = dateString ? new Date(dateString) : new Date();
      if (isNaN(date.getTime())) throw new Error('Invalid date');
    } catch {
      date = new Date();
    }
    if (isToday(date)) {
      return format(date, "p"); // 2:45 PM
    } else if (isYesterday(date)) {
      return `Yesterday, ${format(date, "p")}`;
    } else {
      return format(date, "dd/MM/yyyy, p");
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const tempId = Date.now() + Math.random();
    const pendingMsg = {
      firstName: user.firstName,
      lastName: user.lastName,
      text: newMessage,
      createdAt: new Date().toISOString(),
      _tempId: tempId,
      pending: true,
    };
    setMessages((prev) => [...prev, pendingMsg]);
    setPendingMessages((prev) => [...prev, tempId]);
    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId: selectedUserId,
      text: newMessage,
    });
    setNewMessage("");
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage(); 
    }
  };
  const getConnectionName = (selectedUserId) => {
    if (Array.isArray(connections) && connections.length > 0) {
      const selectedConnection = connections.find((c) => c._id === selectedUserId);
      return selectedConnection
        ? `${selectedConnection.firstName} ${selectedConnection.lastName}`
        : "User";
    }
    return "User";
  };

  // Helper to detect and extract blog link from message
  const parseBlogLink = (text) => {
    const match = text.match(/Check out this blog: (https?:\/\/[^\s]+)/);
    if (match) {
      return match[1];
    }
    return null;
  };

  // Helper to detect and extract code review link from message
  const parseCodeReviewLink = (text) => {
    const match = text.match(/Check out this code review: (https?:\/\/[^\s]+)/);
    if (match) {
      return match[1];
    }
    return null;
  };

  // Helper to extract blog ID from URL
  const extractBlogId = (url) => {
    const match = url.match(/\/blogs\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  };

  // Helper to extract code review snippet ID from URL
  const extractSnippetId = (url) => {
    const match = url.match(/\/code-review\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  };

  // Fetch blog and code review previews if needed
  useEffect(() => {
    // Blog previews
    const blogLinks = messages
      .map((msg) => parseBlogLink(msg.text))
      .filter(Boolean);
    blogLinks.forEach(async (link) => {
      const blogId = extractBlogId(link);
      if (blogId && !blogPreviews[blogId]) {
        setBlogPreviews((prev) => ({ ...prev, [blogId]: { loading: true } }));
        try {
          const res = await axios.get(`${BASE_URL}/blogs/${blogId}`);
          setBlogPreviews((prev) => ({ ...prev, [blogId]: { loading: false, data: res.data.data } }));
        } catch (err) {
          console.error("Error loading blog preview:", err);
          setBlogPreviews((prev) => ({ ...prev, [blogId]: { loading: false, error: true } }));
        }
      }
    });
    // Code review previews
    const snippetLinks = messages
      .map((msg) => parseCodeReviewLink(msg.text))
      .filter(Boolean);
    snippetLinks.forEach(async (link) => {
      const snippetId = extractSnippetId(link);
      if (snippetId && !codeReviewPreviews[snippetId]) {
        setCodeReviewPreviews((prev) => ({ ...prev, [snippetId]: { loading: true } }));
        try {
          const res = await axios.get(`${BASE_URL}/code-review/snippet/${snippetId}`);
          setCodeReviewPreviews((prev) => ({ ...prev, [snippetId]: { loading: false, data: res.data.snippet } }));
        } catch (err) {
          console.error("Error loading code review preview:", err);
          setCodeReviewPreviews((prev) => ({ ...prev, [snippetId]: { loading: false, error: true } }));
        }
      }
    });
    // eslint-disable-next-line
  }, [messages]);

  // Filtered connections for search
  const filteredConnections = Array.isArray(connections)
    ? connections.filter(
        (conn) =>
          conn.firstName.toLowerCase().includes(search.toLowerCase()) ||
          conn.lastName.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  // Auto-open sidebar on mobile if no connections
  useEffect(() => {
    if (Array.isArray(connections) && connections.length === 0 && window.innerWidth < 640) {
      setIsSidebarOpen(true);
    }
  }, [connections]);

  // Auto-open sidebar on mobile if no chat is selected
  useEffect(() => {
    if (!selectedUserId && window.innerWidth < 640) {
      setIsSidebarOpen(true);
    }
  }, [selectedUserId]);

  // Handle blog card click in chat
  const handleBlogCardClick = async (blogId) => {
    if (!blogId) return;
    if (!sharedInSession[blogId]) {
      setShareLoadingBlogId(blogId);
      try {
        await axios.post(`${BASE_URL}/blogs/${blogId}/share`, {}, { withCredentials: true });
        setBlogPreviews((prev) => ({
          ...prev,
          [blogId]: {
            ...prev[blogId],
            data: {
              ...prev[blogId].data,
              shareCount: (prev[blogId].data.shareCount || 0) + 1,
            },
          },
        }));
        setSharedInSession((prev) => ({ ...prev, [blogId]: true }));
      } catch (err) {
        console.error("Error sharing blog:", err);
      }
      setShareLoadingBlogId(null);
    }
    navigate(`/blogs/${blogId}`);
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, selectedUserId]);

  // Sync selectedUserId with URL param
  useEffect(() => {
    if (typeof paramTargetUserId !== 'undefined' && paramTargetUserId !== selectedUserId) {
      setSelectedUserId(paramTargetUserId);
    }
  }, [paramTargetUserId]);

  // WhatsApp-style date separator
  const getDateSeparatorLabel = (date) => {
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "d MMM yyyy");
  };

  // WhatsApp-style time under message
  const getTimeLabel = (date) => format(date, "p");

  // Online status and unseen counts removed to simplify chat

  // Removed online/offline and unseen listeners

  // Removed markAsSeen emitter

  return (
    <div>
      <div className="w-full h-[88vh] flex bg-base-200/80 dark:bg-base-200/80 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md" style={{ minHeight: '88vh', maxHeight: '88vh', overflow: 'hidden' }}>
        {/* Friends List (always visible on desktop, toggled on mobile) */}
        {(!isMobile || !selectedUserId) && (
          <aside
            className={`flex flex-col w-full sm:w-1/4 max-w-xs p-0 border-r border-gray-200 dark:border-gray-700 rounded-r-2xl bg-base-100/80 dark:bg-base-200/80 shadow-lg h-full z-10 ${isMobile ? 'items-center justify-center px-0 py-0' : ''}`}
            style={{ maxHeight: '88vh', overflow: 'hidden' }}
          >
            <div className={`p-4 pb-2 border-b border-gray-200 dark:border-gray-700 bg-base-100/90 dark:bg-base-200/90 rounded-tr-2xl w-full ${isMobile ? 'flex flex-col items-center' : ''}`}>
              <h2 className="text-lg font-bold text-primary-content mb-2 tracking-wide w-full text-center">Chats</h2>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search connections..."
                className="input input-bordered w-full rounded-full bg-base-100 dark:bg-base-200 text-base-content text-sm"
              />
            </div>
            <div className={`space-y-2 flex-1 overflow-y-auto pr-1 custom-scrollbar pt-2 w-full ${isMobile ? 'px-2' : ''}`}>
              {filteredConnections.length > 0 ? (
                filteredConnections.map((conn) => (
                  <div
                    key={conn._id}
                    onClick={() => {
                      navigate(`/chat/${conn._id}`);
                      setSelectedUserId(conn._id);
                    }}
                    className={`flex items-center gap-3 cursor-pointer rounded-xl px-3 py-3 transition-all duration-200 text-primary-content w-full ${selectedUserId === conn._id ? "bg-primary text-primary-content shadow scale-100" : "hover:bg-accent hover:text-accent-content dark:hover:bg-base-300 dark:hover:text-base-content"}`}
                    style={isMobile ? { justifyContent: 'flex-start' } : {}}
                  >
                    <img
                      src={conn.photoUrl || "/default-avatar.png"}
                      alt="Profile"
                      className="w-12 h-12 rounded-full border border-primary shadow bg-base-100 dark:bg-base-200 object-cover"
                    />
                    <span className="font-semibold text-primary-content  text-lg">
                      {conn.firstName} {conn.lastName}
                    </span>
                    {/* Unseen counts and online indicators removed */}
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-3/4 text-center text-base-content">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/4076/4076581.png"
                    alt="No Connections"
                    className="w-32 h-32 mb-4 opacity-90"
                  />
                  <h1 className="text-xl font-semibold mb-2">No Connections Found!</h1>
                  <p className="text-base-content mb-4">Start exploring and connect with amazing people.</p>
                  <Link to="/">
                    <button className="btn btn-primary px-4 py-2 rounded-lg text-base shadow hover:scale-105 transition">
                      Explore Now
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </aside>
        )}
        {/* Chat Area (show on desktop always, on mobile only if a friend is selected) */}
        {(!isMobile || selectedUserId) && (
          <main className={`flex-1 flex flex-col w-full sm:w-3/4 p-0 md:p-4 bg-base-100/80 dark:bg-base-200/80 rounded-l-2xl h-full relative border-l border-gray-200 dark:border-gray-700 ${isMobile ? 'min-h-[88vh] max-h-[88vh]' : ''}`} style={{ maxHeight: '88vh', overflow: 'hidden' }}>
            {/* Sticky Chat Header */}
            <div className="sticky top-0 z-10 p-3 border-b border-gray-200 dark:border-gray-600 bg-base-100/90 dark:bg-base-200/90 flex items-center gap-3 rounded-tl-2xl shadow-sm justify-between">
              <div className="flex items-center gap-3">
                {/* Mobile back button */}
                {isMobile && selectedUserId && (
                  <button
                    className="btn btn-circle btn-outline btn-sm mr-2 flex items-center justify-center border-primary text-primary hover:bg-primary hover:text-white transition"
                    style={{ minWidth: 36, minHeight: 36 }}
                    onClick={() => {
                      navigate('/chat');
                      setSelectedUserId(null);
                    }}
                    aria-label="Back to friends list"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                {selectedUserId && (
                  <img
                    src={filteredConnections.find(c => c._id === selectedUserId)?.photoUrl || "/default-avatar.png"}
                    alt="Profile"
                    className="w-8 h-8 rounded-full border border-primary shadow bg-base-100 dark:bg-base-200 object-cover relative"
                  />
                )}
                <h1 className="text-lg font-bold text-primary-content dark:text-base-content tracking-wide">
                  {selectedUserId ? (
                    <Link
                      to={`/users/${selectedUserId}`}
                      className="hover:underline hover:text-primary transition-colors duration-200"
                    >
                      {getConnectionName(selectedUserId)}
                    </Link>
                  ) : (
                    "Select a Connection"
                  )}
                </h1>
              </div>
              {/* Online indicator removed */}
            </div>
            {/* Show No Connections state in chat area if no connections and no chat selected */}
            {Array.isArray(connections) && connections.length === 0 && !selectedUserId && (
              <div className="flex flex-col items-center justify-center flex-1 text-center text-base-content">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/4076/4076581.png"
                  alt="No Connections"
                  className="w-32 h-32 mb-4 opacity-90"
                />
                <h1 className="text-xl font-semibold mb-2">No Connections Found!</h1>
                <p className="text-base-content mb-4">Start exploring and connect with amazing people.</p>
                <Link to="/">
                  <button className="btn btn-primary px-4 py-2 rounded-lg text-base shadow hover:scale-105 transition">
                    Explore Now
                  </button>
                </Link>
              </div>
            )}
            <div className="flex-1 overflow-y-auto flex flex-col gap-3 p-2 md:p-4 custom-scrollbar bg-base-100/80 dark:bg-base-200/80" style={{ minHeight: 0 }}>
              {messages.length > 0 ? (
                (() => {
                  let lastDate = null;
                  return messages.reduce((elements, msg, index) => {
                    const msgDate = msg.createdAt ? new Date(msg.createdAt) : new Date();
                    let showDateSeparator = false;
                    if (!lastDate || !isSameDay(msgDate, lastDate)) {
                      showDateSeparator = true;
                      lastDate = msgDate;
                    }
                    const blogLink = parseBlogLink(msg.text);
                    const codeReviewLink = parseCodeReviewLink(msg.text);
                    // Blog preview
                    if (blogLink) {
                      const blogId = extractBlogId(blogLink);
                      const preview = blogPreviews[blogId];
                      elements.push(
                        <Fragment key={`blog-${index}`}>
                          {showDateSeparator && (
                            <div className="flex justify-center my-2">
                              <span className="badge badge-ghost px-3 py-1 text-xs font-semibold shadow">
                                {getDateSeparatorLabel(msgDate)}
                              </span>
                            </div>
                          )}
                          <div className={`chat ${user.firstName === msg.firstName ? "chat-end" : "chat-start"} transition-all duration-200`}>
                            <div
                              className="chat-bubble bg-base-100 dark:bg-base-200 border border-primary shadow p-0 overflow-hidden max-w-xs md:max-w-sm cursor-pointer hover:shadow-lg hover:scale-[1.01] transition-all rounded-xl"
                              onClick={() => handleBlogCardClick(blogId)}
                              tabIndex={0}
                              role="button"
                              aria-label="View blog details"
                            >
                              {(!preview || preview.loading) ? (
                                <div className="p-3">
                                  <Skeleton height={18} width={"70%"} className="mb-1" />
                                  <Skeleton height={12} width={"50%"} className="mb-1" />
                                  <Skeleton height={80} className="rounded mb-1" />
                                </div>
                              ) : preview.error ? (
                                <div className="p-3 text-error text-sm">Failed to load blog preview.</div>
                              ) : (
                                <div className="flex flex-col gap-1 p-3">
                                  <div className="font-semibold text-base-content dark:text-base-content mb-1 flex items-center gap-2">
                                    <img src={preview.data.author.photoUrl} alt="author" className="w-6 h-6 rounded-full border border-primary" />
                                    {preview.data.author.firstName} {preview.data.author.lastName}
                                  </div>
                                  {preview.data.featuredImage && (
                                    <img src={preview.data.featuredImage} alt={preview.data.title} className="w-full h-16 object-cover rounded mb-1" />
                                  )}
                                  <div className="text-base font-bold text-base-content dark:text-base-content line-clamp-2 mb-1">{preview.data.title}</div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-1">{preview.data.content.slice(0, 60)}...</div>
                                  <div className="flex gap-1 flex-wrap mb-1">
                                    {preview.data.tags.map((tag) => (
                                      <span key={tag} className="badge badge-primary text-xs">#{tag}</span>
                                    ))}
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                    <span>👍 {preview.data.likeCount || 0}</span>
                                    <span>💬 {preview.data.commentCount || 0}</span>
                                    <span>🔗 {preview.data.shareCount || 0} {shareLoadingBlogId === blogId && <span className="loading loading-spinner loading-xs ml-1"></span>}</span>
                                    <span className="ml-auto">⏱ {preview.data.readTime} min</span>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="chat-footer text-xs text-gray-400 dark:text-gray-500 mt-1 text-left">
                              {getTimeLabel(msgDate)}
                            </div>
                          </div>
                        </Fragment>
                      );
                      return elements;
                    }
                    // Code review preview
                    if (codeReviewLink) {
                      const snippetId = extractSnippetId(codeReviewLink);
                      const preview = codeReviewPreviews[snippetId];
                      elements.push(
                        <Fragment key={`code-${index}`}>
                          {showDateSeparator && (
                            <div className="flex justify-center my-2">
                              <span className="badge badge-ghost px-3 py-1 text-xs font-semibold shadow">
                                {getDateSeparatorLabel(msgDate)}
                              </span>
                            </div>
                          )}
                          <div className={`chat ${user.firstName === msg.firstName ? "chat-end" : "chat-start"} transition-all duration-200`}>
                            <div
                              className="chat-bubble bg-base-100 dark:bg-base-200 border border-purple-500 shadow p-0 overflow-hidden max-w-xs md:max-w-sm cursor-pointer hover:shadow-lg hover:scale-[1.01] transition-all rounded-xl relative"
                              onClick={() => snippetId && navigate(`/code-review/${snippetId}`)}
                              tabIndex={0}
                              role="button"
                              aria-label="View code review details"
                            >
                              {(!preview || preview.loading) ? (
                                <div className="p-3">
                                  <Skeleton height={18} width={"70%"} className="mb-1" />
                                  <Skeleton height={12} width={"50%"} className="mb-1" />
                                  <Skeleton height={80} className="rounded mb-1" />
                                </div>
                              ) : preview.error ? (
                                <div className="p-3 text-error text-sm">Failed to load code review preview.</div>
                              ) : (
                                <div className="flex flex-col gap-1 p-3">
                                  <div className="flex items-center gap-2 mb-1">
                                    <img src={preview.data.author.photoUrl} alt="author" className="w-6 h-6 rounded-full border border-purple-500" />
                                    <span className="font-semibold text-base-content dark:text-base-content">{preview.data.author?.firstName} {preview.data.author?.lastName}</span>
                                    <span className="text-xs text-gray-400 ml-auto">{new Date(preview.data.createdAt).toLocaleDateString()}</span>
                                  </div>
                                  <div className="mb-1">
                                    <Highlight {...defaultProps} code={preview.data.code} language={preview.data.language || "javascript"} theme={document.documentElement.getAttribute('data-theme') === 'lemonade' ? duotoneLight : dracula}>
                                      {({ className, style, tokens, getLineProps, getTokenProps }) => (
                                        <pre className={className + " rounded p-2 text-xs overflow-x-auto max-h-24 mb-1 bg-base-200 border border-base-300"} style={style}>
                                          {tokens.map((line, i) => {
                                            const { key, ...lineProps } = getLineProps({ line, key: i });
                                            return (
                                              <div key={i} {...lineProps}>
                                                {line.map((token, tokenKey) => {
                                                  const { key: tokenKeyProp, ...tokenProps } = getTokenProps({ token, key: tokenKey });
                                                  return <span key={tokenKey} {...tokenProps} />;
                                                })}
                                              </div>
                                            );
                                          })}
                                        </pre>
                                      )}
                                    </Highlight>
                                  </div>
                                  <div className="text-base font-bold text-base-content dark:text-base-content line-clamp-2 mb-1">{preview.data.description}</div>
                                  <div className="flex gap-1 flex-wrap mb-1">
                                    {preview.data.tags && preview.data.tags.map((tag) => (
                                      <span key={tag} className="badge badge-purple text-xs">#{tag}</span>
                                    ))}
                                    {preview.data.language && <span className="badge badge-outline text-xs">{preview.data.language}</span>}
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    <span>👍 {preview.data.upvotes || 0}</span>
                                    <span>📝 {preview.data.reviews?.length || 0}</span>
                                    <span className="ml-auto">ID: {preview.data._id.slice(-6)}</span>
                                  </div>
                                  <div className="text-xs text-purple-700 dark:text-purple-300 mt-1 font-semibold">Click to view full code review & comments</div>
                                </div>
                              )}
                            </div>
                            <div className="chat-footer text-xs text-gray-400 dark:text-gray-500 mt-1 text-left">
                              {getTimeLabel(msgDate)}
                            </div>
                          </div>
                        </Fragment>
                      );
                      return elements;
                    }
                    // For default message bubble:
                    const messageKey = msg._tempId ? `pending-${msg._tempId}` : `msg-${index}`;
                    elements.push(
                      <Fragment key={messageKey}>
                        {showDateSeparator && (
                          <div className="flex justify-center my-2">
                            <span className="badge badge-ghost px-3 py-1 text-xs font-semibold shadow">
                              {getDateSeparatorLabel(msgDate)}
                            </span>
                          </div>
                        )}
                        <div className={`chat ${user.firstName === msg.firstName ? "chat-end" : "chat-start"} transition-all duration-200`}>
                          {user.firstName !== msg.firstName ? (
                            <div className="chat-header text-xs font-semibold opacity-80 mb-1">
                              {msg.firstName} {msg.lastName}
                            </div>
                          ) : (
                            <div className="chat-header text-xs font-semibold opacity-80 mb-1">You</div>
                          )}
                          <div
                            className={`chat-bubble px-4 py-2 max-w-xs md:max-w-sm transition-all duration-200 hover:scale-[1.01] rounded-xl shadow border
                              ${user.firstName === msg.firstName
                                ? 'bg-primary text-primary-content border-primary'
                                : 'bg-base-200 dark:bg-base-100 text-base-content dark:text-base-content border-base-300 dark:border-base-200'}
                              ${msg.pending ? 'opacity-60 relative' : ''}
                            `}
                          >
                            {msg.text}
                            {msg.pending && (
                              <span className="absolute right-2 bottom-2 animate-spin text-xs text-gray-400">
                                <FaSpinner />
                              </span>
                            )}
                          </div>
                          <div className="chat-footer text-xs text-gray-400 dark:text-gray-500 mt-1 text-left">
                            {getTimeLabel(msgDate)}
                          </div>
                        </div>
                      </Fragment>
                    );
                    return elements;
                  }, []);
                })()  
              ) : (
                <div className="flex flex-col relative items-center bg-base-300 p-4 sm:p-6 rounded-lg shadow w-full text-center">
                  <FaCommentSlash className="text-4xl sm:text-5xl text-base-content mb-2" />
                  <h2 className="text-base sm:text-lg text-base-content mb-2">No messages yet. Start the conversation!</h2>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            {selectedUserId && (
              <div className="p-3 border-t border-gray-200 dark:border-gray-600 bg-base-100/90 dark:bg-base-200/90 flex items-center gap-2 rounded-b-2xl shadow-inner sticky bottom-0 z-10">
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 border border-primary bg-base-100 dark:bg-base-200 text-base-content rounded-full px-4 py-2 shadow focus:outline-none focus:ring-2 focus:ring-primary text-base"
                  placeholder="Type a message..."
                />
                <button type="button" onClick={sendMessage} className="btn btn-primary rounded-full px-4 py-2 shadow font-bold text-base">
                  Send
                </button>
              </div>
            )}
          </main>
        )}
      </div>
    </div>
  );
};

export default Chat;
