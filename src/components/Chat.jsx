import { useEffect, useState, useRef } from "react"; 
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addConnections } from "../utils/conectionSlice";
import { FaBars, FaExternalLinkAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { FaRegSadTear, FaCommentSlash } from "react-icons/fa"; 
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Footer from "./Footer";

const Chat = () => {
  const { targetUserId: paramTargetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(paramTargetUserId || null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [blogPreviews, setBlogPreviews] = useState({});
  const [search, setSearch] = useState("");

  const user = useSelector((store) => store.user);
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userId = user?._id;

  // Track which blogs have been shared in this session (to avoid double increment)
  const [sharedInSession, setSharedInSession] = useState({});
  const [shareLoadingBlogId, setShareLoadingBlogId] = useState(null);

  const messagesEndRef = useRef(null);

  const fetchConnections = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/connections`, {
        withCredentials: true,
      });
      if (res.data?.data) {
        dispatch(addConnections(res.data.data));
      }
    } catch (err) {
      console.error("API Error:", err);
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
        updatedAt: msg.updatedAt,  // Include updatedAt timestamp
      }));
      setMessages(chatMessages);
    } catch (err) {
      console.error("Error fetching chat:", err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      fetchChatMessages(selectedUserId);
    }
  }, [selectedUserId]);

  useEffect(() => {
    if (!userId || !selectedUserId) return;

    const socket = createSocketConnection();
    socket.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetUserId: selectedUserId,
    });

    socket.on("messageReceived", ({ firstName, lastName, text, updatedAt }) => {
      setMessages((prev) => [...prev, { firstName, lastName, text, updatedAt }]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, selectedUserId]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
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

  // Helper to extract blog ID from URL
  const extractBlogId = (url) => {
    const match = url.match(/\/blogs\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  };

  // Fetch blog preview if needed
  useEffect(() => {
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
        } catch {
          setBlogPreviews((prev) => ({ ...prev, [blogId]: { loading: false, error: true } }));
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
      } catch {}
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

  return (
    <form onSubmit={e => { e.preventDefault(); sendMessage(); }}>
      <div className={`w-full h-[88vh] flex bg-base-200/80 dark:bg-base-200/80 ${isSidebarOpen ? "fixed" : "relative"} rounded-2xl shadow-xl overflow-hidden backdrop-blur-md` + (selectedUserId ? ' sm:flex' : ' flex') } style={{ minHeight: '88vh', maxHeight: '88vh', overflow: 'hidden' }}>
        {/* Mobile Sidebar Drawer */}
        <aside className={`fixed z-20 top-0 left-0 w-full h-full bg-base-100 dark:bg-base-200 transition-transform duration-300 sm:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`} style={{ maxHeight: '88vh', overflow: 'hidden' }}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-base-100 dark:bg-base-200">
            <h2 className="text-lg font-bold text-primary tracking-wide">Chats</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => setIsSidebarOpen(false)}>✕</button>
          </div>
          <div className="p-2">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search connections..."
              className="input input-bordered w-full rounded-full bg-base-100 dark:bg-base-200 text-base-content text-sm"
            />
          </div>
          <div className="space-y-2 flex-1 overflow-y-auto p-2 custom-scrollbar">
            {filteredConnections.length > 0 ? (
              filteredConnections.map((conn) => (
                <div
                  key={conn._id}
                  onClick={() => {
                    setSelectedUserId(conn._id);
                    setIsSidebarOpen(false);
                  }}
                  className={`flex items-center gap-3 cursor-pointer rounded-xl px-3 py-2 transition-all duration-200 text-sm ${selectedUserId === conn._id ? "bg-primary text-primary-content shadow scale-100" : "hover:bg-accent hover:text-accent-content dark:hover:bg-base-300 dark:hover:text-base-content"}`}
                >
                  <img
                    src={conn.photoUrl || "/default-avatar.png"}
                    alt="Profile"
                    className="w-10 h-10 rounded-full border border-primary shadow bg-base-100 dark:bg-base-200 object-cover"
                  />
                  <span className="font-semibold">
                    {conn.firstName} {conn.lastName}
                  </span>
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

        {/* Desktop Sidebar */}
        <aside className="hidden sm:flex flex-col w-1/4 max-w-xs p-0 border-r border-gray-200 dark:border-gray-700 rounded-r-2xl bg-base-100/80 dark:bg-base-200/80 shadow-lg h-full" style={{ maxHeight: '88vh', overflow: 'hidden' }}>
          <div className="p-4 pb-2 border-b border-gray-200 dark:border-gray-700 bg-base-100/90 dark:bg-base-200/90 rounded-tr-2xl">
            <h2 className="text-lg font-bold text-primary mb-2 tracking-wide">Chats</h2>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search connections..."
              className="input input-bordered w-full rounded-full bg-base-100 dark:bg-base-200 text-base-content text-sm"
            />
          </div>
          <div className="space-y-2 flex-1 overflow-y-auto pr-1 custom-scrollbar pt-2">
            {filteredConnections.length > 0 ? (
              filteredConnections.map((conn) => (
                <div
                  key={conn._id}
                  onClick={() => {
                    setSelectedUserId(conn._id);
                    setIsSidebarOpen(false);
                  }}
                  className={`flex items-center gap-3 cursor-pointer rounded-xl px-3 py-2 transition-all duration-200 text-sm ${selectedUserId === conn._id ? "bg-primary text-primary-content shadow scale-100" : "hover:bg-accent hover:text-accent-content dark:hover:bg-base-300 dark:hover:text-base-content"}`}
                >
                  <img
                    src={conn.photoUrl || "/default-avatar.png"}
                    alt="Profile"
                    className="w-10 h-10 rounded-full border border-primary shadow bg-base-100 dark:bg-base-200 object-cover"
                  />
                  <span className="font-semibold">
                    {conn.firstName} {conn.lastName}
                  </span>
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

        {/* Chat Area */}
        <main className={`flex-1 flex flex-col w-full sm:w-3/4 p-0 md:p-4 bg-base-100/80 dark:bg-base-200/80 rounded-l-2xl h-full relative border-l border-gray-200 dark:border-gray-700 ${selectedUserId ? '' : 'hidden sm:flex'}`} style={{ maxHeight: '88vh', overflow: 'hidden' }}>
          {/* Sticky Chat Header */}
          <div className="sticky top-0 z-10 p-3 border-b border-gray-200 dark:border-gray-600 bg-base-100/90 dark:bg-base-200/90 flex items-center gap-3 rounded-tl-2xl shadow-sm">
            {/* Mobile back button */}
            {selectedUserId && (
              <>
                <button className="sm:hidden btn btn-ghost btn-sm mr-2" onClick={() => setSelectedUserId(null)}>&larr;</button>
                <img
                  src={filteredConnections.find(c => c._id === selectedUserId)?.photoUrl || "/default-avatar.png"}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border border-primary shadow bg-base-100 dark:bg-base-200 object-cover"
                />
              </>
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
              messages.map((msg, index) => {
                const blogLink = parseBlogLink(msg.text);
                return (
                  <div key={index} className={`chat ${user.firstName === msg.firstName ? "chat-end" : "chat-start"} transition-all duration-200`}> 
                    {user.firstName !== msg.firstName ? (
                      <div className="chat-header text-xs font-semibold opacity-80 mb-1">
                        {msg.firstName} {msg.lastName}
                      </div>
                    ) : (
                      <div className="chat-header text-xs font-semibold opacity-80 mb-1">You</div>
                    )}
                    {blogLink ? (
                      (() => {
                        const blogId = extractBlogId(blogLink);
                        const preview = blogPreviews[blogId];
                        return (
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
                        );
                      })()
                    ) : (
                      <div
                        className={`chat-bubble px-4 py-2 max-w-xs md:max-w-sm transition-all duration-200 hover:scale-[1.01] rounded-xl shadow border
                          ${user.firstName === msg.firstName
                            ? 'bg-primary text-primary-content border-primary'
                            : 'bg-base-200 dark:bg-base-100 text-base-content dark:text-base-content border-base-300 dark:border-base-200'}
                        `}
                      >
                        {msg.text}
                      </div>
                    )}
                    <div className="chat-footer text-xs text-gray-400 dark:text-gray-500 mt-1 text-left">
                      {msg.updatedAt && new Date(msg.updatedAt).toLocaleTimeString()}
                    </div>
                  </div>
                );
              })
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
                className="flex-1 border border-primary bg-base-100 dark:bg-base-200 text-base-content rounded-full px-4 py-2 shadow focus:outline-none focus:ring-2 focus:ring-primary text-base"
                placeholder="Type a message..."
                onKeyDown={handleKeyDown}
              />
              <button type="submit" className="btn btn-primary rounded-full px-4 py-2 shadow font-bold text-base">
                Send
              </button>
            </div>
          )}
        </main>
      </div>
    </form>
  );
};

export default Chat;
