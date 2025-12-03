// Component Loader - Loads header and footer dynamically
const API_URL = 'https://certedtechnologies.com/api';

document.addEventListener('DOMContentLoaded', function() {
    loadComponent('header-placeholder', '../components/header.html');
    loadComponent('footer-placeholder', '../components/footer.html');
});

async function loadComponent(placeholderId, componentPath) {
    try {
        const placeholder = document.getElementById(placeholderId);
        if (!placeholder) return;

        const response = await fetch(componentPath);
        const html = await response.text();
        placeholder.innerHTML = html;

        // Initialize auth state after header loads
        if (placeholderId === 'header-placeholder') {
            initializeAuthState();
            loadHeaderCategories();
        }
    } catch (error) {
        console.error('Error loading component:', error);
    }
}

// Initialize authentication state
function initializeAuthState() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const authButtons = document.getElementById('authButtons');
    const userDropdown = document.getElementById('userDropdown');

    if (token && user.name) {
        // User is logged in
        if (authButtons) authButtons.classList.add('d-none');
        if (userDropdown) {
            userDropdown.classList.remove('d-none');
            document.getElementById('userName').textContent = user.name;
            document.getElementById('userAvatar').src = user.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name);
        }

        // Logout functionality
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                showToast('Logged out successfully', 'success');
                setTimeout(() => window.location.href = '/', 1000);
            });
        }
    } else {
        // User is not logged in
        if (authButtons) authButtons.classList.remove('d-none');
        if (userDropdown) userDropdown.classList.add('d-none');
    }
}

// Load categories in header dropdown
async function loadHeaderCategories() {
    try {
        const response = await fetch(`${API_URL}/categories`);
        const result = await response.json();

        if (result.success) {
            const dropdown = document.getElementById('categoriesDropdown');
            if (dropdown) {
                const categoriesHTML = result.data.map(cat => `
                    <li><a class="dropdown-item" href="/courses?category=${cat._id}">
                        <i class="${cat.icon} me-2"></i>${cat.name}
                    </a></li>
                `).join('');
                
                dropdown.innerHTML += categoriesHTML;
            }
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Show toast notification
function showToast(message, type = 'info') {
    const toastHTML = `
        <div class="toast align-items-center text-white bg-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'primary'} border-0" role="alert">
            <div class="d-flex">
                <div class="toast-body">
                    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} me-2"></i>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;

    const toastContainer = document.createElement('div');
    toastContainer.innerHTML = toastHTML;
    document.body.appendChild(toastContainer);

    const toastElement = toastContainer.querySelector('.toast');
    const toast = new bootstrap.Toast(toastElement);
    toast.show();

    toastElement.addEventListener('hidden.bs.toast', () => {
        toastContainer.remove();
    });
}

// Back to top button
window.addEventListener('scroll', function() {
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        if (window.pageYOffset > 300) {
            backToTop.classList.remove('d-none');
        } else {
            backToTop.classList.add('d-none');
        }
    }
});

// Smooth scroll to top
document.addEventListener('click', function(e) {
    if (e.target.closest('#backToTop')) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});
