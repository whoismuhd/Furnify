require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const products = [
  {
    name: 'Modern Stackable Chair',
    price: 49999,
    description: 'Elegant and comfortable stackable chair perfect for modern spaces.',
    image: '/assets/product-1.png',
    category: 'Living Room',
    stock: 15
  },
  {
    name: 'Contemporary Lamp',
    price: 14999,
    description: 'Stylish contemporary lamp with adjustable brightness.',
    image: '/assets/product-2.png',
    category: 'Lighting',
    stock: 20
  },
  {
    name: 'Elegant Dining Chair',
    price: 24999,
    description: 'Sophisticated dining chair with premium upholstery.',
    image: '/assets/product-3.png',
    category: 'Dining Room',
    stock: 12
  },
  {
    name: 'Designer Table Lamp',
    price: 3499,
    description: 'Modern designer table lamp with unique aesthetics.',
    image: '/assets/product-4.png',
    category: 'Lighting',
    stock: 25
  },
  {
    name: 'Modern Accent Chair',
    price: 13999,
    description: 'Contemporary accent chair with premium comfort.',
    image: '/assets/product-5.png',
    category: 'Living Room',
    stock: 8
  },
  {
    name: 'Classic Wingback Chair',
    price: 24999,
    description: 'Traditional wingback chair with modern comfort.',
    image: '/assets/product-6.png',
    category: 'Living Room',
    stock: 10
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete existing products
    await Product.deleteMany({});
    console.log('Products deleted');

    // Insert new products
    await Product.insertMany(products);
    console.log('Products inserted');

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 