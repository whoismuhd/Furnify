// API Configuration
const config = {
    // API URLs
    api: {
        baseUrl: 'http://localhost:5000/api',
        cart: {
            getCart: '/cart',
            addToCart: '/cart',
            updateQuantity: '/cart',
            removeFromCart: '/cart',
            clearCart: '/cart/clear'
        },
        orders: {
            create: '/orders/create',
            getOrder: '/orders',
            getUserOrders: '/orders/user',
            cancelOrder: '/orders/cancel'
        },
        products: {
            getAll: '/products',
            getById: '/products',
            getFeatured: '/products/featured',
            getCategories: '/products/categories',
            getByCategory: '/products/category'
        }
    },

    // Storage Keys
    storage: {
        cart: 'furnify_cart'
    },

    // Currency Configuration
    currency: {
        symbol: '₺',
        code: 'TRY'
    },

    // Cart Configuration
    cart: {
        freeShippingThreshold: 100,
        shippingCost: 10,
        taxRate: 0.1 // 10%
    },

    // API Response Messages
    messages: {
        success: {
            orderCreation: 'Order created successfully!',
            orderCancellation: 'Order cancelled successfully!'
        },
        error: {
            orderCreation: 'Failed to create order.',
            orderCancellation: 'Failed to cancel order.',
            cartUpdate: 'Failed to update cart.',
            cartRemove: 'Failed to remove item from cart.',
            network: 'Network error. Please check your connection.',
            server: 'Server error. Please try again later.'
        }
    }
};

// Export configuration
export default config; 