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
export function useSocket(options: { token?: string; room?: string; namespace?: string } = {}) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const namespace = options.namespace || 'notifications';
    
    // Clean up base URL for Socket.io (remove trailing /api)
    const baseUri = API_BASE_URL.replace(/\/api$/, '');
    const connectionUrl = `${baseUri}/${namespace}`;

    console.log(`[Socket-${namespace}] Connecting to: ${connectionUrl}`);

    const socketClient = io(connectionUrl, {
      path: '/socket.io',
      auth: {
        token: options.token,
      },
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 15,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 8000,
      randomizationFactor: 0.5,
    });

    socketClient.on('connect', () => {
      setIsConnected(true);
      setIsReconnecting(false);
      console.log(`[Socket-${namespace}] Connected: ${socketClient.id}`);
      
      // Handle subscriptions based on namespace
      if (namespace === 'incidents' && options.room) {
        if (options.room.startsWith('district-')) {
          socketClient.emit('joinDistrict', { districtId: options.room.replace('district-', '') });
        } else if (options.room.startsWith('dept-')) {
          socketClient.emit('joinDepartment', { departmentId: options.room.replace('dept-', '') });
        }
      } else if (namespace === 'dashboard') {
        socketClient.emit('subscribeStats');
      }
    });

    socketClient.on('disconnect', (reason) => {
      setIsConnected(false);
      console.log(`[Socket-${namespace}] Disconnected due to: ${reason}`);
      if (reason === 'io server disconnect' || reason === 'transport close') {
        setIsReconnecting(true);
      }
    });

    socketClient.on('connect_error', (err) => {
      console.error(`[Socket-${namespace}] Connection Error:`, err.message);
      setIsReconnecting(true);
    });

    socketClient.on('reconnect_attempt', (attempt) => {
      console.log(`[Socket-${namespace}] Reconnection attempt #${attempt}...`);
      setIsReconnecting(true);
    });

    socketClient.on('reconnect_failed', () => {
      console.error(`[Socket-${namespace}] All reconnection attempts failed`);
      setIsReconnecting(false);
    });

    socketClient.on('notification', (payload: any) => {
      setMessages((prev) => [payload, ...prev]);
    });

    setSocket(socketClient);

    return () => {
      socketClient.disconnect();
    };
  }, [options.token, options.room, options.namespace]);

  const emitEvent = (eventName: string, data: any) => {
    if (socket && isConnected) {
      socket.emit(eventName, data);
    } else {
      console.warn(`[Socket] Cannot emit event "${eventName}": Socket not connected`);
    }
  };

  return {
    socket,
    isConnected,
    isReconnecting,
    messages,
    emitEvent,
  };
}
