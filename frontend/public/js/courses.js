// Courses Page JavaScript

const API_URL = 'https://certedtechnologies.com/api';
let currentPage = 1;
let currentFilters = {};

// Load categories for filter
async function loadCategoryFilter() {
    try {
        const response = await fetch(`${API_URL}/categories`);
        const result = await response.json();

        if (result.success) {
            const select = document.getElementById('categoryFilter');
            if (select) {
                result.data.forEach(cat => {
                    const option = document.createElement('option');
                    option.value = cat._id;
                    option.textContent = cat.name;
                    select.appendChild(option);
                });
            }
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Load courses with filters
async function loadCourses(page = 1) {
    try {
        const queryParams = new URLSearchParams({
            page,
            limit: 12,
            ...currentFilters
        });

        const response = await fetch(`${API_URL}/courses?${queryParams}`);
        const result = await response.json();

        if (result.success) {
            displayCourses(result.data);
            updatePagination(result.pagination);
            updateResultsInfo(result.pagination);
        }
    } catch (error) {
        console.error('Error loading courses:', error);
        document.getElementById('coursesContainer').innerHTML = 
            '<div class="col-12 text-center"><p class="text-danger">Error loading courses</p></div>';
    }
}

// Display courses
function displayCourses(courses) {
    const container = document.getElementById('coursesContainer');
    
    if (courses.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-search fa-4x text-muted mb-3"></i>
                <h4>No courses found</h4>
                <p class="text-muted">Try adjusting your filters</p>
            </div>
        `;
        return;
    }

    container.innerHTML = courses.map(course => {
        const effectivePrice = course.price.discounted || course.price.regular;
        const discount = course.price.discounted ? 
            Math.round(((course.price.regular - course.price.discounted) / course.price.regular) * 100) : 0;

        return `
            <div class="col-lg-4 col-md-6">
                <div class="card course-card shadow-sm h-100">
                    <div class="position-relative">
                        <img src="${course.thumbnail}" class="card-img-top course-thumbnail" alt="${course.title}">
                        ${discount > 0 ? `<span class="badge bg-danger position-absolute top-0 end-0 m-2">${discount}% OFF</span>` : ''}
                        ${course.isFeatured ? '<span class="badge bg-warning position-absolute top-0 start-0 m-2">Featured</span>' : ''}
                    </div>
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="badge bg-primary">${course.category?.name || 'Category'}</span>
                            <span class="badge bg-info">${course.level}</span>
                        </div>
                        <h5 class="card-title fw-bold mb-2">${course.title}</h5>
                        <p class="card-text text-muted small flex-grow-1">${course.shortDescription || course.description.substring(0, 100) + '...'}</p>
                        
                        <div class="course-meta d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <i class="fas fa-star text-warning"></i>
                                <strong>${course.rating?.average || 0}</strong>
                                <span class="text-muted">(${course.rating?.count || 0})</span>
                            </div>
                            <div class="text-muted small">
                                <i class="fas fa-users me-1"></i>${course.enrollmentCount || 0} enrolled
                            </div>
                        </div>

                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div class="text-muted small">
                                <i class="fas fa-clock me-1"></i>${course.duration?.display || '40 Hours'}
                            </div>
                            <div>
                                ${course.deliveryMode?.map(mode => 
                                    `<span class="badge bg-secondary me-1">${mode}</span>`
                                ).join('') || ''}
                            </div>
                        </div>

                        <div class="d-flex justify-content-between align-items-center mt-auto">
                            <div>
                                <h4 class="text-primary mb-0">₹${effectivePrice}</h4>
                                ${course.price.discounted ? `<small class="text-muted text-decoration-line-through">₹${course.price.regular}</small>` : ''}
                            </div>
                            <a href="/course/${course._id}" class="btn btn-primary btn-sm">
                                <i class="fas fa-eye me-1"></i>View
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Update pagination
function updatePagination(pagination) {
    const container = document.getElementById('paginationContainer');
    const paginationUl = document.getElementById('pagination');

    if (pagination.totalPages <= 1) {
        container.classList.add('d-none');
        return;
    }

    container.classList.remove('d-none');
    
    let paginationHTML = '';

    // Previous button
    paginationHTML += `
        <li class="page-item ${pagination.currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${pagination.currentPage - 1}">Previous</a>
        </li>
    `;

    // Page numbers
    for (let i = 1; i <= pagination.totalPages; i++) {
        if (i === 1 || i === pagination.totalPages || (i >= pagination.currentPage - 2 && i <= pagination.currentPage + 2)) {
            paginationHTML += `
                <li class="page-item ${i === pagination.currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        } else if (i === pagination.currentPage - 3 || i === pagination.currentPage + 3) {
            paginationHTML += '<li class="page-item disabled"><span class="page-link">...</span></li>';
        }
    }

    // Next button
    paginationHTML += `
        <li class="page-item ${!pagination.hasNextPage ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${pagination.currentPage + 1}">Next</a>
        </li>
    `;

    paginationUl.innerHTML = paginationHTML;

    // Add click handlers
    paginationUl.querySelectorAll('a.page-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = parseInt(this.dataset.page);
            if (page && page !== pagination.currentPage) {
                currentPage = page;
                loadCourses(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });
}

// Update results info
function updateResultsInfo(pagination) {
    const info = document.getElementById('resultsInfo');
    if (info) {
        info.textContent = `Showing ${pagination.totalCourses} course${pagination.totalCourses !== 1 ? 's' : ''}`;
    }
}

// Apply filters
document.addEventListener('DOMContentLoaded', function() {
    loadCategoryFilter();

    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    const searchParam = urlParams.get('search');

    if (categoryParam) {
        currentFilters.category = categoryParam;
        setTimeout(() => {
            const select = document.getElementById('categoryFilter');
            if (select) select.value = categoryParam;
        }, 500);
    }

    if (searchParam) {
        currentFilters.search = searchParam;
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.value = searchParam;
    }

    loadCourses(1);

    // Filter buttons
    document.getElementById('applyFilters')?.addEventListener('click', function() {
        currentFilters = {
            category: document.getElementById('categoryFilter').value,
            level: document.getElementById('levelFilter').value,
            deliveryMode: document.getElementById('deliveryModeFilter').value,
            minPrice: document.getElementById('minPrice').value,
            maxPrice: document.getElementById('maxPrice').value,
            sort: document.getElementById('sortFilter').value,
            search: document.getElementById('searchInput').value
        };

        // Remove empty filters
        Object.keys(currentFilters).forEach(key => {
            if (!currentFilters[key] || currentFilters[key] === 'all' || currentFilters[key] === '') {
                delete currentFilters[key];
            }
        });

        currentPage = 1;
        loadCourses(1);
    });

    document.getElementById('resetFilters')?.addEventListener('click', function() {
        currentFilters = {};
        currentPage = 1;
        document.getElementById('categoryFilter').value = 'all';
        document.getElementById('levelFilter').value = 'all';
        document.getElementById('deliveryModeFilter').value = '';
        document.getElementById('minPrice').value = '';
        document.getElementById('maxPrice').value = '';
        document.getElementById('sortFilter').value = '-createdAt';
        document.getElementById('searchInput').value = '';
        loadCourses(1);
    });

    // Live search
    let searchTimeout;
    document.getElementById('searchInput')?.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            currentFilters.search = this.value;
            if (!this.value) delete currentFilters.search;
            currentPage = 1;
            loadCourses(1);
        }, 500);
    });
});
