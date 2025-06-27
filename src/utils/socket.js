import io from "socket.io-client";
import { BASE_URL } from "./constants";

export const createSocketConnection = () => {
  const isLocalhost = location.hostname === "localhost" || location.hostname === "127.0.0.1";
  
  console.log('Creating socket connection:', {
    isLocalhost,
    hostname: location.hostname,
    BASE_URL,
    currentUrl: window.location.href
  });
  
  const baseSocketOptions = {
    transports: ['websocket', 'polling'],
    timeout: 20000,
    withCredentials: true,
    forceNew: true,
    autoConnect: true,
  };
  
  if (isLocalhost) {
    // For local development
    const socket = io(BASE_URL, baseSocketOptions);
    
    socket.on('connect', () => {
      console.log('Socket connected (localhost):', socket.id);
    });
    
    socket.on('connect_error', (error) => {
      console.error('Socket connection error (localhost):', error);
    });
    
    return socket;
  } else {
    // For production/hosted environment - try multiple configurations
    let socket;
    
    // First try with explicit path
    try {
      socket = io(BASE_URL, {
        ...baseSocketOptions,
        path: '/socket.io/',
      });
      
      socket.on('connect', () => {
        console.log('Socket connected (production with path):', socket.id);
      });
      
      socket.on('connect_error', (error) => {
        console.error('Socket connection error (production with path):', error);
        
        // If first attempt fails, try without explicit path
        console.log('Trying alternative socket configuration...');
        socket.disconnect();
        
        socket = io(BASE_URL, baseSocketOptions);
        
        socket.on('connect', () => {
          console.log('Socket connected (production without path):', socket.id);
        });
        
        socket.on('connect_error', (error2) => {
          console.error('Socket connection error (production without path):', error2);
        });
      });
      
      socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
      });
      
      socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
      
      return socket;
    } catch (error) {
      console.error('Failed to create socket connection:', error);
      
      // Fallback to basic configuration
      socket = io(BASE_URL, baseSocketOptions);
      return socket;
    }
  }
};