// Authentication JavaScript

const API_URL = '/api';

// Login
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = new FormData(loginForm);
            const data = Object.fromEntries(formData);

            try {
                const response = await fetch(`${API_URL}/users/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (result.success) {
                    localStorage.setItem('token', result.token);
                    localStorage.setItem('user', JSON.stringify(result.user));
                    showToast('Login successful!', 'success');
                    setTimeout(() => {
                        window.location.href = '/dashboard';
                    }, 1000);
                } else {
                    showToast(result.message || 'Login failed', 'error');
                }
            } catch (error) {
                showToast('Error logging in. Please try again.', 'error');
            }
        });
    }

    // Register
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = new FormData(registerForm);
            const data = Object.fromEntries(formData);

            // Validate passwords match
            if (data.password !== data.confirmPassword) {
                showToast('Passwords do not match', 'error');
                return;
            }

            delete data.confirmPassword;

            try {
                const response = await fetch(`${API_URL}/users/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (result.success) {
                    localStorage.setItem('token', result.token);
                    localStorage.setItem('user', JSON.stringify(result.user));
                    showToast('Registration successful!', 'success');
                    setTimeout(() => {
                        window.location.href = '/dashboard';
                    }, 1000);
                } else {
                    showToast(result.message || 'Registration failed', 'error');
                }
            } catch (error) {
                showToast('Error registering. Please try again.', 'error');
            }
        });
    }

    // Toggle password visibility
    const togglePasswordBtns = document.querySelectorAll('#togglePassword');
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
});
