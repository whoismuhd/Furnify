const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.get('/top', getTopProducts);
router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected routes
router.post('/:id/reviews', protect, createProductReview);

// Admin routes
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router; 