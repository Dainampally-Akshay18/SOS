import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../services/supabase';

export const useRealtimeNotifications = (userId) => {
  const [notifications, setNotifications] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [unreadCount, setUnreadCount] = useState(0);

  // Add notification to list
  const addNotification = useCallback((notification) => {
    setNotifications(prev => {
      // Avoid duplicates
      const exists = prev.find(n => n.timestamp === notification.timestamp && n.type === notification.type);
      if (exists) return prev;
      
      return [notification, ...prev].slice(0, 50); // Keep only last 50 notifications
    });
    setUnreadCount(prev => prev + 1);
    
    // Show browser notification if permission granted
    if (Notification.permission === 'granted') {
      new Notification(notification.message, {
        body: notification.data?.message,
        icon: '/favicon.ico',
        tag: notification.type
      });
    }
  }, []);

  // Mark notifications as read
  const markAsRead = useCallback(() => {
    setUnreadCount(0);
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  }, []);

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  useEffect(() => {
    if (!userId) return;

    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Subscribe to user-specific notifications
    const userChannel = supabase
      .channel(`user-${userId}`)
      .on('broadcast', { event: 'notification' }, (payload) => {
        console.log('📱 User notification received:', payload);
        addNotification(payload.payload);
      })
      .on('broadcast', { event: 'heartbeat' }, () => {
        setConnectionStatus('connected');
      })
      .subscribe((status) => {
        console.log('📡 User channel status:', status);
        setConnectionStatus(status === 'SUBSCRIBED' ? 'connected' : 'disconnected');
      });

    // Subscribe to general notifications
    const generalChannel = supabase
      .channel('user-notifications')
      .on('broadcast', { event: 'general' }, (payload) => {
        console.log('📢 General notification received:', payload);
        addNotification(payload.payload);
      })
      .subscribe();

    // Handle connection status changes
    const handleConnectionChange = () => {
      setConnectionStatus(navigator.onLine ? 'connected' : 'disconnected');
    };

    window.addEventListener('online', handleConnectionChange);
    window.addEventListener('offline', handleConnectionChange);

    return () => {
      userChannel.unsubscribe();
      generalChannel.unsubscribe();
      window.removeEventListener('online', handleConnectionChange);
      window.removeEventListener('offline', handleConnectionChange);
    };
  }, [userId, addNotification]);

  return {
    notifications,
    connectionStatus,
    unreadCount,
    markAsRead,
    clearNotifications
  };
};
