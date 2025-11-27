const API_URL = 'http://localhost:5000/api';

// Load Blog Posts
async function loadBlogPosts(page = 1, category = null) {
    try {
        showBlogLoading(true);
        
        const params = new URLSearchParams({
            page,
            limit: 6
        });
        
        if (category) {
            params.set('category', category);
        }
        
        // Check for URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('category')) {
            params.set('category', urlParams.get('category'));
        }
        
        const response = await fetch(`${API_URL}/blogs?${params}`);
        const result = await response.json();
        
        if (result.success) {
            displayBlogPosts(result.data);
            updateBlogPagination(result.currentPage, result.totalPages);
            loadRecentPosts();
        }
        
        showBlogLoading(false);
    } catch (error) {
        console.error('Error loading blog posts:', error);
        showBlogError();
        showBlogLoading(false);
    }
}

// Display Blog Posts
function displayBlogPosts(posts) {
    const container = document.getElementById('blog-posts-container');
    
    if (posts.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-newspaper fa-3x text-muted mb-3"></i>
                <h4>No blog posts found</h4>
                <p class="text-muted">Check back later for new content</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = posts.map(post => createBlogCard(post)).join('');
}

// Create Blog Card
function createBlogCard(post) {
    const publishDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    return `
        <div class="card border-0 shadow-sm mb-4 fade-in">
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="${post.featuredImage}" class="img-fluid rounded-start h-100" alt="${post.title}" style="object-fit: cover;">
                </div>
                <div class="col-md-8">
                    <div class="card-body p-4">
                        <div class="mb-2">
                            <span class="badge bg-primary">${post.category}</span>
                            <span class="text-muted ms-2">
                                <i class="fas fa-clock me-1"></i>${post.readTime} min read
                            </span>
                        </div>
                        <h4 class="card-title fw-bold mb-3">
                            <a href="/pages/blog-detail.html?id=${post._id}" class="text-decoration-none text-dark">
                                ${post.title}
                            </a>
                        </h4>
                        <p class="card-text text-muted">${post.excerpt}</p>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <div class="author-info">
                                <img src="${post.author.avatar || 'https://via.placeholder.com/40'}" 
                                     alt="${post.author.name}" 
                                     class="rounded-circle me-2" 
                                     style="width: 40px; height: 40px; object-fit: cover;">
                                <span class="fw-bold">${post.author.name}</span>
                            </div>
                            <small class="text-muted">${publishDate}</small>
                        </div>
                        <a href="/pages/blog-detail.html?id=${post._id}" class="btn btn-outline-primary mt-3">
                            Read More <i class="fas fa-arrow-right ms-2"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Load Single Blog Post
async function loadSinglePost() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');
        
        if (!postId) {
            showPostError('Blog post ID not provided');
            return;
        }
        
        const response = await fetch(`${API_URL}/blogs/${postId}`);
        const result = await response.json();
        
        if (result.success) {
            displayBlogPost(result.data);
            loadRelatedPosts(result.data.category);
        } else {
            showPostError(result.message);
        }
    } catch (error) {
        console.error('Error loading blog post:', error);
        showPostError('Failed to load blog post');
    }
}

// Display Blog Post
function displayBlogPost(post) {
    // Update page title
    document.getElementById('blog-page-title').textContent = `${post.title} - Certed Technologies`;
    
    const publishDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const content = `
        <div class="card border-0 shadow-sm">
            <img src="${post.featuredImage}" class="card-img-top" alt="${post.title}">
            <div class="card-body p-4">
                <div class="mb-3">
                    <span class="badge bg-primary">${post.category}</span>
                    ${post.tags.map(tag => `<span class="badge bg-secondary ms-1">${tag}</span>`).join('')}
                </div>
                <h1 class="fw-bold mb-3">${post.title}</h1>
                <div class="d-flex align-items-center mb-4 pb-4 border-bottom">
                    <img src="${post.author.avatar || 'https://via.placeholder.com/50'}" 
                         alt="${post.author.name}" 
                         class="rounded-circle me-3" 
                         style="width: 50px; height: 50px; object-fit: cover;">
                    <div>
                        <div class="fw-bold">${post.author.name}</div>
                        <small class="text-muted">
                            ${publishDate} · ${post.readTime} min read · ${post.views} views
                        </small>
                    </div>
                </div>
                <div class="blog-content">
                    ${post.content}
                </div>
                <hr class="my-4">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <strong>Tags:</strong>
                        ${post.tags.map(tag => `<span class="badge bg-secondary ms-2">${tag}</span>`).join('')}
                    </div>
                    <div>
                        <i class="fas fa-eye me-2"></i>${post.views} views
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('blog-content').innerHTML = content;
    
    // Update author widget
    const authorWidget = `
        <div class="card-body text-center">
            <img src="${post.author.avatar || 'https://via.placeholder.com/100'}" 
                 alt="${post.author.name}" 
                 class="rounded-circle mb-3" 
                 style="width: 100px; height: 100px; object-fit: cover;">
            <h5 class="fw-bold">${post.author.name}</h5>
            <p class="text-muted small">${post.author.bio || 'Content Author'}</p>
        </div>
    `;
    
    document.getElementById('author-widget').innerHTML = authorWidget;
}

// Load Recent Posts
async function loadRecentPosts() {
    try {
        const response = await fetch(`${API_URL}/blogs?limit=5&sort=-publishedAt`);
        const result = await response.json();
        
        if (result.success) {
            const recentPostsHTML = result.data.map(post => `
                <li class="mb-3">
                    <a href="/pages/blog-detail.html?id=${post._id}" class="text-decoration-none">
                        <h6 class="mb-1">${post.title.substring(0, 50)}...</h6>
                        <small class="text-muted">
                            ${new Date(post.publishedAt).toLocaleDateString()}
                        </small>
                    </a>
                </li>
            `).join('');
            
            document.getElementById('recent-posts').innerHTML = recentPostsHTML;
        }
    } catch (error) {
        console.error('Error loading recent posts:', error);
    }
}

// Load Related Posts
async function loadRelatedPosts(category) {
    try {
        const response = await fetch(`${API_URL}/blogs?category=${category}&limit=4`);
        const result = await response.json();
        
        if (result.success && result.data.length > 0) {
            const relatedPostsHTML = result.data.map(post => `
                <li class="mb-3">
                    <a href="/pages/blog-detail.html?id=${post._id}" class="text-decoration-none">
                        <h6 class="mb-1">${post.title.substring(0, 50)}...</h6>
                        <small class="text-muted">
                            ${new Date(post.publishedAt).toLocaleDateString()}
                        </small>
                    </a>
                </li>
            `).join('');
            
            document.getElementById('related-posts').innerHTML = relatedPostsHTML;
        }
    } catch (error) {
        console.error('Error loading related posts:', error);
    }
}

// Update Blog Pagination
function updateBlogPagination(current, total) {
    const pagination = document.getElementById('blog-pagination');
    
    if (!pagination || total <= 1) {
        if (pagination) pagination.innerHTML = '';
        return;
    }
    
    let html = '';
    
    // Previous button
    html += `
        <li class="page-item ${current === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="loadBlogPosts(${current - 1}); return false;">
                Previous
            </a>
        </li>
    `;
    
    // Page numbers
    for (let i = 1; i <= total; i++) {
        if (i === 1 || i === total || (i >= current - 2 && i <= current + 2)) {
            html += `
                <li class="page-item ${i === current ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="loadBlogPosts(${i}); return false;">${i}</a>
                </li>
            `;
        } else if (i === current - 3 || i === current + 3) {
            html += '<li class="page-item disabled"><span class="page-link">...</span></li>';
        }
    }
    
    // Next button
    html += `
        <li class="page-item ${current === total ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="loadBlogPosts(${current + 1}); return false;">
                Next
            </a>
        </li>
    `;
    
    pagination.innerHTML = html;
}

// Show Blog Loading
function showBlogLoading(show) {
    const container = document.getElementById('blog-posts-container');
    if (show && container) {
        container.innerHTML = `
            <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        `;
    }
}

// Show Blog Error
function showBlogError() {
    const container = document.getElementById('blog-posts-container');
    if (container) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
                <h4>Error Loading Blog Posts</h4>
                <p class="text-muted">Please try again later</p>
            </div>
        `;
    }
}

// Show Post Error
function showPostError(message) {
    const container = document.getElementById('blog-content');
    if (container) {
        container.innerHTML = `
            <div class="card border-0 shadow-sm">
                <div class="card-body p-5 text-center">
                    <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
                    <h4>Error Loading Blog Post</h4>
                    <p class="text-muted">${message}</p>
                    <a href="/pages/blog.html" class="btn btn-primary mt-3">Back to Blog</a>
                </div>
            </div>
        `;
    }
}

// Blog Search
function searchBlog() {
    const query = document.getElementById('blogSearchInput').value.trim();
    if (query) {
        // Implement search functionality
        console.log('Searching for:', query);
    }
}

// Category Filter
function filterByCategory(category) {
    loadBlogPosts(1, category);
}

// Initialize Blog Page
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on blog listing or detail page
    if (document.getElementById('blog-posts-container')) {
        loadBlogPosts();
        
        // Blog search
        const searchBtn = document.getElementById('blogSearchBtn');
        if (searchBtn) {
            searchBtn.addEventListener('click', searchBlog);
        }
        
        // Category filters
        const categoryLinks = document.querySelectorAll('#blog-categories a');
        categoryLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = link.dataset.category;
                filterByCategory(category);
            });
        });
    } else if (document.getElementById('blog-content')) {
        loadSinglePost();
    }
    
    // Comment form handling
    const commentForm = document.getElementById('commentForm');
    if (commentForm) {
        commentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Comment functionality will be implemented with backend integration');
        });
    }
});
