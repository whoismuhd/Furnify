import { createOrder, isAuthenticated, getToken } from './api.js';

// Initialize cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Format price in Turkish Lira
function formatPrice(price) {
  return price.toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Update cart display
function updateCartDisplay() {
  const cartContainer = document.querySelector('.cart-container');
  const cartItems = document.querySelector('.cart-items');
  const emptyCartMessage = document.querySelector('.empty-cart-message');
  const cartTotals = document.querySelector('.cart-totals');
  const checkoutBtn = document.querySelector('.checkout-btn');
  
  if (cart.length === 0) {
    cartItems.style.display = 'none';
    cartTotals.style.display = 'none';
    emptyCartMessage.style.display = 'block';
    checkoutBtn.disabled = true;
    return;
  }
  
  cartItems.style.display = 'block';
  cartTotals.style.display = 'block';
  emptyCartMessage.style.display = 'none';
  checkoutBtn.disabled = false;
  
  // Update cart items
  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <img src="${item.image}" alt="${item.name}" class="cart-item__image">
      <div class="cart-item__details">
        <h3 class="cart-item__title">${item.name}</h3>
        <p class="cart-item__price">₺${formatPrice(item.price)}</p>
        <div class="cart-item__quantity">
          <button class="quantity-btn minus">-</button>
          <span class="quantity">${item.quantity}</span>
          <button class="quantity-btn plus">+</button>
        </div>
      </div>
      <button class="remove-item">&times;</button>
    </div>
  `).join('');
  
  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = subtotal > 0 ? 29.99 : 0;
  const total = subtotal + shippingCost;
  
  // Update totals display
  cartTotals.innerHTML = `
    <div class="cart-total__item">
      <span>Subtotal:</span>
      <span>₺${formatPrice(subtotal)}</span>
    </div>
    <div class="cart-total__item">
      <span>Shipping:</span>
      <span>₺${formatPrice(shippingCost)}</span>
    </div>
    <div class="cart-total__item total">
      <span>Total:</span>
      <span>₺${formatPrice(total)}</span>
    </div>
  `;
  
  // Add event listeners
  document.querySelectorAll('.quantity-btn').forEach(btn => {
    btn.addEventListener('click', handleQuantityChange);
  });
  
  document.querySelectorAll('.remove-item').forEach(btn => {
    btn.addEventListener('click', handleRemoveItem);
  });
}

// Handle quantity change
function handleQuantityChange(event) {
  const cartItem = event.target.closest('.cart-item');
  const itemId = cartItem.dataset.id;
  const item = cart.find(item => item.id === itemId);
  
  if (event.target.classList.contains('plus')) {
    item.quantity += 1;
  } else if (event.target.classList.contains('minus') && item.quantity > 1) {
    item.quantity -= 1;
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartDisplay();
}

// Handle remove item
function handleRemoveItem(event) {
  const cartItem = event.target.closest('.cart-item');
  const itemId = cartItem.dataset.id;
  cart = cart.filter(item => item.id !== itemId);
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartDisplay();
}

// Handle checkout
async function handleCheckout() {
  if (!isAuthenticated()) {
    alert('Please log in to checkout');
    window.location.href = '/login.html';
    return;
  }
  
  const checkoutBtn = document.querySelector('.checkout-btn');
  checkoutBtn.disabled = true;
  checkoutBtn.textContent = 'Processing...';
  
  try {
    const orderData = {
      items: cart.map(item => ({
        product: item.id,
        quantity: item.quantity,
        price: item.price
      })),
      shippingAddress: {
        street: '123 Main St', // This should come from a form
        city: 'City',
        state: 'State',
        zipCode: '12345',
        country: 'Country'
      },
      paymentMethod: 'credit_card',
      subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      shippingCost: 29.99
    };
    
    const result = await createOrder(orderData, getToken());
    
    if (result.success) {
      // Clear cart
      cart = [];
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // Show success message
      alert('Order placed successfully!');
      window.location.href = '/orders.html';
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Error creating order:', error);
    alert('Error creating order. Please try again.');
  } finally {
    checkoutBtn.disabled = false;
    checkoutBtn.textContent = 'Checkout';
  }
}

// Handle checkout button click
const checkoutBtn = document.getElementById('checkoutBtn');
checkoutBtn.addEventListener('click', () => {
    if (!isAuthenticated()) {
        window.location.href = 'login.html?redirect=checkout.html';
        return;
    }
    window.location.href = 'checkout.html';
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  updateCartDisplay();
  
  const checkoutBtn = document.querySelector('.checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', handleCheckout);
  }
}); 