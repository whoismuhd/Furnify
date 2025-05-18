const Order = require('../models/Order');
const Cart = require('../models/Cart');

// Create new order
exports.createOrder = async (req, res) => {
    try {
        const { shipping, payment } = req.body;
        
        // Get user's cart
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Calculate totals
        const subtotal = cart.items.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);

        const shippingCost = 29.99;
        const taxRate = 0.18;
        const tax = subtotal * taxRate;
        const total = subtotal + shippingCost + tax;

        // Create order
        const order = new Order({
            user: req.user._id,
            items: cart.items.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price
            })),
            shipping,
            payment,
            subtotal,
            tax,
            shipping: shippingCost,
            total
        });

        await order.save();

        // Clear cart
        cart.items = [];
        await cart.save();

        res.status(201).json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Error creating order' });
    }
};

// Get order by ID
exports.getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email')
            .populate('items.product');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if the order belongs to the logged-in user
        if (order.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this order' });
        }

        res.json(order);
    } catch (error) {
        console.error('Error getting order:', error);
        res.status(500).json({ message: 'Error getting order' });
    }
};

// Get all orders for the logged-in user
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('items.product')
            .sort('-createdAt');

        res.json(orders);
    } catch (error) {
        console.error('Error getting orders:', error);
        res.status(500).json({ message: 'Error getting orders' });
    }
}; 