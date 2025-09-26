const realtimeService = require('../services/realtimeService');
const { supabaseAdmin } = require('../config/supabase');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

const realtimeController = {
  // Subscribe user to notifications
  subscribeToNotifications: async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const { channel } = req.params;

      // Validate channel
      const allowedChannels = ['user-notifications', 'admin-notifications'];
      if (!allowedChannels.includes(channel)) {
        return next(new AppError('Invalid channel', 400));
      }

      // Create subscription info
      const subscriptionInfo = {
        userId,
        channel,
        subscribedAt: new Date().toISOString(),
        active: true
      };

      res.status(200).json({
        status: 'success',
        message: 'Subscribed to real-time notifications',
        data: subscriptionInfo
      });

    } catch (error) {
      next(error);
    }
  },

  // Send manual notification (admin only)
  sendNotification: async (req, res, next) => {
    try {
      const { recipientType, recipientId, message, notificationType } = req.body;
      const senderId = req.user.userId;

      if (!recipientType || !message || !notificationType) {
        return next(new AppError('Missing required notification data', 400));
      }

      const notification = {
        type: notificationType,
        data: {
          message,
          senderId,
          senderName: req.user.userData.name
        },
        timestamp: new Date().toISOString(),
        message
      };

      realtimeService.sendNotification(recipientType, recipientId, notification);

      res.status(200).json({
        status: 'success',
        message: 'Notification sent successfully'
      });

    } catch (error) {
      next(error);
    }
  },

  // Get real-time connection status
  getConnectionStatus: async (req, res, next) => {
    try {
      const userId = req.user.userId;

      const status = {
        userId,
        connected: true,
        channels: Array.from(realtimeService.channels.keys()),
        lastHeartbeat: new Date().toISOString(),
        activeSubscriptions: realtimeService.subscribers.has(userId) ? 
          realtimeService.subscribers.get(userId).size : 0
      };

      res.status(200).json({
        status: 'success',
        data: status
      });

    } catch (error) {
      next(error);
    }
  },

  // Create a custom broadcast message
  broadcastMessage: async (req, res, next) => {
    try {
      const { message, targetAudience, priority } = req.body;
      const senderId = req.user.userId;

      if (!message || !targetAudience) {
        return next(new AppError('Message and target audience are required', 400));
      }

      const broadcast = {
        type: 'BROADCAST_MESSAGE',
        data: {
          message,
          senderId,
          senderName: req.user.userData.name,
          priority: priority || 'normal',
          targetAudience
        },
        timestamp: new Date().toISOString(),
        message
      };

      if (targetAudience === 'all_admins') {
        realtimeService.broadcastToAdmins(broadcast);
      }

      res.status(200).json({
        status: 'success',
        message: 'Broadcast sent successfully'
      });

    } catch (error) {
      next(error);
    }
  }
};

module.exports = realtimeController;
