// =====================================================
// HOOK PERSONALIZADO PARA WEBSOCKET
// =====================================================

import { useState, useEffect, useRef, useCallback } from 'react';
import { auth } from '../firebase';

const useWebSocket = (url, options = {}) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [lastMessage, setLastMessage] = useState(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = options.maxReconnectAttempts || 5;
  const reconnectInterval = useRef(null);

  // =====================================================
  // FUNCIONES DE CONEXIÓN
  // =====================================================

  const connect = useCallback(async () => {
    try {
      // Para la versión simple, necesitamos el userId directamente
      // Esto es temporal hasta que arreglemos la autenticación Firebase
      const userId = options.userId || 1; // Usar ID 1 por defecto para pruebas
      
      // Construir URL con userId
      const wsUrl = `${url}?userId=${userId}`;
      
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {

        setIsConnected(true);
        setError(null);
        reconnectAttempts.current = 0;
        
        // Limpiar intervalo de reconexión
        if (reconnectInterval.current) {
          clearInterval(reconnectInterval.current);
          reconnectInterval.current = null;
        }
        
        setSocket(ws);
        
        // Enviar ping inicial
        ws.send(JSON.stringify({ type: 'ping' }));
        
        // Configurar ping periódico
        const pingInterval = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'ping' }));
          } else {
            clearInterval(pingInterval);
          }
        }, 30000);
        
        ws.addEventListener('close', () => {
          clearInterval(pingInterval);
        });
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
          
          // Manejar pong
          if (data.type === 'pong') {
            return;
          }

        } catch (error) {
          console.error('❌ Error al parsear mensaje WebSocket:', error);
        }
      };

      ws.onclose = (event) => {

        setIsConnected(false);
        setSocket(null);
        
        // Intentar reconectar si no fue un cierre intencional
        if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);

          reconnectInterval.current = setTimeout(() => {
            connect();
          }, delay);
        }
      };

      ws.onerror = (error) => {
        console.error('❌ Error en WebSocket:', error);
        setError('Error de conexión WebSocket');
      };

    } catch (error) {
      console.error('❌ Error al conectar WebSocket:', error);
      setError(error.message);
    }
  }, [url, maxReconnectAttempts]);

  const disconnect = useCallback(() => {
    if (socket) {
      socket.close(1000, 'Desconexión intencional');
      setSocket(null);
      setIsConnected(false);
    }
    
    if (reconnectInterval.current) {
      clearTimeout(reconnectInterval.current);
      reconnectInterval.current = null;
    }
  }, [socket]);

  const sendMessage = useCallback((message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    } else {

    }
  }, [socket]);

  // =====================================================
  // EFECTOS
  // =====================================================

  // Conectar al montar
  useEffect(() => {
    if (options.autoConnect !== false) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [connect, disconnect, options.autoConnect]);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  // =====================================================
  // FUNCIONES DE UTILIDAD
  // =====================================================

  const sendPing = useCallback(() => {
    sendMessage({ type: 'ping' });
  }, [sendMessage]);

  const getUnreadCount = useCallback(() => {
    sendMessage({ type: 'get_unread_count' });
  }, [sendMessage]);

  const markAsRead = useCallback((notificationId) => {
    sendMessage({ type: 'mark_as_read', notificationId });
  }, [sendMessage]);

  const markAllAsRead = useCallback(() => {
    sendMessage({ type: 'mark_all_as_read' });
  }, [sendMessage]);

  return {
    socket,
    isConnected,
    error,
    lastMessage,
    connect,
    disconnect,
    sendMessage,
    sendPing,
    getUnreadCount,
    markAsRead,
    markAllAsRead
  };
};

export default useWebSocket;
