const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    createOrder,
    getOrder,
    getMyOrders
} = require('../controllers/orderController');

// Create new order
router.post('/', protect, createOrder);

// Get order by ID
router.get('/:id', protect, getOrder);

// Get all orders for the logged-in user
router.get('/myorders', protect, getMyOrders);

module.exports = router; 