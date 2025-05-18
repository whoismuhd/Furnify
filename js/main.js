import { getProducts, createOrder, isAuthenticated, getToken } from './api.js';
import { cartService } from './services/cartService.js';
import { utilityService } from './services/utilityService.js';

// Global state
let cartCount = 0;

// Initialize cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];
updateCartCount();

// Load products from API
async function loadProducts() {
  try {
    const result = await getProducts();
    if (result.success) {
      displayProducts(result.data);
    } else {
      console.error('Error loading products:', result.error);
    }
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

// Display products in the grid
function displayProducts(products) {
  const productsGrid = document.querySelector('.products-grid');
  if (!productsGrid) return;

  productsGrid.innerHTML = products.map(product => `
    <div class="product-card" data-id="${product._id}">
      <img src="${product.image}" alt="${product.name}" class="product__img">
      <h3 class="product__title">${product.name}</h3>
      <p class="product__description">${product.description}</p>
      <p class="product__price">₺${product.price.toLocaleString('tr-TR')}</p>
      <button class="product__btn ${product.stock > 0 ? '' : 'disabled'}" 
              ${product.stock > 0 ? '' : 'disabled'}>
        ${product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
      </button>
    </div>
  `).join('');

  // Add event listeners to Add to Cart buttons
  document.querySelectorAll('.product__btn:not(.disabled)').forEach(button => {
    button.addEventListener('click', handleAddToCart);
  });
}

// Handle Add to Cart button click
function handleAddToCart(event) {
  const productCard = event.target.closest('.product-card');
  const productId = productCard.dataset.id;
  const productName = productCard.querySelector('.product__title').textContent;
  const productPrice = parseFloat(productCard.querySelector('.product__price').textContent.replace('₺', '').replace('.', '').replace(',', '.'));
  const productImage = productCard.querySelector('.product__img').src;

  addToCart({
    id: productId,
    name: productName,
    price: productPrice,
    image: productImage,
    quantity: 1
  });

  // Show notification
  showNotification(productName, productImage);
  
  // Animate button
  event.target.classList.add('added');
  setTimeout(() => event.target.classList.remove('added'), 1500);
}

// Add item to cart
function addToCart(product) {
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push(product);
  }
  
  // Save to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Update cart count with animation
  updateCartCount();
}

// Update cart count
function updateCartCount() {
  const cartCountElement = document.getElementById('cartCount');
  if (cartCountElement) {
    cartCountElement.textContent = cartCount;
  }
}

// Show notification when item is added to cart
function showNotification(productName, productImage) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  
  notification.innerHTML = `
    <div class="notification-content">
      <img src="${productImage}" alt="${productName}" class="notification-image">
      <div class="notification-details">
        <p class="notification-message">${productName} added to cart</p>
      </div>
      <button class="notification-close">&times;</button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Show notification with animation
  setTimeout(() => notification.classList.add('show'), 100);
  
  // Add close button functionality
  notification.querySelector('.notification-close').addEventListener('click', () => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  });
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Handle navigation
function handleNavigation() {
    const navLinks = document.querySelectorAll('.nav__links a');
    const currentPath = window.location.pathname;

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
}

// Handle mobile menu
function handleMobileMenu() {
    const menuBtn = document.getElementById('menu-btn');
    const navLinks = document.getElementById('nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('show');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
                navLinks.classList.remove('show');
            }
        });
    }
}

// Handle scroll to top
function handleScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTop');
    if (scrollBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollBtn.classList.add('show');
            } else {
                scrollBtn.classList.remove('show');
            }
        });

        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Handle search functionality
function handleSearch() {
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const searchInput = searchForm.querySelector('input[type="search"]');
            const query = searchInput.value.trim();
            if (query) {
                window.location.href = `/products.html?search=${encodeURIComponent(query)}`;
            }
        });
    }
}

// Handle contact form popup
function handleContactForm() {
    const contactLinks = document.querySelectorAll('.contact-link');
    const popup = document.getElementById('contactPopup');
    const closeBtn = document.getElementById('closePopup');
    const contactForm = document.getElementById('contactForm');

    if (!popup || !closeBtn || !contactForm) return;

    // Open popup when clicking contact links
    contactLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            popup.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });

    // Close popup when clicking close button
    closeBtn.addEventListener('click', () => {
        closePopup();
    });

    // Close popup when clicking outside
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            closePopup();
        }
    });

    // Close popup when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popup.classList.contains('show')) {
            closePopup();
        }
    });

    // Handle form submission
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('.submit__btn');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="ri-loader-4-line"></i> Sending...';
        submitBtn.disabled = true;

        try {
            // Get form data
            const formData = {
                name: contactForm.querySelector('#name').value,
                email: contactForm.querySelector('#email').value,
                subject: contactForm.querySelector('#subject').value,
                message: contactForm.querySelector('#message').value
            };

            // Simulate form submission (replace with actual API call)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            console.log('Form submitted:', formData); // For debugging
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.innerHTML = '<i class="ri-check-line"></i> Message sent successfully!';
            contactForm.insertBefore(successMessage, contactForm.firstChild);
            
            // Reset form
            contactForm.reset();
            
            // Close popup after delay
            setTimeout(() => {
                closePopup();
                successMessage.remove();
            }, 2000);

        } catch (error) {
            console.error('Error submitting form:', error);
            
            // Show error message
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.innerHTML = '<i class="ri-error-warning-line"></i> Failed to send message. Please try again.';
            contactForm.insertBefore(errorMessage, contactForm.firstChild);
            
            // Remove error message after 3 seconds
            setTimeout(() => errorMessage.remove(), 3000);
        } finally {
            // Restore button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });

    // Helper function to close popup
    function closePopup() {
        popup.classList.remove('show');
        document.body.style.overflow = ''; // Restore scrolling
        
        // Remove any existing messages
        const messages = contactForm.querySelectorAll('.success-message, .error-message');
        messages.forEach(msg => msg.remove());
        
        // Reset form
        contactForm.reset();
    }
}

// Initialize the application
async function initializeApp() {
    handleNavigation();
    handleMobileMenu();
    handleScrollToTop();
    handleSearch();
    handleContactForm();
    await initializeCartCount();
}

// Start the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp); 