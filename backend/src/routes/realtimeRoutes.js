const express = require('express');
const router = express.Router();
const realtimeController = require('../controllers/realtimeController');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { validateRequest, schemas } = require('../middleware/validation');

// User routes for real-time notifications
router.post('/subscribe/:channel', 
  requireAuth,
  realtimeController.subscribeToNotifications
);

router.get('/status', 
  requireAuth,
  realtimeController.getConnectionStatus
);

// Admin routes for managing notifications
router.post('/send-notification', 
  requireAuth,
  requireAdmin,
  validateRequest(schemas.sendNotification),
  realtimeController.sendNotification
);

router.post('/broadcast', 
  requireAuth,
  requireAdmin,
  validateRequest(schemas.broadcastMessage),
  realtimeController.broadcastMessage
);

module.exports = router;
