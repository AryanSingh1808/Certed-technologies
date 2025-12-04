// Contact Page JavaScript

const API_URL = '/api';

// Load locations
async function loadLocations() {
    try {
        const response = await fetch(`${API_URL}/locations`);
        const result = await response.json();

        if (result.success) {
            const container = document.getElementById('locationsContainer');
            if (container) {
                container.innerHTML = result.data.map(location => `
                    <div class="col-md-6">
                        <div class="card shadow-sm">
                            <div class="card-body">
                                <h5 class="fw-bold mb-3"><i class="fas fa-map-marker-alt text-primary me-2"></i>${location.name}, ${location.city}</h5>
                                <p class="text-muted mb-2"><strong>Address:</strong> ${location.address?.street || ''}, ${location.city}, ${location.state}</p>
                                ${location.contactInfo?.phone?.[0] ? `<p class="text-muted mb-2"><strong>Phone:</strong> ${location.contactInfo.phone[0]}</p>` : ''}
                                ${location.contactInfo?.email?.[0] ? `<p class="text-muted mb-2"><strong>Email:</strong> ${location.contactInfo.email[0]}</p>` : ''}
                                <p class="text-muted mb-0"><strong>Timings:</strong> ${location.timings?.weekdays || 'Mon-Sat: 9 AM - 7 PM'}</p>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }
    } catch (error) {
        console.error('Error loading locations:', error);
    }
}

// Handle contact form
document.addEventListener('DOMContentLoaded', function() {
    loadLocations();

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);

            try {
                const response = await fetch(`${API_URL}/contact`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (result.success) {
                    showToast('Message sent successfully! We will get back to you soon.', 'success');
                    contactForm.reset();
                } else {
                    showToast(result.message || 'Failed to send message', 'error');
                }
            } catch (error) {
                showToast('Error sending message. Please try again.', 'error');
            }
        });
    }

    // Quick contact enquiry
    const quickContactEnquiry = document.getElementById('quickContactEnquiry');
    if (quickContactEnquiry) {
        quickContactEnquiry.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = new FormData(quickContactEnquiry);
            const data = Object.fromEntries(formData);
            data.enquiryType = 'general';
            data.source = 'contact-page';

            try {
                const response = await fetch(`${API_URL}/enquiry`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (result.success) {
                    showToast('Enquiry submitted successfully!', 'success');
                    quickContactEnquiry.reset();
                } else {
                    showToast(result.message || 'Failed to submit enquiry', 'error');
                }
            } catch (error) {
                showToast('Error submitting enquiry', 'error');
            }
        });
    }
});
