const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon = menuBtn.querySelector("i");

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
  const cartCount = document.getElementById('cart-count');
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = totalItems;
  cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
}

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

function showNotification(productName, price, imageSrc) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  
  notification.innerHTML = `
    <div class="notification-content">
      <img src="${imageSrc}" alt="${productName}" class="notification-image">
      <div class="notification-details">
        <p class="notification-message">${productName} added to cart</p>
        <p class="notification-price">${formatPrice(parsePrice(price))}</p>
      </div>
      <button class="notification-close"><i class="ri-close-line"></i></button>
    </div>
  `;

  document.body.appendChild(notification);
  
  // Show notification with animation
  setTimeout(() => notification.classList.add('show'), 100);
  
  // Add click event to close button
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.addEventListener('click', () => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  });
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

function addToCart(productId, productName, price, imageSrc) {
  // Get existing cart or initialize empty array
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Parse the price to ensure consistent format
  const numericPrice = parsePrice(price);
  
  // Check if item already exists in cart
  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: productId,
      name: productName,
      price: formatPrice(numericPrice),
      image: imageSrc,
      quantity: 1
    });
  }
  
  // Save updated cart to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Update cart count
  updateCartCount();
  
  // Show notification
  showNotification(productName, price, imageSrc);
  
  // Animate button
  const button = document.querySelector(`[data-id="${productId}"] .product__btn`);
  if (button) {
    button.classList.add('added');
    setTimeout(() => button.classList.remove('added'), 1000);
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize cart count
  updateCartCount();

  // Add event listeners to all Add to Cart buttons
  const addToCartButtons = document.querySelectorAll('.product__btn');
  
  addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
      const productCard = button.closest('.product__card');
      if (!productCard) return; // Skip if no product card found
      
      const productId = productCard.dataset.id;
      const productName = productCard.querySelector('h4').textContent;
      const price = productCard.querySelector('p').textContent;
      const imageSrc = productCard.querySelector('img').src;
      
      addToCart(productId, productName, price, imageSrc);
    });
  });

  // Mobile menu functionality
  const menuBtn = document.getElementById('menu-btn');
  const navLinks = document.getElementById('nav-links');

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('show');
      menuBtn.classList.toggle('show');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
        navLinks.classList.remove('show');
        menuBtn.classList.remove('show');
      }
    });
  }

  // Initialize ScrollReveal if it exists
  if (typeof ScrollReveal !== 'undefined') {
    const sr = ScrollReveal({
      origin: 'top',
      distance: '60px',
      duration: 2500,
      delay: 400
    });

    sr.reveal('.section__header', { delay: 100 });
    sr.reveal('.product__card', { delay: 100, interval: 100 });
  }

  // Initialize Swiper if elements with class .swiper exist
  if (document.querySelector('.swiper')) {
    const swiper = new Swiper('.swiper', {
      loop: true,
      spaceBetween: 32,
      grabCursor: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        600: {
          slidesPerView: 2,
        },
        968: {
          slidesPerView: 3,
        },
      },
    });
  }
});
