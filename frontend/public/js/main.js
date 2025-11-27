// API Base URL
const API_URL = 'http://localhost:5000/api';

// Utility: Get auth token
function getAuthToken() {
    return localStorage.getItem('token');
}

// Utility: Get auth headers
function getAuthHeaders() {
    const token = getAuthToken();
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
}

// Load Categories for homepage
async function loadCategories() {
    try {
        const response = await fetch(`${API_URL}/categories`);
        const result = await response.json();

        if (result.success) {
            const container = document.getElementById('categoriesContainer');
            if (container) {
                container.innerHTML = result.data.map(category => `
                    <div class="col-lg-3 col-md-4 col-sm-6" data-aos="fade-up">
                        <a href="/courses?category=${category._id}" class="text-decoration-none">
                            <div class="card category-card shadow-sm h-100">
                                <div class="card-body text-center">
                                    <div class="category-icon">
                                        <i class="${category.icon} fa-2x text-white"></i>
                                    </div>
                                    <h5 class="fw-bold mb-2">${category.name}</h5>
                                    <p class="text-muted small mb-2">${category.description || ''}</p>
                                    <span class="badge bg-primary">${category.courseCount} Courses</span>
                                </div>
                            </div>
                        </a>
                    </div>
                `).join('');
            }
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Load Featured Courses
async function loadFeaturedCourses() {
    try {
        const response = await fetch(`${API_URL}/courses/featured`);
        const result = await response.json();

        if (result.success) {
            const container = document.getElementById('featuredCoursesContainer');
            if (container) {
                container.innerHTML = result.data.map(course => createCourseCard(course)).join('');
            }
        }
    } catch (error) {
        console.error('Error loading featured courses:', error);
        const container = document.getElementById('featuredCoursesContainer');
        if (container) {
            container.innerHTML = '<div class="col-12 text-center"><p class="text-danger">Error loading courses</p></div>';
        }
    }
}

// Create Course Card HTML
function createCourseCard(course) {
    const effectivePrice = course.price.discounted || course.price.regular;
    const discount = course.price.discounted ? 
        Math.round(((course.price.regular - course.price.discounted) / course.price.regular) * 100) : 0;

    return `
        <div class="col-lg-4 col-md-6 fade-in">
            <div class="card course-card shadow-sm h-100">
                <div class="position-relative">
                    <img src="${course.thumbnail}" class="card-img-top course-thumbnail" alt="${course.title}">
                    ${discount > 0 ? `<span class="badge bg-danger position-absolute top-0 end-0 m-2">${discount}% OFF</span>` : ''}
                    ${course.isTrending ? '<span class="badge bg-warning position-absolute top-0 start-0 m-2">Trending</span>' : ''}
                </div>
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="badge bg-primary">${course.category?.name || 'Category'}</span>
                        <span class="badge bg-info">${course.level}</span>
                    </div>
                    <h5 class="card-title fw-bold mb-2">${course.title}</h5>
                    <p class="card-text text-muted small">${course.shortDescription || course.description.substring(0, 100) + '...'}</p>
                    <div class="course-meta d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <i class="fas fa-star course-rating"></i>
                            <strong>${course.rating?.average || 0}</strong>
                            <span class="text-muted">(${course.rating?.count || 0})</span>
                        </div>
                        <div class="text-muted">
                            <i class="fas fa-clock me-1"></i>${course.duration?.display || '40 Hours'}
                        </div>
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h4 class="course-price mb-0">₹${effectivePrice}</h4>
                            ${course.price.discounted ? `<small class="text-muted text-decoration-line-through">₹${course.price.regular}</small>` : ''}
                        </div>
                        <a href="/course/${course._id}" class="btn btn-primary btn-sm">View Details</a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Load Testimonials
async function loadTestimonials() {
    try {
        const response = await fetch(`${API_URL}/testimonials`);
        const result = await response.json();

        if (result.success) {
            const container = document.getElementById('testimonialsContainer');
            if (container) {
                container.innerHTML = result.data.slice(0, 6).map(testimonial => `
                    <div class="col-lg-4 col-md-6" data-aos="fade-up">
                        <div class="card testimonial-card shadow-sm h-100">
                            <div class="card-body">
                                <div class="d-flex align-items-center mb-3">
                                    <img src="${testimonial.avatar}" alt="${testimonial.studentName}" class="rounded-circle me-3" width="60" height="60">
                                    <div>
                                        <h6 class="fw-bold mb-0">${testimonial.studentName}</h6>
                                        <p class="text-muted small mb-0">${testimonial.position}</p>
                                        <div class="text-warning">
                                            ${'<i class="fas fa-star"></i>'.repeat(testimonial.rating)}
                                        </div>
                                    </div>
                                </div>
                                <p class="text-muted fst-italic">"${testimonial.testimonial}"</p>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }
    } catch (error) {
        console.error('Error loading testimonials:', error);
    }
}

// Handle Newsletter Subscription
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('newsletterEmail').value;

            try {
                const response = await fetch(`${API_URL}/newsletter/subscribe`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });

                const result = await response.json();

                if (result.success) {
                    showToast('Successfully subscribed to newsletter!', 'success');
                    newsletterForm.reset();
                } else {
                    showToast(result.message || 'Subscription failed', 'error');
                }
            } catch (error) {
                showToast('Error subscribing. Please try again.', 'error');
            }
        });
    }

    // Handle Quick Enquiry Form
    const quickEnquiryForm = document.getElementById('quickEnquiryForm');
    if (quickEnquiryForm) {
        quickEnquiryForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = new FormData(quickEnquiryForm);
            const data = Object.fromEntries(formData);
            data.enquiryType = 'general';
            data.source = 'popup';

            try {
                const response = await fetch(`${API_URL}/enquiry`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (result.success) {
                    showToast('Enquiry submitted successfully! We will contact you soon.', 'success');
                    quickEnquiryForm.reset();
                    bootstrap.Modal.getInstance(document.getElementById('enquiryModal')).hide();
                } else {
                    showToast(result.message || 'Failed to submit enquiry', 'error');
                }
            } catch (error) {
                showToast('Error submitting enquiry. Please try again.', 'error');
            }
        });
    }

    // Search functionality
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = document.getElementById('courseSearchInput');
            const searchQuery = searchInput.value.trim();
            if (searchQuery) {
                window.location.href = `/courses?search=${encodeURIComponent(searchQuery)}`;
            }
        });
    }

    // ========================================
  // AUTO-POPUP AFTER 5 SECONDS FOR NON-LOGGED-IN USERS
  // ========================================
  function showQuickEnquiryPopup() {
    const token = localStorage.getItem('token');
    const hasSeenPopup = sessionStorage.getItem('hasSeenQuickEnquiryPopup');
    
    // Show only if user is NOT logged in AND hasn't seen popup in this session
    if (!token && !hasSeenPopup) {
      setTimeout(() => {
        const modalElement = document.getElementById('quickEnquiryModal');
        if (modalElement) {
          const popupModal = new bootstrap.Modal(modalElement, {
            backdrop: 'static', // Prevent closing by clicking outside
            keyboard: true      // Allow closing with ESC key
          });
          popupModal.show();
          
          // Mark as seen in this session
          sessionStorage.setItem('hasSeenQuickEnquiryPopup', 'true');
          
          console.log('✅ Quick enquiry popup displayed after 5 seconds');
        }
      }, 3000); // 5 seconds delay
    }
  }

  // Call the function
  showQuickEnquiryPopup();

  // ========================================
  // HANDLE POPUP FORM SUBMISSION
  // ========================================
  const quickEnquiryPopupForm = document.getElementById('quickEnquiryPopupForm');
  if (quickEnquiryPopupForm) {
    quickEnquiryPopupForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(this);
      const data = Object.fromEntries(formData);
      
      // Add tracking fields
      data.enquiryType = 'popup';
      data.source = 'homepage-popup-5sec';

      // Disable submit button during submission
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Submitting...';

      try {
        const response = await fetch(`${API_URL}/enquiry`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
          showToast('Thank you! Your enquiry has been submitted successfully. We will contact you soon.', 'success');
          this.reset();
          
          // Close modal
          const modalElement = document.getElementById('quickEnquiryModal');
          if (modalElement) {
            const popupModal = bootstrap.Modal.getInstance(modalElement);
            if (popupModal) popupModal.hide();
          }
        } else {
          showToast(result.message || 'Failed to submit enquiry. Please try again.', 'error');
        }
      } catch (error) {
        console.error('Quick enquiry popup submission error:', error);
        showToast('Network error. Please check your connection and try again.', 'error');
      } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  // Optional: Show popup again on user inactivity (30 seconds of no mouse movement)
  let inactivityTimer;
  function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    const hasSeenPopupTwice = sessionStorage.getItem('hasSeenQuickEnquiryPopupTwice');
    
    if (!localStorage.getItem('token') && !hasSeenPopupTwice) {
      inactivityTimer = setTimeout(() => {
        const modalElement = document.getElementById('quickEnquiryModal');
        if (modalElement && !modalElement.classList.contains('show')) {
          const popupModal = new bootstrap.Modal(modalElement);
          popupModal.show();
          sessionStorage.setItem('hasSeenQuickEnquiryPopupTwice', 'true');
        }
      }, 30000); // 30 seconds of inactivity
    }
  }

  // Uncomment below lines if you want inactivity-based popup
  // document.addEventListener('mousemove', resetInactivityTimer);
  // document.addEventListener('keypress', resetInactivityTimer);

});


