import config from '../config.js';

class ProductService {
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

    // Get all products
    async getAllProducts() {
        try {
            const response = await fetch(`${this.baseUrl}${config.api.products.getAll}`);
            return this.handleResponse(response);
        } catch (error) {
            console.error('Error getting products:', error);
            throw new Error(error.message || config.messages.error.server);
        }
    }

    // Get product by ID
    async getProductById(productId) {
        try {
            const response = await fetch(`${this.baseUrl}${config.api.products.getById}/${productId}`);
            return this.handleResponse(response);
        } catch (error) {
            console.error('Error getting product:', error);
            throw new Error(error.message || config.messages.error.server);
        }
    }

    // Get featured products
    async getFeaturedProducts() {
        try {
            const response = await fetch(`${this.baseUrl}${config.api.products.getFeatured}`);
            return this.handleResponse(response);
        } catch (error) {
            console.error('Error getting featured products:', error);
            throw new Error(error.message || config.messages.error.server);
        }
    }

    // Get product categories
    async getCategories() {
        try {
            const response = await fetch(`${this.baseUrl}${config.api.products.getCategories}`);
            return this.handleResponse(response);
        } catch (error) {
            console.error('Error getting categories:', error);
            throw new Error(error.message || config.messages.error.server);
        }
    }

    // Get products by category
    async getProductsByCategory(categoryId) {
        try {
            const response = await fetch(`${this.baseUrl}${config.api.products.getByCategory}/${categoryId}`);
            return this.handleResponse(response);
        } catch (error) {
            console.error('Error getting products by category:', error);
            throw new Error(error.message || config.messages.error.server);
        }
    }
}

// Export a singleton instance
export const productService = new ProductService(); 