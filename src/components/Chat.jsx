import { useEffect, useState } from "react"; 
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addConnections } from "../utils/conectionSlice";
import { FaBars } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { FaRegSadTear, FaCommentSlash } from "react-icons/fa"; 

const Chat = () => {
  const { targetUserId: paramTargetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(paramTargetUserId || null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const user = useSelector((store) => store.user);
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();

  const userId = user?._id;

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

  return (
    <div className={`w-full h-3/4 flex bg-base-200 ${isSidebarOpen ? "fixed" : "relative"}`}>
      <button
        className="absolute top-4 left-4 sm:hidden z-9 bg-gray-700 text-white p-2 rounded-md"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <FaBars className="text-2xl" />
      </button>

      <div
        className={`fixed z-8 left-0 w-3/4 max-w-xs glass p-5 border-r border-gray-700 overflow-y-scroll transition-transform transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} sm:relative sm:translate-x-0 sm:w-1/4`}
      >
        <h2 className="text-lg font-semibold mb-4 text-center">Connections</h2>
        <div className="space-y-3">
          {Array.isArray(connections) && connections.length > 0 ? (
            connections.map((conn) => (
              <div
                key={conn._id}
                onClick={() => {
                  setSelectedUserId(conn._id);
                  setIsSidebarOpen(false);
                }}
                className={`flex p-2 items-center gap-3 cursor-pointer rounded-lg transition-all ${selectedUserId === conn._id ? "bg-primary text-primary-content shadow-md" : "hover:bg-accent hover:text-accent-content"}`}
              >
                <img
                  src={conn.photoUrl || "/default-avatar.png"}
                  alt="Profile"
                  className="w-12 h-12 rounded-full border-2 border-gray-400"
                />
                <span className="text-base font-medium">
                  {conn.firstName} {conn.lastName}
                </span>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-3/4 text-center text-base-content">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4076/4076581.png"
                alt="No Connections"
                className="w-48 h-48 mb-6 opacity-90"
              />
              <h1 className="text-3xl font-semibold mb-2">No Connections Found!</h1>
              <p className="text-base-content mb-6">Start exploring and connect with amazing people.</p>
              <Link to="/">
                <button className="btn btn-primary px-6 py-2 rounded-lg text-lg shadow-lg hover:scale-105 transition">
                  Explore Now
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col w-full sm:w-3/4 p-2 overflow-y-scroll h-[calc(100vh-100px)] md:h-[calc(100vh-50px)]">
        <div className="p-4 border-b border-gray-600 bg-base-200 flex items-center justify-center">
          <h1 className="text-lg font-semibold">
            {selectedUserId ? getConnectionName(selectedUserId) : "Select a Connection"}
          </h1>
        </div>

        <div className="flex-1 p-5 overflow-y-auto">
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <div key={index} className={`chat ${user.firstName === msg.firstName ? "chat-end" : "chat-start"}`}>
                {user.firstName !== msg.firstName ? (
                  <div className="chat-header text-sm font-medium opacity-75">
                    {msg.firstName} {msg.lastName}
                  </div>
                ) : (
                  <div className="chat-header text-sm font-medium opacity-75">You</div>
                )}
                <div className="chat-bubble bg-secondary text-secondary-content">
                  {msg.text}
                </div>
                <div className="chat-footer text-xs text-gray-500">
                  {msg.updatedAt && new Date(msg.updatedAt).toLocaleTimeString()}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col relative items-center bg-base-300 p-6 sm:p-8 rounded-lg shadow-lg w-full text-center">
              <FaCommentSlash className="text-5xl sm:text-6xl text-base-content mb-4" />
              <h2 className="text-lg sm:text-xl text-base-content mb-2">No messages yet. Start the conversation!</h2>
            </div>
          )}
        </div>

        {selectedUserId && (
          <div className="p-5 border-t border-gray-600 bg-base-200 flex items-center gap-2">
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 border border-gray-500 text-grey rounded p-2"
              placeholder="Type a message..."
              onKeyDown={handleKeyDown}
            />
            <button   onClick={sendMessage} className="btn btn-primary">
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
