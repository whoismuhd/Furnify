const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../../middleware/auth');

// Get user's cart
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.product');
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add item to cart
router.post('/', protect, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const user = await User.findById(req.user.id);
    
    const existingItem = user.cart.find(item => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }
    
    await user.save();
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update cart item quantity
router.put('/:productId', protect, async (req, res) => {
  try {
    const { quantity } = req.body;
    const user = await User.findById(req.user.id);
    
    const item = user.cart.find(item => item.product.toString() === req.params.productId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    item.quantity = quantity;
    await user.save();
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove item from cart
router.delete('/:productId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = user.cart.filter(item => item.product.toString() !== req.params.productId);
    await user.save();
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 