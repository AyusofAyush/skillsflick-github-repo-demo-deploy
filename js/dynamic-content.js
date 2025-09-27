// ===================================
// DYNAMIC CONTENT & ANIMATIONS MANAGER
// ===================================
// This module handles dynamic content loading, animations, theme switching,
// counters, project filtering, and interactive features

class DynamicContentManager {
    constructor() {
        this.animationObserver = null;
        this.countersAnimated = false;
        this.skillsAnimated = false;
        this.currentTheme = 'light';
        this.roles = ['Full-Stack Developer', 'UI/UX Designer', 'Problem Solver', 'Coffee Enthusiast'];
        this.currentRoleIndex = 0;
        
        this.init();
    }
    
    init() {
        console.log('✨ Initializing Dynamic Content Manager...');
        
        this.setupIntersectionObserver();
        this.setupCounterAnimations();
        this.setupSkillAnimations();
        this.setupThemeToggle();
        this.setupRoleRotator();
        this.setupProjectFiltering();
        this.setupDynamicLoading();
        this.setupTypingEffect();
        this.setupParallaxEffects();
        
        console.log('✅ Dynamic Content Manager initialized');
    }
    
    // =============================
    // INTERSECTION OBSERVER SETUP
    // =============================
    setupIntersectionObserver() {
        const options = {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    
                    // Trigger specific animations based on element
                    if (entry.target.classList.contains('stats-grid') && !this.countersAnimated) {
                        this.animateCounters();
                        this.countersAnimated = true;
                    }
                    
                    if (entry.target.classList.contains('skills-grid') && !this.skillsAnimated) {
                        this.animateSkills();
                        this.skillsAnimated = true;
                    }
                    
                    // Unobserve after animation to prevent re-triggering
                    this.animationObserver.unobserve(entry.target);
                }
            });
        }, options);
        
        // Observe elements that need scroll-triggered animations
        const elementsToObserve = document.querySelectorAll('.animate-on-scroll, .stats-grid, .skills-grid, .project-grid');
        elementsToObserve.forEach(element => {
            this.animationObserver.observe(element);
        });
    }
    
    // =============================
    // COUNTER ANIMATIONS
    // =============================
    setupCounterAnimations() {
        // Initially set all counters to 0
        const counters = document.querySelectorAll('.stat-number, #experience-counter');
        counters.forEach(counter => {
            counter.textContent = '0';
        });
    }
    
    animateCounters() {
        const counters = document.querySelectorAll('.stat-number, #experience-counter');
        
        counters.forEach((counter, index) => {
            const target = parseInt(counter.getAttribute('data-target')) || 5;
            const increment = target / 100; // Divide into 100 steps
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                
                if (current >= target) {
                    counter.textContent = target;
                    clearInterval(timer);
                    
                    // Add completion animation
                    counter.classList.add('counting');
                    setTimeout(() => {
                        counter.classList.remove('counting');
                    }, 500);
                } else {
                    counter.textContent = Math.floor(current);
                }
            }, 20); // 20ms intervals for smooth animation
            
            // Add stagger effect
            setTimeout(() => {
                // Start animation
            }, index * 200);
        });
        
        console.log('🔢 Counter animations started');
    }
    
    // =============================
    // SKILLS ANIMATIONS
    // =============================
    setupSkillAnimations() {
        // Initially set all skill bars to 0 width
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach(bar => {
            bar.style.width = '0%';
        });
    }
    
    animateSkills() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        skillBars.forEach((bar, index) => {
            const targetWidth = parseInt(bar.getAttribute('data-skill')) || 0;
            
            setTimeout(() => {
                // Animate width
                bar.style.width = `${targetWidth}%`;
                bar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                
                // Add shimmer effect after main animation
                setTimeout(() => {
                    bar.classList.add('animated');
                }, 1500);
                
            }, index * 150); // Stagger animations
        });
        
        console.log('🎯 Skill animations started');
    }
    
    // =============================
    // THEME TOGGLE SETUP
    // =============================
    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;
        
        // Load saved theme
        const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
        this.setTheme(savedTheme);
        
        themeToggle.addEventListener('click', () => {
            const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
            this.setTheme(newTheme);
        });
    }
    
    setTheme(theme) {
        const body = document.body;
        const themeToggle = document.getElementById('theme-toggle');
        
        // Update theme
        body.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        
        // Update toggle button
        if (themeToggle) {
            themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
            
            // Add transition effect
            themeToggle.style.transform = 'scale(0.8)';
            setTimeout(() => {
                themeToggle.style.transform = 'scale(1)';
            }, 150);
        }
        
        // Save preference
        localStorage.setItem('portfolio-theme', theme);
        
        // Add smooth transition
        body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            body.style.transition = '';
        }, 300);
        
        console.log(`🎨 Theme changed to: ${theme}`);
    }
    
    // =============================
    // ROLE ROTATOR SETUP
    // =============================
    setupRoleRotator() {
        const roleElement = document.getElementById('role-rotator');
        if (!roleElement) return;
        
        // Start rotation after initial delay
        setTimeout(() => {
            this.rotateRole();
        }, 3000);
        
        // Continue rotating every 4 seconds
        setInterval(() => {
            this.rotateRole();
        }, 4000);
    }
    
    rotateRole() {
        const roleElement = document.getElementById('role-rotator');
        if (!roleElement) return;
        
        // Add changing animation
        roleElement.classList.add('changing');
        
        setTimeout(() => {
            // Change to next role
            this.currentRoleIndex = (this.currentRoleIndex + 1) % this.roles.length;
            roleElement.textContent = this.roles[this.currentRoleIndex];
            
            // Remove animation class
            roleElement.classList.remove('changing');
        }, 250);
    }
    
    // =============================
    // PROJECT FILTERING SETUP
    // =============================
    setupProjectFiltering() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter projects
                this.filterProjects(filter, projectCards);
            });
        });
    }
    
    filterProjects(filter, projectCards) {
        projectCards.forEach((card, index) => {
            const category = card.getAttribute('data-category');
            const shouldShow = filter === 'all' || category === filter;
            
            if (shouldShow) {
                // Show card with staggered animation
                setTimeout(() => {
                    card.style.display = 'block';
                    card.classList.add('fade-in');
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            } else {
                // Hide card
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                    card.classList.remove('fade-in');
                }, 300);
            }
        });
        
        console.log(`🎯 Projects filtered by: ${filter}`);
    }
    
    // =============================
    // DYNAMIC LOADING SETUP
    // =============================
    setupDynamicLoading() {
        const loadMoreBtn = document.querySelector('.load-more-btn');
        if (!loadMoreBtn) return;
        
        loadMoreBtn.addEventListener('click', () => {
            this.loadMoreProjects();
        });
    }
    
    async loadMoreProjects() {
        const loadMoreBtn = document.querySelector('.load-more-btn');
        const projectGrid = document.getElementById('project-grid');
        
        if (!loadMoreBtn || !projectGrid) return;
        
        // Show loading state
        const originalText = loadMoreBtn.textContent;
        loadMoreBtn.textContent = 'Loading...';
        loadMoreBtn.disabled = true;
        
        try {
            // Simulate API delay
            await this.delay(1500);
            
            // Generate additional projects
            const additionalProjects = this.generateAdditionalProjects();
            
            // Add new projects with animation
            this.addProjectsWithAnimation(projectGrid, additionalProjects);
            
            // Update button state
            loadMoreBtn.textContent = originalText;
            loadMoreBtn.disabled = false;
            
            console.log('📁 Additional projects loaded');
            
        } catch (error) {
            console.error('❌ Error loading projects:', error);
            loadMoreBtn.textContent = 'Try Again';
            loadMoreBtn.disabled = false;
        }
    }
    
    generateAdditionalProjects() {
        return [
            {
                id: 'weather-app',
                title: 'Weather Forecast App',
                description: 'Real-time weather application with location-based forecasts and beautiful animations.',
                image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
                category: 'web',
                technologies: ['JavaScript', 'OpenWeather API', 'CSS3']
            },
            {
                id: 'portfolio-website',
                title: 'Portfolio Website',
                description: 'Modern portfolio website with interactive animations and responsive design.',
                image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2369&q=80',
                category: 'design',
                technologies: ['HTML5', 'CSS3', 'JavaScript', 'GSAP']
            }
        ];
    }
    
    addProjectsWithAnimation(container, projects) {
        projects.forEach((project, index) => {
            const projectElement = this.createProjectElement(project);
            
            // Initially hide the element
            projectElement.style.opacity = '0';
            projectElement.style.transform = 'translateY(50px)';
            
            // Add to container
            container.appendChild(projectElement);
            
            // Animate in with stagger
            setTimeout(() => {
                projectElement.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                projectElement.style.opacity = '1';
                projectElement.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }
    
    createProjectElement(project) {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.setAttribute('data-category', project.category);
        
        projectCard.innerHTML = `
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}" loading="lazy">
                <div class="project-overlay">
                    <button class="btn-primary" data-modal="project-modal" data-project="${project.id}">
                        View Details
                    </button>
                    <a href="#" class="btn-secondary" target="_blank" data-no-modal="true">Live Demo</a>
                </div>
            </div>
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tech">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
            </div>
        `;
        
        return projectCard;
    }
    
    // =============================
    // TYPING EFFECT SETUP
    // =============================
    setupTypingEffect() {
        const typingElement = document.querySelector('.typing-text');
        if (!typingElement) return;
        
        const text = typingElement.textContent;
        typingElement.textContent = '';
        
        // Add typing effect after page load
        setTimeout(() => {
            this.typeText(typingElement, text, 100);
        }, 1000);
    }
    
    typeText(element, text, speed) {
        let i = 0;
        
        const typeTimer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typeTimer);
                
                // Start cursor blinking
                setTimeout(() => {
                    element.style.borderRight = '3px solid white';
                    element.style.animation = 'blink 1s step-end infinite';
                }, 500);
            }
        }, speed);
    }
    
    // =============================
    // PARALLAX EFFECTS SETUP
    // =============================
    setupParallaxEffects() {
        let ticking = false;
        
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateParallaxElements();
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    updateParallaxElements() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // Parallax for hero background shapes
        const shapes = document.querySelectorAll('.hero .shape');
        shapes.forEach((shape, index) => {
            const speed = 0.3 + (index * 0.1);
            const yPos = scrolled * speed;
            shape.style.transform = `translateY(${yPos}px)`;
        });
        
        // Parallax for section backgrounds
        const parallaxElements = document.querySelectorAll('.parallax-bg');
        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-speed') || 0.5;
            const yPos = scrolled * speed;
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
    
    // =============================
    // NOTIFICATION SYSTEM
    // =============================
    showNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Get or create notification container
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
        
        // Add notification to container
        container.appendChild(notification);
        
        // Show with animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Handle close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            this.hideNotification(notification);
        });
        
        // Auto-hide after duration
        if (duration > 0) {
            setTimeout(() => {
                this.hideNotification(notification);
            }, duration);
        }
        
        return notification;
    }
    
    hideNotification(notification) {
        notification.classList.remove('show');
        notification.classList.add('hide');
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
    
    // =============================
    // FORM ENHANCEMENTS
    // =============================
    setupFormEnhancements() {
        // Add floating labels
        const formGroups = document.querySelectorAll('.form-group');
        
        formGroups.forEach(group => {
            const input = group.querySelector('input, textarea, select');
            const label = group.querySelector('label');
            
            if (input && label) {
                // Add floating label class
                group.classList.add('floating-label');
                
                // Handle focus and blur events
                input.addEventListener('focus', () => {
                    group.classList.add('focused');
                });
                
                input.addEventListener('blur', () => {
                    if (!input.value) {
                        group.classList.remove('focused');
                    }
                });
                
                // Check initial state
                if (input.value) {
                    group.classList.add('focused');
                }
            }
        });
    }
    
    // =============================
    // LOADING STATES
    // =============================
    showLoadingSpinner(element, text = 'Loading...') {
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner-inline';
        spinner.innerHTML = `
            <div class="spinner"></div>
            <span>${text}</span>
        `;
        
        element.appendChild(spinner);
        return spinner;
    }
    
    hideLoadingSpinner(spinner) {
        if (spinner && spinner.parentNode) {
            spinner.parentNode.removeChild(spinner);
        }
    }
    
    // =============================
    // IMAGE LAZY LOADING
    // =============================
    setupLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.classList.add('fade-in');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
    
    // =============================
    // UTILITY METHODS
    // =============================
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Generate random ID
    generateId(length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    
    // =============================
    // PERFORMANCE MONITORING
    // =============================
    measurePerformance(name, fn) {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        console.log(`⏱️ ${name} took ${end - start} milliseconds`);
        return result;
    }
    
    // =============================
    // PUBLIC API METHODS
    // =============================
    
    // Manually trigger counter animation
    triggerCounters() {
        if (!this.countersAnimated) {
            this.animateCounters();
            this.countersAnimated = true;
        }
    }
    
    // Manually trigger skill animation
    triggerSkills() {
        if (!this.skillsAnimated) {
            this.animateSkills();
            this.skillsAnimated = true;
        }
    }
    
    // Change theme programmatically
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
    
    // Add project programmatically
    addProject(projectData) {
        const projectGrid = document.getElementById('project-grid');
        if (projectGrid) {
            const projectElement = this.createProjectElement(projectData);
            this.addProjectsWithAnimation(projectGrid, [projectData]);
        }
    }
    
    // Show notification programmatically
    notify(message, type = 'info', duration = 5000) {
        return this.showNotification(message, type, duration);
    }
    
    // =============================
    // DESTROY METHOD
    // =============================
    destroy() {
        // Disconnect observers
        if (this.animationObserver) {
            this.animationObserver.disconnect();
        }
        
        // Clear intervals
        clearInterval(this.roleRotatorInterval);
        
        // Remove event listeners
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        
        // Reset animations
        this.countersAnimated = false;
        this.skillsAnimated = false;
        
        console.log('🧹 Dynamic Content Manager destroyed');
    }
}

// ===================================
// INITIALIZE DYNAMIC CONTENT MANAGER
// ===================================
let dynamicContentManager;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        dynamicContentManager = new DynamicContentManager();
    });
} else {
    dynamicContentManager = new DynamicContentManager();
}

// Make it globally available
window.dynamicContentManager = dynamicContentManager;

// ===================================
// ADDITIONAL UTILITY FUNCTIONS
// ===================================

// Smooth reveal animation for elements
function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(reveal => {
        const windowHeight = window.innerHeight;
        const elementTop = reveal.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            reveal.classList.add('active');
        }
    });
}

// Initialize reveal animations
window.addEventListener('scroll', revealOnScroll);

// Add CSS classes for dynamic styling
document.addEventListener('DOMContentLoaded', () => {
    // Add GPU acceleration to animated elements
    const animatedElements = document.querySelectorAll(
        '.project-card, .skill-progress, .stat-number, .cta-button, .nav-link'
    );
    
    animatedElements.forEach(element => {
        element.classList.add('gpu-accelerated');
    });
    
    // Add smooth animation class to body
    document.body.classList.add('smooth-animation');
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DynamicContentManager;
}
