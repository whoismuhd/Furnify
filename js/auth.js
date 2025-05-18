import { loginUser, registerUser, setToken, isAuthenticated, forgotPassword, resetPassword } from './api.js';
import { PasswordStrengthValidator } from './password-strength.js';

// Initialize password strength validators
const passwordInputs = document.querySelectorAll('input[type="password"]');
const passwordValidators = new Map();

passwordInputs.forEach(input => {
    const strengthIndicator = input.parentElement.querySelector('.password-strength');
    if (strengthIndicator) {
        passwordValidators.set(input, new PasswordStrengthValidator(input, strengthIndicator));
    }
});

// Check if user is already logged in
if (isAuthenticated()) {
    window.location.href = 'index.html';
}

// Handle login form submission
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        try {
            const response = await loginUser(email, password);
            setToken(response.token, rememberMe);
            window.location.href = 'index.html';
        } catch (error) {
            showError(error.message || 'Login failed. Please try again.');
        }
    });
}

// Handle registration form submission
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validate password match
        if (password !== confirmPassword) {
            showError('Passwords do not match');
            return;
        }

        // Check password strength
        const passwordValidator = passwordValidators.get(document.getElementById('password'));
        if (passwordValidator) {
            const { isValid } = passwordValidator.checkStrength();
            if (!isValid) {
                showError('Please ensure your password meets all requirements');
                return;
            }
        }

        try {
            const response = await registerUser(name, email, password);
            // Redirect to verification page with email
            window.location.href = `verify-email.html?email=${encodeURIComponent(email)}`;
        } catch (error) {
            showError(error.message || 'Registration failed. Please try again.');
        }
    });
}

// Handle forgot password form submission
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;

        try {
            await forgotPassword(email);
            showSuccess('Password reset instructions have been sent to your email.');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 3000);
        } catch (error) {
            showError(error.message || 'Failed to send reset instructions. Please try again.');
        }
    });
}

// Handle reset password form submission
const resetPasswordForm = document.getElementById('resetPasswordForm');
if (resetPasswordForm) {
    resetPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validate password match
        if (password !== confirmPassword) {
            showError('Passwords do not match');
            return;
        }

        // Check password strength
        const passwordValidator = passwordValidators.get(document.getElementById('password'));
        if (passwordValidator) {
            const { isValid } = passwordValidator.checkStrength();
            if (!isValid) {
                showError('Please ensure your password meets all requirements');
                return;
            }
        }

        // Get token from URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (!token) {
            showError('Invalid or missing reset token');
            return;
        }

        try {
            await resetPassword(token, password);
            showSuccess('Password has been reset successfully.');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 3000);
        } catch (error) {
            showError(error.message || 'Failed to reset password. Please try again.');
        }
    });
}

// Handle Google login
const googleButtons = document.querySelectorAll('.auth-button.google');
googleButtons.forEach(button => {
    button.addEventListener('click', () => {
        // TODO: Implement Google OAuth
        showError('Google login is not implemented yet');
    });
});

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