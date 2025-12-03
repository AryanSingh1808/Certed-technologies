// Dashboard JavaScript

const API_URL = 'http://localhost:5000/api';

// Check authentication
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login';
        return false;
    }
    return token;
}

// Load user profile
async function loadUserProfile() {
    const token = checkAuth();
    if (!token) return;

    try {
        const response = await fetch(`${API_URL}/users/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const result = await response.json();

        if (result.success) {
            const user = result.data;
            
            // Update dashboard header
            document.getElementById('dashboardUserName').textContent = user.name;
            document.getElementById('dashboardUserEmail').textContent = user.email;
            document.getElementById('dashboardAvatar').src = user.avatar;

            // Update stats
            document.getElementById('totalEnrolled').textContent = user.enrolledCourses?.length || 0;
            document.getElementById('totalCompleted').textContent = user.enrolledCourses?.filter(c => c.status === 'completed').length || 0;
            document.getElementById('totalCertificates').textContent = user.certificates?.length || 0;
            document.getElementById('totalWishlist').textContent = user.wishlist?.length || 0;

            // Load sections
            loadEnrolledCourses(user.enrolledCourses);
            loadWishlist(user.wishlist);
            loadCertificates(user.certificates);
            loadProfileForm(user);
        } else {
            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
    } catch (error) {
        console.error('Error loading profile:', error);
        showToast('Error loading profile', 'error');
    }
}

// Load enrolled courses
function loadEnrolledCourses(courses) {
    const container = document.getElementById('enrolledCoursesContainer');
    
    if (!courses || courses.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-book fa-4x text-muted mb-3"></i>
                <h5>No enrolled courses yet</h5>
                <p class="text-muted">Start learning by enrolling in a course</p>
                <a href="/courses" class="btn btn-primary">Browse Courses</a>
            </div>
        `;
        return;
    }

    container.innerHTML = courses.map(enrollment => {
        const course = enrollment.course;
        return `
            <div class="col-md-6">
                <div class="card shadow-sm">
                    <div class="row g-0">
                        <div class="col-4">
                            <img src="${course.thumbnail}" class="img-fluid rounded-start h-100" alt="${course.title}">
                        </div>
                        <div class="col-8">
                            <div class="card-body">
                                <h6 class="card-title fw-bold">${course.title}</h6>
                                <p class="text-muted small mb-2">Enrolled: ${new Date(enrollment.enrolledAt).toLocaleDateString()}</p>
                                <div class="progress mb-2" style="height: 8px;">
                                    <div class="progress-bar" style="width: ${enrollment.progress || 0}%"></div>
                                </div>
                                <small class="text-muted">${enrollment.progress || 0}% Complete</small>
                                <div class="mt-2">
                                    <a href="/course/${course._id}" class="btn btn-sm btn-primary">Continue Learning</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Load wishlist
function loadWishlist(wishlist) {
    const container = document.getElementById('wishlistContainer');
    
    if (!wishlist || wishlist.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-heart fa-4x text-muted mb-3"></i>
                <h5>Your wishlist is empty</h5>
                <p class="text-muted">Add courses you're interested in</p>
                <a href="/courses" class="btn btn-primary">Browse Courses</a>
            </div>
        `;
        return;
    }

    container.innerHTML = wishlist.map(course => `
        <div class="col-md-4">
            <div class="card shadow-sm h-100">
                <img src="${course.thumbnail}" class="card-img-top course-thumbnail" alt="${course.title}">
                <div class="card-body">
                    <h6 class="fw-bold mb-2">${course.title}</h6>
                    <p class="text-primary fw-bold">₹${course.price.discounted || course.price.regular}</p>
                    <div class="d-flex gap-2">
                        <a href="/course/${course._id}" class="btn btn-sm btn-primary flex-grow-1">View</a>
                        <button class="btn btn-sm btn-danger" onclick="removeFromWishlist('${course._id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Load certificates
function loadCertificates(certificates) {
    const container = document.getElementById('certificatesContainer');
    
    if (!certificates || certificates.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-certificate fa-4x text-muted mb-3"></i>
                <h5>No certificates yet</h5>
                <p class="text-muted">Complete courses to earn certificates</p>
            </div>
        `;
        return;
    }

    container.innerHTML = certificates.map(cert => `
        <div class="col-md-6">
            <div class="card shadow-sm">
                <div class="card-body">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-certificate fa-3x text-warning me-3"></i>
                        <div class="flex-grow-1">
                            <h6 class="fw-bold mb-1">${cert.course?.title}</h6>
                            <p class="text-muted small mb-1">Certificate ID: ${cert.certificateId}</p>
                            <small class="text-muted">Issued: ${new Date(cert.issuedDate).toLocaleDateString()}</small>
                        </div>
                        <a href="${cert.certificateUrl}" class="btn btn-sm btn-primary" download>
                            <i class="fas fa-download"></i> Download
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Load profile form
function loadProfileForm(user) {
    document.getElementById('profileName').value = user.name || '';
    document.getElementById('profilePhone').value = user.phone || '';
    document.getElementById('profileCity').value = user.address?.city || '';
    document.getElementById('profileState').value = user.address?.state || '';
}

// Remove from wishlist
async function removeFromWishlist(courseId) {
    const token = checkAuth();
    if (!token) return;

    try {
        const response = await fetch(`${API_URL}/wishlist/${courseId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const result = await response.json();

        if (result.success) {
            showToast('Removed from wishlist', 'success');
            loadUserProfile();
        } else {
            showToast(result.message, 'error');
        }
    } catch (error) {
        showToast('Error removing from wishlist', 'error');
    }
}

// Update profile form
document.addEventListener('DOMContentLoaded', function() {
    loadUserProfile();

    const updateProfileForm = document.getElementById('updateProfileForm');
    if (updateProfileForm) {
        updateProfileForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const token = checkAuth();
            if (!token) return;

            const formData = new FormData(updateProfileForm);
            const data = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                address: {
                    city: formData.get('address.city'),
                    state: formData.get('address.state')
                }
            };

            try {
                const response = await fetch(`${API_URL}/users/profile`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (result.success) {
                    showToast('Profile updated successfully', 'success');
                    
                    // Update localStorage
                    const user = JSON.parse(localStorage.getItem('user'));
                    user.name = data.name;
                    localStorage.setItem('user', JSON.stringify(user));
                    
                    loadUserProfile();
                } else {
                    showToast(result.message, 'error');
                }
            } catch (error) {
                showToast('Error updating profile', 'error');
            }
        });
    }

    // Change password form
    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const token = checkAuth();
            if (!token) return;

            const formData = new FormData(changePasswordForm);
            const data = Object.fromEntries(formData);

            if (data.newPassword !== data.confirmPassword) {
                showToast('New passwords do not match', 'error');
                return;
            }

            delete data.confirmPassword;

            try {
                const response = await fetch(`${API_URL}/users/change-password`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (result.success) {
                    showToast('Password changed successfully', 'success');
                    changePasswordForm.reset();
                } else {
                    showToast(result.message, 'error');
                }
            } catch (error) {
                showToast('Error changing password', 'error');
            }
        });
    }
});
