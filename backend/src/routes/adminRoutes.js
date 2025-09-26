const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { validateRequest, validateQuery, validateParams, schemas } = require('../middleware/validation');
const { requireAuth, requireAdmin, requirePermission } = require('../middleware/auth');

// Admin login (public)
router.post('/login', 
  validateRequest(schemas.adminLogin), 
  adminController.login
);

// Protected admin routes
router.get('/dashboard/stats', 
  requireAuth, 
  requireAdmin,
  adminController.getDashboardStats
);

router.get('/users/pending', 
  requireAuth, 
  requireAdmin,
  requirePermission('manageUsers'),
  validateQuery(schemas.queryParams.pagination),
  validateQuery(schemas.queryParams.userFilter),
  adminController.getPendingUsers
);

router.get('/users', 
  requireAuth, 
  requireAdmin,
  requirePermission('manageUsers'),
  validateQuery(schemas.queryParams.pagination),
  validateQuery(schemas.queryParams.userFilter),
  adminController.getAllUsers
);

router.put('/users/:userId/approve', 
  requireAuth, 
  requireAdmin,
  requirePermission('manageUsers'),
  validateParams(schemas.urlParams.userId),
  adminController.approveUser
);

router.put('/users/:userId/reject', 
  requireAuth, 
  requireAdmin,
  requirePermission('manageUsers'),
  validateParams(schemas.urlParams.userId),
  validateRequest(schemas.userApproval),
  adminController.rejectUser
);

router.put('/users/:userId/toggle-status', 
  requireAuth, 
  requireAdmin,
  requirePermission('manageUsers'),
  validateParams(schemas.urlParams.userId),
  adminController.toggleUserStatus
);

router.post('/create-admin', 
  requireAuth, 
  requireAdmin,
  requirePermission('createAdmins'),
  validateRequest(schemas.createAdmin),
  adminController.createAdmin
);

// Test route (remove in production)
router.get('/test', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'Admin routes are working!',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
