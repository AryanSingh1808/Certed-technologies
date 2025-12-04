// Course Detail Page JavaScript

const API_URL = '/api';

// Get course ID from URL
function getCourseId() {
    const pathParts = window.location.pathname.split('/');
    return pathParts[pathParts.length - 1];
}

// Load course details
async function loadCourseDetails() {
    try {
        const courseId = getCourseId();
        const response = await fetch(`${API_URL}/courses/${courseId}`);
        const result = await response.json();

        if (result.success) {
            displayCourseDetails(result.data);
            loadRelatedCourses(courseId);
        } else {
            window.location.href = '/courses';
        }
    } catch (error) {
        console.error('Error loading course:', error);
        showToast('Error loading course details', 'error');
    }
}

// Display course details
function displayCourseDetails(course) {
    // Basic info
    document.getElementById('courseTitle').textContent = course.title;
    document.getElementById('breadcrumbCourse').textContent = course.title;
    document.getElementById('courseShortDesc').textContent = course.shortDescription || course.description.substring(0, 200);
    document.getElementById('courseThumbnail').src = course.thumbnail;
    document.getElementById('courseCategory').textContent = course.category?.name || 'Category';
    document.getElementById('courseLevel').textContent = course.level;
    document.getElementById('courseRating').textContent = course.rating?.average || 0;
    document.getElementById('ratingCount').textContent = course.rating?.count || 0;
    document.getElementById('enrollmentCount').textContent = course.enrollmentCount || 0;
    document.getElementById('courseDuration').textContent = course.duration?.display || '40 Hours';

    // Delivery modes
    const deliveryModesContainer = document.getElementById('deliveryModesBadges');
    if (deliveryModesContainer && course.deliveryMode) {
        deliveryModesContainer.innerHTML = course.deliveryMode.map(mode => 
            `<span class="badge bg-secondary">${mode}</span>`
        ).join(' ');
    }

    // Overview
    document.getElementById('courseOverview').innerHTML = course.overview || course.description;

    // What you'll learn
    const learningContainer = document.getElementById('whatYouWillLearn');
    if (learningContainer && course.whatYouWillLearn?.length) {
        learningContainer.innerHTML = course.whatYouWillLearn.map(item => `
            <div class="col-md-6">
                <div class="d-flex align-items-start mb-2">
                    <i class="fas fa-check-circle text-success me-2 mt-1"></i>
                    <span>${item}</span>
                </div>
            </div>
        `).join('');
    } else {
        learningContainer.innerHTML = '<p class="text-muted">Course curriculum details coming soon...</p>';
    }

    // Curriculum
    const curriculumContainer = document.getElementById('curriculumAccordion');
    if (curriculumContainer && course.curriculum?.length) {
        curriculumContainer.innerHTML = course.curriculum.map((module, index) => `
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button ${index === 0 ? '' : 'collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#module${index}">
                        <strong>Module ${module.moduleNumber || index + 1}:</strong>&nbsp;${module.moduleTitle}
                        ${module.moduleDuration ? `<span class="badge bg-primary ms-auto me-2">${module.moduleDuration}</span>` : ''}
                    </button>
                </h2>
                <div id="module${index}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}">
                    <div class="accordion-body">
                        <ul class="list-unstyled">
                            ${module.topics.map(topic => `<li class="mb-2"><i class="fas fa-play-circle text-primary me-2"></i>${topic}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `).join('');
    } else {
        curriculumContainer.innerHTML = '<p class="text-muted">Detailed curriculum will be provided upon enrollment.</p>';
    }

    // Prerequisites
    const prerequisitesList = document.getElementById('prerequisitesList');
    if (prerequisitesList && course.prerequisites?.length) {
        prerequisitesList.innerHTML = course.prerequisites.map(item => 
            `<li>${item}</li>`
        ).join('');
    } else {
        prerequisitesList.innerHTML = '<li>No specific prerequisites required</li>';
    }

    // Instructor
    if (course.instructor) {
        document.getElementById('instructorAvatar').src = course.instructor.avatar;
        document.getElementById('instructorName').textContent = course.instructor.name;
        document.getElementById('instructorDesignation').textContent = course.instructor.designation || 'Expert Instructor';
    } else {
        document.getElementById('instructorName').textContent = course.instructorName || 'Expert Instructors';
        document.getElementById('instructorDesignation').textContent = 'Industry Professionals';
    }

    // Pricing
    const effectivePrice = course.price.discounted || course.price.regular;
    document.getElementById('effectivePrice').textContent = effectivePrice;
    
    if (course.price.discounted) {
        document.getElementById('regularPriceContainer').style.display = 'block';
        document.getElementById('regularPrice').textContent = course.price.regular;
        
        const discount = Math.round(((course.price.regular - course.price.discounted) / course.price.regular) * 100);
        const discountBadge = document.getElementById('discountBadge');
        discountBadge.textContent = `${discount}% OFF`;
        discountBadge.style.display = 'inline-block';
    }

    // Reviews
    displayReviews(course.reviews || []);

    // Store course data for enrollment
    sessionStorage.setItem('currentCourse', JSON.stringify({
        id: course._id,
        title: course.title,
        price: effectivePrice,
        thumbnail: course.thumbnail
    }));

    // Enroll button
    document.getElementById('enrollNowBtn').addEventListener('click', function() {
        const token = localStorage.getItem('token');
        if (!token) {
            showToast('Please login to enroll', 'error');
            setTimeout(() => window.location.href = '/login', 1500);
            return;
        }
        window.location.href = '/payment';
    });

    // Enquiry form
    document.getElementById('enquiryCourseId').value = course._id;
    document.getElementById('enquiryCourseName').value = course.title;

    // Wishlist button
    document.getElementById('addToWishlistBtn').addEventListener('click', async function() {
        const token = localStorage.getItem('token');
        if (!token) {
            showToast('Please login to add to wishlist', 'error');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/wishlist/${course._id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();
            if (result.success) {
                showToast('Added to wishlist', 'success');
                this.innerHTML = '<i class="fas fa-heart me-2"></i>In Wishlist';
                this.classList.remove('btn-outline-danger');
                this.classList.add('btn-danger');
            } else {
                showToast(result.message, 'error');
            }
        } catch (error) {
            showToast('Error adding to wishlist', 'error');
        }
    });
}

// Display reviews
function displayReviews(reviews) {
    const container = document.getElementById('reviewsContainer');
    
    if (reviews.length === 0) {
        container.innerHTML = '<p class="text-muted">No reviews yet. Be the first to review!</p>';
        return;
    }

    container.innerHTML = reviews.slice(0, 5).map(review => `
        <div class="review-item mb-4 pb-3 border-bottom">
            <div class="d-flex align-items-center mb-2">
                <img src="${review.user?.avatar || 'https://ui-avatars.com/api/?name=User'}" class="rounded-circle me-3" width="50" height="50">
                <div>
                    <h6 class="mb-0">${review.user?.name || 'Anonymous'}</h6>
                    <div class="text-warning">
                        ${'<i class="fas fa-star"></i>'.repeat(review.rating)}${'<i class="far fa-star"></i>'.repeat(5 - review.rating)}
                    </div>
                </div>
            </div>
            ${review.title ? `<h6 class="fw-bold">${review.title}</h6>` : ''}
            <p class="mb-0">${review.comment}</p>
            <small class="text-muted">${new Date(review.createdAt).toLocaleDateString()}</small>
        </div>
    `).join('');
}

// Load related courses
async function loadRelatedCourses(courseId) {
    try {
        const response = await fetch(`${API_URL}/courses/${courseId}/related`);
        const result = await response.json();

        if (result.success && result.data.length > 0) {
            const container = document.getElementById('relatedCoursesContainer');
            container.innerHTML = result.data.map(course => {
                const effectivePrice = course.price.discounted || course.price.regular;
                return `
                    <div class="col-lg-3 col-md-6">
                        <div class="card course-card shadow-sm h-100">
                            <img src="${course.thumbnail}" class="card-img-top course-thumbnail" alt="${course.title}">
                            <div class="card-body">
                                <h6 class="fw-bold mb-2">${course.title}</h6>
                                <div class="d-flex justify-content-between align-items-center">
                                    <h5 class="text-primary mb-0">₹${effectivePrice}</h5>
                                    <a href="/course/${course._id}" class="btn btn-sm btn-primary">View</a>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }
    } catch (error) {
        console.error('Error loading related courses:', error);
    }
}

// Handle enquiry form
document.addEventListener('DOMContentLoaded', function() {
    loadCourseDetails();

    const enquiryForm = document.getElementById('courseEnquiryForm');
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = new FormData(enquiryForm);
            const data = Object.fromEntries(formData);
            data.course = document.getElementById('enquiryCourseId').value;
            data.courseName = document.getElementById('enquiryCourseName').value;
            data.enquiryType = 'course';
            data.source = 'course-detail';

            try {
                const response = await fetch(`${API_URL}/enquiry`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (result.success) {
                    showToast('Enquiry submitted successfully!', 'success');
                    enquiryForm.reset();
                    bootstrap.Modal.getInstance(document.getElementById('enquiryModal')).hide();
                } else {
                    showToast(result.message || 'Failed to submit enquiry', 'error');
                }
            } catch (error) {
                showToast('Error submitting enquiry', 'error');
            }
        });
    }
});
