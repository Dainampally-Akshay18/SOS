const { supabaseAdmin } = require('../config/supabase');
const logger = require('../utils/logger');

class RealtimeService {
  constructor() {
    this.channels = new Map(); // Store active channels
    this.subscribers = new Map(); // Store subscribers by user ID
    this.initialize();
  }

  // Initialize real-time service
  initialize() {
    logger.info('🔄 Initializing Realtime Service...');
    this.setupDatabaseListeners();
  }

  // Set up database change listeners
  setupDatabaseListeners() {
    try {
      // Listen to user table changes
      const userChannel = supabaseAdmin
        .channel('user-changes')
        .on(
          'postgres_changes',
          {
            event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
            schema: 'public',
            table: 'users'
          },
          (payload) => {
            this.handleUserChanges(payload);
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'pastors'
          },
          (payload) => {
            this.handleAdminChanges(payload);
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            logger.info('✅ Real-time database listeners activated');
          } else if (status === 'CHANNEL_ERROR') {
            logger.error('❌ Real-time subscription error');
          }
        });

      this.channels.set('database-changes', userChannel);

      // Set up heartbeat to keep connection alive
      this.setupHeartbeat();

    } catch (error) {
      logger.error('Real-time service initialization error:', error);
    }
  }

  // Handle user table changes
  handleUserChanges(payload) {
    const { eventType, new: newRecord, old: oldRecord } = payload;
    
    logger.info(`👥 User table change detected: ${eventType}`);

    switch (eventType) {
      case 'INSERT':
        this.notifyNewUserRegistration(newRecord);
        break;
      case 'UPDATE':
        this.notifyUserUpdate(newRecord, oldRecord);
        break;
      case 'DELETE':
        this.notifyUserDeletion(oldRecord);
        break;
    }
  }

  // Handle admin table changes
  handleAdminChanges(payload) {
    const { eventType, new: newRecord, old: oldRecord } = payload;
    
    logger.info(`🔐 Admin table change detected: ${eventType}`);
    
    // Notify all admins about admin changes
    this.broadcastToAdmins({
      type: 'ADMIN_CHANGE',
      event: eventType,
      data: eventType === 'DELETE' ? oldRecord : newRecord,
      timestamp: new Date().toISOString()
    });
  }

  // Notify about new user registration
  notifyNewUserRegistration(user) {
    const notification = {
      type: 'NEW_USER_REGISTRATION',
      data: {
        userId: user.id,
        name: user.name,
        email: user.email,
        branch: user.branch,
        createdAt: user.created_at
      },
      timestamp: new Date().toISOString(),
      message: `New user registration: ${user.name}`
    };

    // Send to all admins
    this.broadcastToAdmins(notification);
    
    // Update dashboard stats
    this.updateDashboardStats();
  }

  // Notify about user updates (approval status changes)
  notifyUserUpdate(newUser, oldUser) {
    // Check if approval status changed
    if (oldUser.approval_status !== newUser.approval_status) {
      const statusChange = {
        type: 'APPROVAL_STATUS_CHANGE',
        data: {
          userId: newUser.id,
          name: newUser.name,
          email: newUser.email,
          oldStatus: oldUser.approval_status,
          newStatus: newUser.approval_status,
          approvedBy: newUser.approved_by,
          approvedAt: newUser.approved_at,
          rejectionReason: newUser.rejection_reason
        },
        timestamp: new Date().toISOString(),
        message: `User ${newUser.approval_status}: ${newUser.name}`
      };

      // Notify the specific user about their status change
      this.notifyUser(newUser.id, statusChange);

      // Notify all admins
      this.broadcastToAdmins(statusChange);

      // Update dashboard stats
      this.updateDashboardStats();
    }

    // Check for other profile changes
    const profileChanges = this.detectProfileChanges(oldUser, newUser);
    if (profileChanges.length > 0) {
      const profileUpdate = {
        type: 'PROFILE_UPDATE',
        data: {
          userId: newUser.id,
          name: newUser.name,
          changes: profileChanges
        },
        timestamp: new Date().toISOString(),
        message: `Profile updated: ${newUser.name}`
      };

      this.broadcastToAdmins(profileUpdate);
    }
  }

  // Notify about user deletion
  notifyUserDeletion(user) {
    const notification = {
      type: 'USER_DELETED',
      data: {
        userId: user.id,
        name: user.name,
        email: user.email
      },
      timestamp: new Date().toISOString(),
      message: `User deleted: ${user.name}`
    };

    this.broadcastToAdmins(notification);
    this.updateDashboardStats();
  }

  // Detect profile changes between old and new user data
  detectProfileChanges(oldUser, newUser) {
    const changes = [];
    const fieldsToCheck = ['name', 'bio', 'branch', 'phone'];

    fieldsToCheck.forEach(field => {
      if (oldUser[field] !== newUser[field]) {
        changes.push({
          field,
          from: oldUser[field],
          to: newUser[field]
        });
      }
    });

    return changes;
  }

  // Create a user-specific channel for notifications
  createUserChannel(userId) {
    if (this.channels.has(`user-${userId}`)) {
      return this.channels.get(`user-${userId}`);
    }

    const channel = supabaseAdmin.channel(`user-${userId}`);
    this.channels.set(`user-${userId}`, channel);
    
    logger.info(`📱 Created user channel: ${userId}`);
    return channel;
  }

  // Create an admin broadcast channel
  createAdminChannel() {
    if (this.channels.has('admin-broadcast')) {
      return this.channels.get('admin-broadcast');
    }

    const channel = supabaseAdmin.channel('admin-broadcast');
    this.channels.set('admin-broadcast', channel);
    
    logger.info('🔐 Created admin broadcast channel');
    return channel;
  }

  // Subscribe a user to real-time notifications
  subscribeUser(userId, callback) {
    if (!this.subscribers.has(userId)) {
      this.subscribers.set(userId, new Set());
    }

    this.subscribers.get(userId).add(callback);
    
    // Create user channel if it doesn't exist
    const channel = this.createUserChannel(userId);
    
    logger.info(`🔔 User subscribed to notifications: ${userId}`);
    return () => this.unsubscribeUser(userId, callback);
  }

  // Unsubscribe a user from notifications
  unsubscribeUser(userId, callback) {
    const userSubscribers = this.subscribers.get(userId);
    if (userSubscribers) {
      userSubscribers.delete(callback);
      
      if (userSubscribers.size === 0) {
        this.subscribers.delete(userId);
        
        // Remove channel if no subscribers
        const channel = this.channels.get(`user-${userId}`);
        if (channel) {
          channel.unsubscribe();
          this.channels.delete(`user-${userId}`);
        }
      }
    }
    
    logger.info(`🔕 User unsubscribed: ${userId}`);
  }

  // Notify a specific user
  notifyUser(userId, notification) {
    const userSubscribers = this.subscribers.get(userId);
    if (userSubscribers) {
      userSubscribers.forEach(callback => {
        try {
          callback(notification);
        } catch (error) {
          logger.error(`Error notifying user ${userId}:`, error);
        }
      });
    }

    // Also send via Supabase broadcast
    const channel = this.channels.get(`user-${userId}`);
    if (channel) {
      channel.send({
        type: 'broadcast',
        event: 'notification',
        payload: notification
      });
    }
  }

  // Broadcast to all admins
  broadcastToAdmins(notification) {
    const adminChannel = this.createAdminChannel();
    
    adminChannel.send({
      type: 'broadcast',
      event: 'admin-notification',
      payload: notification
    });

    logger.info(`📢 Broadcasted to admins: ${notification.type}`);
  }

  // Update dashboard statistics in real-time
  async updateDashboardStats() {
    try {
      // Get fresh statistics
      const { data: userStats } = await supabaseAdmin
        .from('users')
        .select('approval_status, branch, is_active')
        .eq('is_active', true);

      const stats = {
        totalUsers: userStats.length,
        pendingUsers: userStats.filter(u => u.approval_status === 'pending').length,
        approvedUsers: userStats.filter(u => u.approval_status === 'approved').length,
        rejectedUsers: userStats.filter(u => u.approval_status === 'rejected').length,
        branchStats: {
          'branch1(EZCC)': userStats.filter(u => u.branch === 'branch1(EZCC)').length,
          'branch2(NEZCC)': userStats.filter(u => u.branch === 'branch2(NEZCC)').length
        }
      };

      // Broadcast updated stats to admins
      this.broadcastToAdmins({
        type: 'DASHBOARD_STATS_UPDATE',
        data: stats,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Error updating dashboard stats:', error);
    }
  }

  // Send manual notification
  sendNotification(recipientType, recipientId, notification) {
    if (recipientType === 'user') {
      this.notifyUser(recipientId, notification);
    } else if (recipientType === 'admin') {
      this.broadcastToAdmins(notification);
    }
  }

  // Setup heartbeat to keep connection alive
  setupHeartbeat() {
    setInterval(() => {
      this.channels.forEach((channel, channelName) => {
        if (channel.state === 'joined') {
          channel.send({
            type: 'broadcast',
            event: 'heartbeat',
            payload: { timestamp: new Date().toISOString() }
          });
        }
      });
    }, 30000); // Send heartbeat every 30 seconds
  }

  // Clean up resources
  cleanup() {
    logger.info('🧹 Cleaning up Realtime Service...');
    
    this.channels.forEach((channel, channelName) => {
      channel.unsubscribe();
    });
    
    this.channels.clear();
    this.subscribers.clear();
  }
}

// Create singleton instance
const realtimeService = new RealtimeService();

module.exports = realtimeService;
