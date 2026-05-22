import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

// Microservices endpoint mapping
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'; // nest-api Gateway
export const AI_BASE_URL = process.env.NEXT_PUBLIC_AI_URL || 'http://localhost:10000';  // fastapi-ai Service
export const UTILS_BASE_URL = process.env.NEXT_PUBLIC_UTILS_URL || 'http://localhost:3001'; // node-services Utility

interface RequestOptions extends RequestInit {
  token?: string;
}

/**
 * Universal premium fetch client for JanSankalp microservices
 */
export async function apiFetch(path: string, options: RequestOptions = {}) {
  const isAiService = path.startsWith('/ai/');
  const isUtilsService = path.startsWith('/utils/');
  
  let baseUrl = API_BASE_URL;
  let cleanPath = path;

  if (isAiService) {
    baseUrl = AI_BASE_URL;
    cleanPath = path.replace('/ai', '');
  } else if (isUtilsService) {
    baseUrl = UTILS_BASE_URL;
    cleanPath = path.replace('/utils', '');
  }

  const url = `${baseUrl}${cleanPath}`;
  const headers = new Headers(options.headers || {});
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Attach token if present
  if (options.token) {
    headers.set('Authorization', `Bearer ${options.token}`);
  }

  const mergedOptions: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(url, mergedOptions);
  
  if (!response.ok) {
    const errorText = await response.text();
    let parsedError;
    try {
      parsedError = JSON.parse(errorText);
    } catch {
      parsedError = { message: errorText };
    }
    throw new Error(parsedError.message || `API request failed with status ${response.status}`);
  }

  if (response.headers.get('content-type')?.includes('application/json')) {
    return response.json();
  }
  return response.text();
}

/**
 * Premium Socket.IO custom React Hook for real-time microservices gateway connection
 */
export function useSocket(options: { token?: string; room?: string } = {}) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    // Connect to nest-api WebSocket Gateway
    const socketClient = io(API_BASE_URL, {
      path: '/socket.io',
      auth: {
        token: options.token,
      },
      transports: ['websocket'],
      autoConnect: true,
    });

    socketClient.on('connect', () => {
      setIsConnected(true);
      console.log('[Socket] Connected to NestAPI WebSocket gateway:', socketClient.id);
      
      // Join specific room if requested (e.g. ward, district, user room)
      if (options.room) {
        socketClient.emit('joinRoom', options.room);
      }
    });

    socketClient.on('disconnect', () => {
      setIsConnected(false);
      console.log('[Socket] Disconnected from WebSocket gateway');
    });

    socketClient.on('notification', (payload: any) => {
      setMessages((prev) => [payload, ...prev]);
    });

    setSocket(socketClient);

    return () => {
      socketClient.disconnect();
    };
  }, [options.token, options.room]);

  const emitEvent = (eventName: string, data: any) => {
    if (socket && isConnected) {
      socket.emit(eventName, data);
    } else {
      console.warn('[Socket] Attempted to emit event but socket is not connected');
    }
  };

  return {
    socket,
    isConnected,
    messages,
    emitEvent,
  };
}
