import config from '../config.js';

class UtilityService {
    // Format currency
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: config.currency.code
        }).format(amount);
    }

    // Format date
    formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    }

    // Check password strength
    checkPasswordStrength(password) {
        let strength = 0;
        const requirements = {
            length: password.length >= config.password.minLength,
            uppercase: config.password.requireUppercase ? /[A-Z]/.test(password) : true,
            lowercase: config.password.requireLowercase ? /[a-z]/.test(password) : true,
            number: config.password.requireNumber ? /[0-9]/.test(password) : true,
            special: config.password.requireSpecial ? /[^A-Za-z0-9]/.test(password) : true
        };

        Object.values(requirements).forEach(met => {
            if (met) strength++;
        });

        return {
            score: strength,
            requirements
        };
    }

    // Calculate cart totals
    calculateCartTotals(items) {
        const subtotal = items.reduce((total, item) => 
            total + (item.product.price * item.quantity), 0);
        
        const shipping = subtotal > config.cart.freeShippingThreshold ? 0 : config.cart.shippingCost;
        const tax = subtotal * config.cart.taxRate;
        const total = subtotal + shipping + tax;

        return {
            subtotal,
            shipping,
            tax,
            total
        };
    }

    // Show notification
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Validate email
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Format phone number
    formatPhoneNumber(phone) {
        const cleaned = phone.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return '(' + match[1] + ') ' + match[2] + '-' + match[3];
        }
        return phone;
    }

    // Generate order number
    generateOrderNumber() {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `ORD-${year}${month}${day}-${random}`;
    }
}

// Export a singleton instance
export const utilityService = new UtilityService(); 