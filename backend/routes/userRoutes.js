const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateProfile
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { validateRegistration, validateLogin, validate } = require('../middleware/validator');

// Register user
router.post('/register', validateRegistration, validate, register);

// Login user
router.post('/login', validateLogin, validate, login);

// Get user profile
router.route('/profile')
  .get(protect, getProfile)
  .put(protect, updateProfile);

module.exports = router; 