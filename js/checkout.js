// Payment method selection
const paymentMethods = document.querySelectorAll('.payment-method');
const cardPaymentForm = document.getElementById('cardPaymentForm');

paymentMethods.forEach(method => {
    method.addEventListener('click', () => {
        paymentMethods.forEach(m => m.classList.remove('selected'));
        method.classList.add('selected');
        
        if (method.dataset.method === 'card') {
            cardPaymentForm.style.display = 'block';
        } else {
            cardPaymentForm.style.display = 'none';
        }
    });
});

// Format card number input
const cardNumber = document.getElementById('cardNumber');
cardNumber.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})/g, '$1 ').trim();
    e.target.value = value;
});

// Format expiry date input
const expiryDate = document.getElementById('expiryDate');
expiryDate.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2);
    }
    e.target.value = value;
});

// Format CVV input
const cvv = document.getElementById('cvv');
cvv.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3);
});

// Load cart items and calculate totals
async function loadCheckoutData() {
    try {
        const cart = await getCart();
        if (!cart || cart.items.length === 0) {
            window.location.href = 'cart.html';
            return;
        }

        const orderItems = document.getElementById('orderItems');
        orderItems.innerHTML = '';

        let subtotal = 0;
        const shipping = 29.99; // Fixed shipping cost
        const taxRate = 0.18; // 18% tax rate

        cart.items.forEach(item => {
            const itemTotal = item.product.price * item.quantity;
            subtotal += itemTotal;

            const itemElement = document.createElement('div');
            itemElement.className = 'order-item';
            itemElement.innerHTML = `
                <img src="${item.product.image}" alt="${item.product.name}">
                <div class="order-item-details">
                    <div class="order-item-title">${item.product.name}</div>
                    <div class="order-item-price">$${item.product.price.toFixed(2)} x ${item.quantity}</div>
                    <div class="order-item-total">$${itemTotal.toFixed(2)}</div>
                </div>
            `;
            orderItems.appendChild(itemElement);
        });

        const tax = subtotal * taxRate;
        const total = subtotal + shipping + tax;

        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
        document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;

    } catch (error) {
        console.error('Error loading checkout data:', error);
        showError('Failed to load checkout data. Please try again.');
    }
}

// Handle form submission
const placeOrderBtn = document.getElementById('placeOrderBtn');
placeOrderBtn.addEventListener('click', async () => {
    try {
        placeOrderBtn.disabled = true;
        placeOrderBtn.textContent = 'Processing...';

        const selectedPaymentMethod = document.querySelector('.payment-method.selected').dataset.method;
        const orderData = {
            shipping: {
                fullName: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                state: document.getElementById('state').value,
                zipCode: document.getElementById('zipCode').value,
                country: document.getElementById('country').value
            },
            payment: {
                method: selectedPaymentMethod,
                ...(selectedPaymentMethod === 'card' && {
                    cardNumber: document.getElementById('cardNumber').value.replace(/\s/g, ''),
                    expiryDate: document.getElementById('expiryDate').value,
                    cvv: document.getElementById('cvv').value,
                    cardName: document.getElementById('cardName').value
                })
            }
        };

        // Create order
        const order = await createOrder(orderData);
        
        // Clear cart
        await clearCart();
        
        // Redirect to order confirmation page
        window.location.href = `order-confirmation.html?orderId=${order._id}`;
    } catch (error) {
        console.error('Error placing order:', error);
        showError('Failed to place order. Please try again.');
        placeOrderBtn.disabled = false;
        placeOrderBtn.textContent = 'Place Order';
    }
});

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    const container = document.querySelector('.checkout-container');
    container.insertBefore(errorDiv, container.firstChild);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Initialize checkout page
document.addEventListener('DOMContentLoaded', loadCheckoutData); 