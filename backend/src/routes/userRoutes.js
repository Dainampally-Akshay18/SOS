const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateRequest, validateQuery, validateParams, schemas } = require('../middleware/validation');
const { requireAuth, requireApproval, requireAdmin } = require('../middleware/auth');

// Protected user routes (require authentication)
router.get('/profile', 
  requireAuth, 
  userController.getProfile
);

router.put('/profile', 
  requireAuth, 
  validateRequest(schemas.userProfileUpdate), 
  userController.updateProfile
);

router.get('/approval-status', 
  requireAuth, 
  userController.getApprovalStatus
);

router.post('/change-password', 
  requireAuth, 
  validateRequest(schemas.changePassword), 
  userController.changePassword
);

router.delete('/deactivate', 
  requireAuth, 
  requireApproval, 
  userController.deactivateAccount
);

// Public route for getting users by branch (approved users only)
router.get('/branch/:branch', 
  validateParams(schemas.urlParams.branch),
  validateQuery(schemas.queryParams.pagination), 
  userController.getUsersByBranch
);

// Admin-only routes
router.get('/:userId', 
  requireAuth, 
  requireAdmin,
  validateParams(schemas.urlParams.userId),
  userController.getUserById
);

// Test route (remove in production)
router.get('/test', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'User routes are working!',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
