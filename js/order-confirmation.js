// Get order ID from URL
const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get('orderId');

if (!orderId) {
    window.location.href = 'index.html';
}

// Load order details
async function loadOrderDetails() {
    try {
        const order = await getOrder(orderId);
        
        // Update order information
        document.getElementById('orderNumber').textContent = order._id;
        document.getElementById('orderDate').textContent = new Date(order.createdAt).toLocaleDateString();
        document.getElementById('paymentMethod').textContent = order.payment.method === 'card' ? 'Credit Card' : 'PayPal';
        document.getElementById('orderStatus').textContent = order.status.charAt(0).toUpperCase() + order.status.slice(1);
        
        // Update order items
        const orderItems = document.getElementById('orderItems');
        orderItems.innerHTML = '';
        
        order.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'order-item';
            itemElement.innerHTML = `
                <img src="${item.product.image}" alt="${item.product.name}">
                <div class="order-item-details">
                    <div class="order-item-title">${item.product.name}</div>
                    <div class="order-item-price">$${item.product.price.toFixed(2)} x ${item.quantity}</div>
                    <div class="order-item-total">$${(item.product.price * item.quantity).toFixed(2)}</div>
                </div>
            `;
            orderItems.appendChild(itemElement);
        });
        
        // Update total amount
        document.getElementById('orderTotal').textContent = `$${order.total.toFixed(2)}`;
        
    } catch (error) {
        console.error('Error loading order details:', error);
        showError('Failed to load order details. Please try again.');
    }
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    const container = document.querySelector('.confirmation-container');
    container.insertBefore(errorDiv, container.firstChild);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Initialize order confirmation page
document.addEventListener('DOMContentLoaded', loadOrderDetails); 