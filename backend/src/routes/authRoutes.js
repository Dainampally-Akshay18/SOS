const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRequest, schemas } = require('../middleware/validation');
const { requireAuth } = require('../middleware/auth');

// Public routes
router.post('/register', 
  validateRequest(schemas.userRegistration), 
  authController.register
);

router.post('/login', 
  validateRequest(schemas.userLogin), 
  authController.login
);

// Protected routes
router.post('/logout', requireAuth, authController.logout);
router.get('/profile', requireAuth, authController.getProfile);
router.post('/refresh-token', requireAuth, authController.refreshToken);

// Test route (remove in production)
router.get('/test', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'Auth routes are working!',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
