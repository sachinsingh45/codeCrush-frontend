import io from "socket.io-client";
import { BASE_URL } from "./constants";

let globalSocket = null;

export const createGlobalSocketConnection = (userId) => {
  if (globalSocket) return globalSocket;
  const isLocalhost = location.hostname === "localhost" || location.hostname === "127.0.0.1";
  const socketOptions = {
    transports: ['websocket', 'polling'],
    timeout: 20000,
    withCredentials: true,
    forceNew: true,
    autoConnect: true,
  };
  globalSocket = isLocalhost
    ? io(BASE_URL, socketOptions)
    : io(BASE_URL, { ...socketOptions, path: '/socket.io/' });
  if (userId) {
    globalSocket.emit('userConnected', { userId });
  }
  return globalSocket;
};

export const getGlobalSocket = () => globalSocket;

export const createSocketConnection = () => {
  // For per-chat socket usage (legacy)
  const isLocalhost = location.hostname === "localhost" || location.hostname === "127.0.0.1";
  const socketOptions = {
    transports: ['websocket', 'polling'],
    timeout: 20000,
    withCredentials: true,
    forceNew: true,
    autoConnect: true,
  };
  if (isLocalhost) {
    return io(BASE_URL, socketOptions);
  } else {
    return io(BASE_URL, {
      ...socketOptions,
      path: '/socket.io/',
    });
  }
};