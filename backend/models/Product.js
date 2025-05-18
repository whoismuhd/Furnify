const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price cannot be negative']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    minlength: [10, 'Description must be at least 10 characters']
  },
  image: {
    type: String,
    required: [true, 'Please add an image URL']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: {
      values: ['Living Room', 'Dining Room', 'Bedroom', 'Office', 'Outdoor', 'Lighting'],
      message: '{VALUE} is not a valid category'
    }
  },
  stock: {
    type: Number,
    required: [true, 'Please add stock quantity'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add virtual field for "inStock"
productSchema.virtual('inStock').get(function() {
  return this.stock > 0;
});

module.exports = mongoose.model('Product', productSchema); 