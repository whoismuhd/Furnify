const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product'
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
    }
  }],
  shippingAddress: {
    street: {
      type: String,
      required: [true, 'Please add a street address']
    },
    city: {
      type: String,
      required: [true, 'Please add a city']
    },
    state: {
      type: String,
      required: [true, 'Please add a state']
    },
    zipCode: {
      type: String,
      required: [true, 'Please add a ZIP code']
    },
    country: {
      type: String,
      required: [true, 'Please add a country']
    }
  },
  paymentMethod: {
    type: String,
    required: [true, 'Please add a payment method'],
    enum: {
      values: ['credit_card', 'debit_card', 'bank_transfer'],
      message: '{VALUE} is not a valid payment method'
    }
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['processing', 'shipped', 'delivered', 'cancelled'],
    default: 'processing'
  },
  subtotal: {
    type: Number,
    required: true,
    min: [0, 'Subtotal cannot be negative']
  },
  shippingCost: {
    type: Number,
    required: true,
    min: [0, 'Shipping cost cannot be negative']
  },
  total: {
    type: Number,
    required: true,
    min: [0, 'Total cannot be negative']
  },
  paidAt: Date,
  deliveredAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Calculate total before saving
orderSchema.pre('save', function(next) {
  if (this.isModified('items') || this.isModified('shippingCost')) {
    this.subtotal = this.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    this.total = this.subtotal + this.shippingCost;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema); 