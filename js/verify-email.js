import { resendVerificationEmail, verifyEmail } from './api.js';

// Get email from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const email = urlParams.get('email');
const token = urlParams.get('token');

// If token exists, verify the email
if (token) {
    verifyEmail(token)
        .then(() => {
            showSuccess('Email verified successfully! You can now login.');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 3000);
        })
        .catch(error => {
            showError(error.message || 'Failed to verify email. Please try again.');
        });
}

// Handle resend verification email
const resendButton = document.getElementById('resendButton');
const countdownSpan = document.getElementById('countdown');
let countdown = 60;
let timer = null;

function startCountdown() {
    resendButton.disabled = true;
    countdown = 60;
    
    timer = setInterval(() => {
        countdown--;
        countdownSpan.textContent = countdown;
        
        if (countdown <= 0) {
            clearInterval(timer);
            resendButton.disabled = false;
        }
    }, 1000);
}

resendButton.addEventListener('click', async () => {
    if (!email) {
        showError('Email address not found. Please register again.');
        return;
    }

    try {
        await resendVerificationEmail(email);
        showSuccess('Verification email has been resent. Please check your inbox.');
        startCountdown();
    } catch (error) {
        showError(error.message || 'Failed to resend verification email. Please try again.');
    }
});

// Start countdown if no token is present
if (!token) {
    startCountdown();
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;

    const form = document.querySelector('.auth-form');
    const existingError = form.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    form.insertBefore(errorDiv, form.firstChild);

    // Remove error after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Show success message
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;

    const form = document.querySelector('.auth-form');
    const existingMessage = form.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    form.insertBefore(successDiv, form.firstChild);
} 