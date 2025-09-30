import io from "socket.io-client";
import { BASE_URL } from "./constants";

export const createSocketConnection = () => {
  const isLocalhost = location.hostname === "localhost" || location.hostname === "127.0.0.1";
  const socketOptions = {
    transports: ["websocket", "polling"],
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
      path: "/socket.io/",
    });
  }
};