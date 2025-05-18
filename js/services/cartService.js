import config from '../config.js';

class CartService {
    constructor() {
        this.baseUrl = config.api.baseUrl;
    }

    // Helper function to handle API responses
    async handleResponse(response) {
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || config.messages.error.server);
        }
        return response.json();
    }

    // Get token from localStorage
    getToken() {
        const token = localStorage.getItem(config.storage.token);
        if (!token) {
            throw new Error(config.messages.error.server);
        }
        return token;
    }

    // Get cart items
    async getCart() {
        try {
            const response = await fetch(`${this.baseUrl}${config.api.cart.getCart}`, {
                headers: {
                    'Authorization': `Bearer ${this.getToken()}`
                }
            });
            return this.handleResponse(response);
        } catch (error) {
            console.error('Error getting cart:', error);
            throw new Error(error.message || config.messages.error.cartUpdate);
        }
    }

    // Add item to cart
    async addToCart(productId, quantity = 1) {
        try {
            const response = await fetch(`${this.baseUrl}${config.api.cart.addToCart}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                },
                body: JSON.stringify({ productId, quantity })
            });
            return this.handleResponse(response);
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw new Error(error.message || config.messages.error.cartUpdate);
        }
    }

    // Update cart item quantity
    async updateQuantity(productId, quantity) {
        try {
            const response = await fetch(`${this.baseUrl}${config.api.cart.updateQuantity}/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                },
                body: JSON.stringify({ quantity })
            });
            return this.handleResponse(response);
        } catch (error) {
            console.error('Error updating quantity:', error);
            throw new Error(error.message || config.messages.error.cartUpdate);
        }
    }

    // Remove item from cart
    async removeFromCart(productId) {
        try {
            const response = await fetch(`${this.baseUrl}${config.api.cart.removeFromCart}/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.getToken()}`
                }
            });
            return this.handleResponse(response);
        } catch (error) {
            console.error('Error removing from cart:', error);
            throw new Error(error.message || config.messages.error.cartRemove);
        }
    }

    // Clear cart
    async clearCart() {
        try {
            const response = await fetch(`${this.baseUrl}${config.api.cart.clearCart}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.getToken()}`
                }
            });
            return this.handleResponse(response);
        } catch (error) {
            console.error('Error clearing cart:', error);
            throw new Error(error.message || config.messages.error.cartUpdate);
        }
    }

    // Create order
    async createOrder(shippingInfo) {
        try {
            const response = await fetch(`${this.baseUrl}${config.api.orders.create}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                },
                body: JSON.stringify({ shippingInfo })
            });
            return this.handleResponse(response);
        } catch (error) {
            console.error('Error creating order:', error);
            throw new Error(error.message || config.messages.error.orderCreation);
        }
    }

    // Get order details
    async getOrder(orderId) {
        try {
            const response = await fetch(`${this.baseUrl}${config.api.orders.getOrder}/${orderId}`, {
                headers: {
                    'Authorization': `Bearer ${this.getToken()}`
                }
            });
            return this.handleResponse(response);
        } catch (error) {
            console.error('Error getting order:', error);
            throw new Error(error.message || config.messages.error.server);
        }
    }

    // Get user's orders
    async getUserOrders() {
        try {
            const response = await fetch(`${this.baseUrl}${config.api.orders.getUserOrders}`, {
                headers: {
                    'Authorization': `Bearer ${this.getToken()}`
                }
            });
            return this.handleResponse(response);
        } catch (error) {
            console.error('Error getting user orders:', error);
            throw new Error(error.message || config.messages.error.server);
        }
    }

    // Cancel order
    async cancelOrder(orderId) {
        try {
            const response = await fetch(`${this.baseUrl}${config.api.orders.cancelOrder}/${orderId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.getToken()}`
                }
            });
            return this.handleResponse(response);
        } catch (error) {
            console.error('Error canceling order:', error);
            throw new Error(error.message || config.messages.error.orderCancellation);
        }
    }
}

// Export a singleton instance
export const cartService = new CartService(); 