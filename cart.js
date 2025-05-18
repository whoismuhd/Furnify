// Cart page functionality
function formatPrice(price) {
  // If price is already a number, format it directly
  if (typeof price === 'number') {
    return '₺' + price.toLocaleString('tr-TR', {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    });
  }
  
  // Convert string price to number (handle Turkish format)
  const numericPrice = parseFloat(price.replace('₺', '').replace(/\./g, '').replace(',', '.'));
  return '₺' + numericPrice.toLocaleString('tr-TR', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3
  });
}

function parsePrice(priceString) {
  // Remove currency symbol and convert to number
  return parseFloat(priceString.replace('₺', '').replace(/\./g, '').replace(',', '.'));
}

function updateCartDisplay() {
  const cartItemsContainer = document.querySelector('.cart-items');
  const subtotalElement = document.querySelector('#cart-subtotal');
  const totalElement = document.querySelector('#cart-total');
  const checkoutBtn = document.querySelector('.checkout-btn');
  
  if (!cartItemsContainer) return;
  
  // Get latest cart data
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart">
        <i class="ri-shopping-cart-line"></i>
        <p>Your cart is empty</p>
        <a href="products.html" class="btn">Continue Shopping</a>
      </div>
    `;
    if (subtotalElement) subtotalElement.textContent = formatPrice(0);
    if (totalElement) totalElement.textContent = formatPrice(0);
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }
  
  cartItemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item__details">
        <h4>${item.name}</h4>
        <p>${item.price}</p>
        <div class="cart-item__quantity">
          <button class="quantity-btn minus" data-id="${item.id}" data-change="-1">-</button>
          <span>${item.quantity}</span>
          <button class="quantity-btn plus" data-id="${item.id}" data-change="1">+</button>
        </div>
      </div>
      <button class="remove-item" data-id="${item.id}">
        <i class="ri-delete-bin-line"></i>
      </button>
    </div>
  `).join('');
  
  // Calculate totals with proper decimal handling
  const subtotal = cart.reduce((sum, item) => {
    const itemPrice = parsePrice(item.price);
    const itemTotal = itemPrice * item.quantity;
    return sum + itemTotal;
  }, 0);
  
  // Fixed shipping cost in Turkish Lira
  const shipping = subtotal > 0 ? 29.999 : 0;
  const total = subtotal + shipping;
  
  // Update totals with Turkish formatting
  if (subtotalElement) {
    subtotalElement.textContent = formatPrice(subtotal);
  }
  if (totalElement) {
    totalElement.textContent = formatPrice(total);
  }
  if (checkoutBtn) {
    checkoutBtn.disabled = false;
  }

  // Add event listeners to quantity buttons and remove buttons
  const quantityButtons = cartItemsContainer.querySelectorAll('.quantity-btn');
  quantityButtons.forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.dataset.id;
      const change = parseInt(button.dataset.change);
      updateQuantity(productId, change);
    });
  });

  const removeButtons = cartItemsContainer.querySelectorAll('.remove-item');
  removeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.dataset.id;
      removeItem(productId);
    });
  });
}

function updateQuantity(productId, change) {
  // Get latest cart data
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const itemIndex = cart.findIndex(item => item.id === productId);
  
  if (itemIndex === -1) return;
  
  cart[itemIndex].quantity += change;
  
  if (cart[itemIndex].quantity <= 0) {
    cart.splice(itemIndex, 1);
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartDisplay();
  
  // Update cart count in main.js
  if (typeof updateCartCount === 'function') {
    updateCartCount();
  }
}

function removeItem(productId) {
  // Get latest cart data
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartDisplay();
  
  // Update cart count in main.js
  if (typeof updateCartCount === 'function') {
    updateCartCount();
  }
}

// Initialize cart display
document.addEventListener('DOMContentLoaded', () => {
  updateCartDisplay();
  
  // Add checkout button handler
  const checkoutBtn = document.querySelector('.checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      // Get latest cart data
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      
      if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
      }
      
      // Add loading state
      checkoutBtn.disabled = true;
      checkoutBtn.innerHTML = '<i class="ri-loader-4-line"></i> Processing...';
      
      // Simulate checkout process
      setTimeout(() => {
        alert('Checkout functionality coming soon!');
        checkoutBtn.disabled = false;
        checkoutBtn.innerHTML = 'Proceed to Checkout';
      }, 1500);
    });
  }
}); 