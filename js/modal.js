// ===================================
// MODAL SYSTEM MANAGER
// ===================================
// This module handles all modal functionality including opening, closing,
// form handling, and accessibility features

class ModalManager {
    constructor() {
        this.activeModal = null;
        this.modalOverlay = null;
        this.focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        this.previousActiveElement = null;
        
        this.init();
    }
    
    init() {
        console.log('🎭 Initializing Modal Manager...');
        
        this.createModalOverlay();
        this.setupEventListeners();
        this.setupFormHandling();
        
        console.log('✅ Modal Manager initialized');
    }
    
    // =============================
    // CREATE MODAL OVERLAY
    // =============================
    createModalOverlay() {
        // Check if overlay already exists
        this.modalOverlay = document.getElementById('modal-overlay');
        
        if (!this.modalOverlay) {
            this.modalOverlay = document.createElement('div');
            this.modalOverlay.id = 'modal-overlay';
            this.modalOverlay.className = 'modal-overlay';
            document.body.appendChild(this.modalOverlay);
        }
        
        // Add modal containers to overlay if they don't exist
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (!this.modalOverlay.contains(modal)) {
                this.modalOverlay.appendChild(modal);
            }
        });
    }
    
    // =============================
    // SETUP EVENT LISTENERS
    // =============================
    setupEventListeners() {
        // Handle modal triggers
        document.addEventListener('click', (event) => {
            // Handle project overlay buttons first - prevent modal opening for Live Demo buttons
            const overlayButton = event.target.closest('.project-overlay .btn-primary, .project-overlay .btn-secondary');
            if (overlayButton) {
                // If it's a Live Demo button or has data-no-modal, prevent the project modal
                if (overlayButton.classList.contains('btn-secondary') || overlayButton.hasAttribute('data-no-modal')) {
                    event.stopPropagation();
                    event.preventDefault();
                    
                    // Handle Live Demo button
                    if (overlayButton.classList.contains('btn-secondary')) {
                        const href = overlayButton.getAttribute('href');
                        if (href && href !== '#') {
                            window.open(href, '_blank');
                        } else {
                            this.showNotification('Live demo will be available soon!', 'info');
                        }
                    }
                    return; // Exit early to prevent modal trigger
                }
            }
            
            // Handle modal triggers (View Details buttons)
            const trigger = event.target.closest('[data-modal]');
            if (trigger && !trigger.hasAttribute('data-no-modal')) {
                event.preventDefault();
                const modalId = trigger.getAttribute('data-modal');
                const projectId = trigger.getAttribute('data-project');
                this.openModal(modalId, { projectId, trigger });
                return;
            }
            
            // Handle close buttons
            const closeBtn = event.target.closest('.modal-close');
            if (closeBtn) {
                event.preventDefault();
                this.closeModal();
                return;
            }
            
            // Close on overlay click
            if (event.target === this.modalOverlay) {
                this.closeModal();
            }
        });
        
        // Handle escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.activeModal) {
                this.closeModal();
            }
            
            // Handle tab key for focus trapping
            if (event.key === 'Tab' && this.activeModal) {
                this.trapFocus(event);
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (this.activeModal) {
                this.adjustModalPosition();
            }
        });
    }
    
    // =============================
    // OPEN MODAL METHOD
    // =============================
    openModal(modalId, options = {}) {
        const modal = document.getElementById(modalId);
        
        if (!modal) {
            console.error(`❌ Modal with ID '${modalId}' not found`);
            return;
        }
        
        if (this.activeModal) {
            this.closeModal(); // Close any existing modal first
        }
        
        // Store the currently focused element
        this.previousActiveElement = document.activeElement;
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        document.body.classList.add('modal-open');
        
        // Show overlay and modal
        this.modalOverlay.classList.add('active');
        modal.classList.add('active');
        
        // Set active modal
        this.activeModal = modal;
        
        // Handle specific modal types
        this.handleModalContent(modalId, options);
        
        // Set up accessibility
        this.setupAccessibility(modal);
        
        // Focus management
        setTimeout(() => {
            this.focusModal(modal);
        }, 100);
        
        // Trigger custom event
        const modalEvent = new CustomEvent('modalOpened', {
            detail: { modalId, options }
        });
        modal.dispatchEvent(modalEvent);
        
        // Add animation classes
        this.addOpenAnimation(modal);
        
        console.log(`🎭 Opened modal: ${modalId}`);
    }
    
    // =============================
    // CLOSE MODAL METHOD
    // =============================
    closeModal() {
        if (!this.activeModal) return;
        
        const modal = this.activeModal;
        const modalId = modal.id;
        
        // Add closing animation
        this.addCloseAnimation(modal);
        
        // Wait for animation to complete
        setTimeout(() => {
            // Hide overlay and modal
            this.modalOverlay.classList.remove('active');
            modal.classList.remove('active');
            
            // Re-enable body scroll
            document.body.style.overflow = '';
            document.body.classList.remove('modal-open');
            
            // Remove accessibility attributes
            this.removeAccessibility(modal);
            
            // Restore focus
            if (this.previousActiveElement) {
                this.previousActiveElement.focus();
                this.previousActiveElement = null;
            }
            
            // Trigger custom event
            const modalEvent = new CustomEvent('modalClosed', {
                detail: { modalId }
            });
            modal.dispatchEvent(modalEvent);
            
            // Clear active modal
            this.activeModal = null;
            
            console.log(`🎭 Closed modal: ${modalId}`);
        }, 300); // Match animation duration
    }
    
    // =============================
    // HANDLE MODAL CONTENT
    // =============================
    handleModalContent(modalId, options) {
        switch (modalId) {
            case 'contact-modal':
                this.setupContactModal();
                break;
                
            case 'project-modal':
                this.setupProjectModal(options.projectId, options.trigger);
                break;
                
            default:
                // Generic modal setup
                break;
        }
    }
    
    // =============================
    // SETUP CONTACT MODAL
    // =============================
    setupContactModal() {
        const form = document.getElementById('quick-contact-form');
        if (!form) return;
        
        // Reset form
        form.reset();
        
        // Clear any validation states
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.classList.remove('error', 'success');
        });
        
        // Clear error messages
        const errorElements = form.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
        });
    }
    
    // =============================
    // SETUP PROJECT MODAL
    // =============================
    setupProjectModal(projectId, trigger) {
        const modal = document.getElementById('project-modal');
        const detailsContainer = document.getElementById('project-details');
        const titleElement = document.getElementById('project-title');
        
        if (!projectId || !detailsContainer) return;
        
        // Get project data
        const projectData = this.getProjectData(projectId);
        
        if (!projectData) {
            console.warn(`⚠️ Project data not found for ID: ${projectId}`);
            return;
        }
        
        // Update modal title
        if (titleElement) {
            titleElement.textContent = projectData.title;
        }
        
        // Generate project details HTML
        detailsContainer.innerHTML = this.generateProjectDetailsHTML(projectData);
        
        // Add loading animation
        detailsContainer.style.opacity = '0';
        setTimeout(() => {
            detailsContainer.style.opacity = '1';
            detailsContainer.style.transition = 'opacity 0.3s ease';
        }, 100);
    }
    
    // =============================
    // GET PROJECT DATA
    // =============================
    getProjectData(projectId) {
        const projectsData = {
            'ecommerce': {
                title: 'E-commerce Platform',
                description: 'A comprehensive e-commerce solution built with modern technologies, featuring real-time inventory management, secure payment processing, and an intuitive admin dashboard.',
                image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
                technologies: ['React', 'Node.js', 'MongoDB', 'Stripe API', 'Redis'],
                features: [
                    'User authentication and authorization',
                    'Product catalog with search and filtering',
                    'Shopping cart and wishlist functionality',
                    'Secure payment processing with Stripe',
                    'Order tracking and management',
                    'Admin dashboard for inventory management',
                    'Responsive design for all devices'
                ],
                liveUrl: 'https://example-ecommerce.com',
                githubUrl: 'https://github.com/johndoe/ecommerce-platform',
                duration: '3 months',
                role: 'Full-Stack Developer'
            },
            'mobile-app': {
                title: 'Task Management Mobile App',
                description: 'A cross-platform mobile application for task management with real-time synchronization, offline capabilities, and collaborative features.',
                image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2274&q=80',
                technologies: ['React Native', 'Firebase', 'Redux', 'AsyncStorage'],
                features: [
                    'Cross-platform compatibility (iOS & Android)',
                    'Real-time task synchronization',
                    'Offline functionality with local storage',
                    'Team collaboration and sharing',
                    'Push notifications for deadlines',
                    'Dark mode support',
                    'Gesture-based interactions'
                ],
                liveUrl: 'https://play.google.com/store/apps/details?id=com.taskmanager',
                githubUrl: 'https://github.com/johndoe/task-manager-app',
                duration: '4 months',
                role: 'Mobile Developer'
            },
            'dashboard': {
                title: 'Analytics Dashboard',
                description: 'A real-time analytics dashboard for data visualization with interactive charts, customizable widgets, and comprehensive reporting features.',
                image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
                technologies: ['Vue.js', 'D3.js', 'Python', 'PostgreSQL', 'WebSocket'],
                features: [
                    'Real-time data visualization',
                    'Interactive and customizable charts',
                    'Drag-and-drop dashboard builder',
                    'Advanced filtering and search',
                    'Export functionality (PDF, Excel)',
                    'User role-based access control',
                    'Mobile-responsive design'
                ],
                liveUrl: 'https://analytics-dashboard-demo.com',
                githubUrl: 'https://github.com/johndoe/analytics-dashboard',
                duration: '2 months',
                role: 'Frontend Developer'
            },
            'brand-design': {
                title: 'Brand Identity Design',
                description: 'Complete brand identity package for a tech startup, including logo design, brand guidelines, marketing materials, and digital assets.',
                image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2364&q=80',
                technologies: ['Figma', 'Adobe Illustrator', 'Adobe Photoshop', 'Adobe InDesign'],
                features: [
                    'Logo design and variations',
                    'Brand color palette and typography',
                    'Business card and letterhead design',
                    'Marketing collateral (brochures, flyers)',
                    'Social media templates',
                    'Website mockups and UI elements',
                    'Brand guidelines document'
                ],
                liveUrl: 'https://brand-portfolio.com/tech-startup',
                githubUrl: null, // No GitHub for design projects
                duration: '6 weeks',
                role: 'Brand Designer'
            },
            'weather-app': {
                title: 'Weather Forecast App',
                description: 'A real-time weather application with location-based forecasts, beautiful animations, and comprehensive weather data visualization.',
                image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
                technologies: ['JavaScript', 'OpenWeather API', 'CSS3', 'Chart.js'],
                features: [
                    '5-day weather forecast',
                    'Location-based weather detection',
                    'Beautiful weather animations',
                    'Hourly weather breakdown',
                    'Weather alerts and notifications',
                    'Responsive design for all devices',
                    'Offline weather data caching'
                ],
                liveUrl: 'https://weather-forecast-app-demo.com',
                githubUrl: 'https://github.com/johndoe/weather-app',
                duration: '3 weeks',
                role: 'Frontend Developer'
            },
            'portfolio-website': {
                title: 'Portfolio Website',
                description: 'A modern portfolio website with interactive animations, responsive design, and showcasing creative work with smooth user experience.',
                image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2369&q=80',
                technologies: ['HTML5', 'CSS3', 'JavaScript', 'GSAP'],
                features: [
                    'Interactive scroll animations',
                    'Responsive grid layouts',
                    'Smooth page transitions',
                    'Dynamic content loading',
                    'Contact form integration',
                    'SEO optimization',
                    'Cross-browser compatibility'
                ],
                liveUrl: 'https://portfolio-website-demo.com',
                githubUrl: 'https://github.com/johndoe/portfolio-website',
                duration: '4 weeks',
                role: 'Web Designer & Developer'
            }
        };
        
        return projectsData[projectId] || null;
    }
    
    // =============================
    // GENERATE PROJECT DETAILS HTML
    // =============================
    generateProjectDetailsHTML(project) {
        return `
            <div class="project-details-content">
                <div class="project-hero">
                    <img src="${project.image}" alt="${project.title}" class="project-detail-image">
                </div>
                
                <div class="project-info-detailed">
                    <div class="project-meta">
                        <div class="meta-item">
                            <strong>Role:</strong> ${project.role}
                        </div>
                        <div class="meta-item">
                            <strong>Duration:</strong> ${project.duration}
                        </div>
                    </div>
                    
                    <div class="project-description">
                        <h4>Project Overview</h4>
                        <p>${project.description}</p>
                    </div>
                    
                    <div class="project-technologies">
                        <h4>Technologies Used</h4>
                        <div class="tech-tags-large">
                            ${project.technologies.map(tech => `<span class="tech-tag-large">${tech}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div class="project-features">
                        <h4>Key Features</h4>
                        <ul class="features-list">
                            ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="project-links-detailed">
                        <h4>Project Links</h4>
                        <div class="links-container">
                            ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" class="btn-primary">View Live Demo</a>` : ''}
                            ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" class="btn-secondary">View Source Code</a>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // =============================
    // SETUP FORM HANDLING
    // =============================
    setupFormHandling() {
        // Handle contact form submission
        document.addEventListener('submit', (event) => {
            if (event.target.id === 'quick-contact-form') {
                event.preventDefault();
                this.handleContactFormSubmission(event.target);
            }
        });
        
        // Setup real-time validation
        document.addEventListener('input', (event) => {
            if (event.target.closest('#quick-contact-form')) {
                this.validateFormField(event.target);
            }
        });
    }
    
    // =============================
    // HANDLE CONTACT FORM SUBMISSION
    // =============================
    handleContactFormSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Validate form
        const isValid = this.validateContactForm(form);
        
        if (!isValid) {
            this.showFormError('Please fill in all required fields correctly.');
            return;
        }
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Success simulation
            this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            
            // Reset form and close modal
            form.reset();
            this.closeModal();
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Log form data (in real app, send to server)
            console.log('📧 Contact form submitted:', data);
        }, 2000);
    }
    
    // =============================
    // VALIDATE CONTACT FORM
    // =============================
    validateContactForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!this.validateFormField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    // =============================
    // VALIDATE FORM FIELD
    // =============================
    validateFormField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Remove previous validation states
        field.classList.remove('error', 'success');
        
        // Required field check
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        
        // Name validation
        if (field.name === 'name' && value) {
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters';
            }
        }
        
        // Message validation
        if (field.name === 'message' && value) {
            if (value.length < 10) {
                isValid = false;
                errorMessage = 'Message must be at least 10 characters';
            }
        }
        
        // Apply validation styling
        if (isValid && value) {
            field.classList.add('success');
        } else if (!isValid) {
            field.classList.add('error');
        }
        
        // Show error message
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = errorMessage;
        }
        
        return isValid;
    }
    
    // =============================
    // ACCESSIBILITY METHODS
    // =============================
    setupAccessibility(modal) {
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', modal.querySelector('h3')?.id || 'modal-title');
    }
    
    removeAccessibility(modal) {
        modal.removeAttribute('role');
        modal.removeAttribute('aria-modal');
        modal.removeAttribute('aria-labelledby');
    }
    
    focusModal(modal) {
        const focusableElements = modal.querySelectorAll(this.focusableElements);
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    }
    
    trapFocus(event) {
        if (!this.activeModal) return;
        
        const focusableElements = this.activeModal.querySelectorAll(this.focusableElements);
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (event.shiftKey) {
            if (document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }
    }
    
    // =============================
    // ANIMATION METHODS
    // =============================
    addOpenAnimation(modal) {
        modal.style.animation = 'none';
        setTimeout(() => {
            modal.style.animation = '';
        }, 10);
    }
    
    addCloseAnimation(modal) {
        this.modalOverlay.classList.add('closing');
        setTimeout(() => {
            this.modalOverlay.classList.remove('closing');
        }, 300);
    }
    
    adjustModalPosition() {
        if (!this.activeModal) return;
        
        const modalContent = this.activeModal.querySelector('.modal-content');
        if (modalContent) {
            const rect = modalContent.getBoundingClientRect();
            if (rect.height > window.innerHeight - 40) {
                modalContent.style.maxHeight = `${window.innerHeight - 40}px`;
                modalContent.style.overflowY = 'auto';
            }
        }
    }
    
    // =============================
    // UTILITY METHODS
    // =============================
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Add to container
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
        
        container.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            notification.classList.add('hide');
            setTimeout(() => {
                if (container.contains(notification)) {
                    container.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
    
    showFormError(message) {
        this.showNotification(message, 'error');
    }
    
    // =============================
    // PUBLIC API METHODS
    // =============================
    open(modalId, options = {}) {
        this.openModal(modalId, options);
    }
    
    close() {
        this.closeModal();
    }
    
    isOpen() {
        return this.activeModal !== null;
    }
    
    getCurrentModal() {
        return this.activeModal?.id || null;
    }
    
    // =============================
    // DESTROY METHOD
    // =============================
    destroy() {
        if (this.activeModal) {
            this.closeModal();
        }
        
        // Remove event listeners by replacing elements
        document.removeEventListener('click', this.handleClick);
        document.removeEventListener('keydown', this.handleKeydown);
        
        console.log('🧹 Modal Manager destroyed');
    }
}

// ===================================
// INITIALIZE MODAL MANAGER
// ===================================
let modalManager;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        modalManager = new ModalManager();
    });
} else {
    modalManager = new ModalManager();
}

// Make it globally available
window.modalManager = modalManager;