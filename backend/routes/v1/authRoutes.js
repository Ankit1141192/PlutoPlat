const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController');
const { authenticate } = require('../../middlewares/auth');
const { loginRateLimiter, authRateLimiter } = require('../../middlewares/rateLimiter');

// User Registration (Rate limited)
router.post('/register', authRateLimiter, authController.register);

// User Login (Strict 5-attempt rate & account lockout limiter)
router.post('/login', loginRateLimiter, authController.login);

// Current User Profile (JWT Authenticated)
router.get('/me', authenticate, authController.getMe);

module.exports = router;
