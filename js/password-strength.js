export class PasswordStrengthValidator {
    constructor(passwordInput, strengthIndicator) {
        this.passwordInput = passwordInput;
        this.strengthIndicator = strengthIndicator;
        this.requirements = {
            length: { regex: /.{8,}/, message: 'At least 8 characters' },
            uppercase: { regex: /[A-Z]/, message: 'One uppercase letter' },
            lowercase: { regex: /[a-z]/, message: 'One lowercase letter' },
            number: { regex: /[0-9]/, message: 'One number' },
            special: { regex: /[^A-Za-z0-9]/, message: 'One special character' }
        };
        
        this.init();
    }

    init() {
        // Create strength bar
        this.strengthBar = document.createElement('div');
        this.strengthBar.className = 'strength-bar';
        this.strengthBar.innerHTML = '<div class="strength-bar-fill"></div>';
        this.strengthIndicator.appendChild(this.strengthBar);

        // Create strength text
        this.strengthText = document.createElement('div');
        this.strengthText.className = 'strength-text';
        this.strengthIndicator.appendChild(this.strengthText);

        // Create requirements list
        this.requirementsList = document.createElement('div');
        this.requirementsList.className = 'requirements-list';
        Object.entries(this.requirements).forEach(([key, req]) => {
            const requirement = document.createElement('div');
            requirement.className = 'requirement';
            requirement.innerHTML = `
                <i class="ri-close-circle-fill"></i>
                <span>${req.message}</span>
            `;
            requirement.dataset.requirement = key;
            this.requirementsList.appendChild(requirement);
        });
        this.strengthIndicator.appendChild(this.requirementsList);

        // Add event listener
        this.passwordInput.addEventListener('input', () => this.checkStrength());
    }

    checkStrength() {
        const password = this.passwordInput.value;
        let strength = 0;
        let validRequirements = 0;

        // Check each requirement
        Object.entries(this.requirements).forEach(([key, req]) => {
            const requirement = this.requirementsList.querySelector(`[data-requirement="${key}"]`);
            const isValid = req.regex.test(password);
            
            requirement.className = `requirement ${isValid ? 'valid' : 'invalid'}`;
            requirement.querySelector('i').className = isValid ? 'ri-checkbox-circle-fill' : 'ri-close-circle-fill';
            
            if (isValid) {
                strength += 20;
                validRequirements++;
            }
        });

        // Update strength bar
        const strengthBarFill = this.strengthBar.querySelector('.strength-bar-fill');
        strengthBarFill.style.width = `${strength}%`;
        strengthBarFill.className = 'strength-bar-fill';
        
        // Update strength text and colors
        if (strength <= 20) {
            strengthBarFill.classList.add('strength-weak');
            this.strengthText.textContent = 'Weak';
            this.strengthText.className = 'strength-text strength-weak-text';
        } else if (strength <= 60) {
            strengthBarFill.classList.add('strength-medium');
            this.strengthText.textContent = 'Medium';
            this.strengthText.className = 'strength-text strength-medium-text';
        } else {
            strengthBarFill.classList.add('strength-strong');
            this.strengthText.textContent = 'Strong';
            this.strengthText.className = 'strength-text strength-strong-text';
        }

        return {
            strength,
            validRequirements,
            isValid: validRequirements === Object.keys(this.requirements).length
        };
    }
} 