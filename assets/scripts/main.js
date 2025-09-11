// Main JavaScript file for portfolio website
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio website loaded successfully');
    
    // Initialize accessibility features first
    initializeAccessibilityFeatures();
    
    // Initialize performance monitoring
    initializePerformanceIntegration();
    
    // Initialize navigation
    initializeNavigation();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Initialize keyboard navigation
    initializeKeyboardNavigation();
    
    // Initialize project demos
    initializeProjectDemos();
    
    // Initialize installer downloads
    initializeInstallerDownloads();
    
    // Initialize skills visualization
    initializeSkillsVisualization();
    
    // Initialize certifications system
    initializeCertifications();
    
    // Initialize contact form
    initializeContactForm();
    
    // Initialize social media tracking
    initializeSocialMediaTracking();
    
    // Initialize image error handling
    initializeImageErrorHandling();
});

// Accessibility Features
function initializeAccessibilityFeatures() {
    // Initialize ARIA live regions
    initializeAriaLiveRegions();
    
    // Initialize screen reader announcements
    initializeScreenReaderAnnouncements();
    
    // Initialize focus management
    initializeFocusManagement();
    
    // Initialize keyboard shortcuts
    initializeKeyboardShortcuts();
    
    // Initialize high contrast mode detection
    initializeHighContrastMode();
    
    // Initialize reduced motion detection
    initializeReducedMotionMode();
    
    // Initialize image alt text validation
    validateImageAltText();
    
    // Initialize form accessibility
    initializeFormAccessibility();
    
    console.log('Accessibility features initialized');
}

// ARIA Live Regions Management
function initializeAriaLiveRegions() {
    window.AccessibilityManager = {
        announcePolite: function(message) {
            const liveRegion = document.getElementById('live-region-polite');
            if (liveRegion) {
                liveRegion.textContent = message;
                setTimeout(() => {
                    liveRegion.textContent = '';
                }, 1000);
            }
        },
        
        announceAssertive: function(message) {
            const liveRegion = document.getElementById('live-region-assertive');
            if (liveRegion) {
                liveRegion.textContent = message;
                setTimeout(() => {
                    liveRegion.textContent = '';
                }, 1000);
            }
        },
        
        announceToScreenReader: function(message) {
            const srAnnouncements = document.getElementById('sr-announcements');
            if (srAnnouncements) {
                srAnnouncements.textContent = message;
                setTimeout(() => {
                    srAnnouncements.textContent = '';
                }, 2000);
            }
        }
    };
}

// Screen Reader Announcements
function initializeScreenReaderAnnouncements() {
    // Announce page load completion
    setTimeout(() => {
        window.AccessibilityManager.announcePolite('Portfolio website loaded successfully. Use Tab to navigate or press H to jump between headings.');
    }, 1000);
    
    // Announce section changes during navigation
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                const sectionTitle = entry.target.querySelector('h2')?.textContent || entry.target.id;
                window.AccessibilityManager.announcePolite(`Now viewing ${sectionTitle} section`);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '-20% 0px -20% 0px'
    });
    
    sections.forEach(section => observer.observe(section));
}

// Focus Management
function initializeFocusManagement() {
    // Track focus for better UX
    let focusedElement = null;
    
    document.addEventListener('focusin', function(e) {
        focusedElement = e.target;
        
        // Add focus class for custom styling
        e.target.classList.add('has-focus');
        
        // Announce focused element to screen readers if it has a label
        const label = e.target.getAttribute('aria-label') || 
                     e.target.getAttribute('title') || 
                     e.target.textContent?.trim();
        
        if (label && label.length > 0 && label.length < 100) {
            // Only announce for interactive elements
            if (e.target.matches('button, a, input, textarea, select, [tabindex]')) {
                setTimeout(() => {
                    window.AccessibilityManager.announcePolite(`Focused on ${label}`);
                }, 100);
            }
        }
    });
    
    document.addEventListener('focusout', function(e) {
        e.target.classList.remove('has-focus');
    });
    
    // Return focus to last focused element when modals close
    window.AccessibilityManager.returnFocus = function() {
        if (focusedElement && document.contains(focusedElement)) {
            focusedElement.focus();
        }
    };
    
    // Focus trap utility for modals/dialogs
    window.AccessibilityManager.trapFocus = function(container) {
        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        container.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
        
        // Focus first element
        firstElement.focus();
    };
}

// Keyboard Shortcuts
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Skip if user is typing in an input
        if (e.target.matches('input, textarea, select, [contenteditable]')) {
            return;
        }
        
        // Alt + key combinations for quick navigation
        if (e.altKey) {
            switch(e.key.toLowerCase()) {
                case 'h':
                    e.preventDefault();
                    document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
                    window.AccessibilityManager.announcePolite('Navigated to home section');
                    break;
                case 'a':
                    e.preventDefault();
                    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                    window.AccessibilityManager.announcePolite('Navigated to about section');
                    break;
                case 'p':
                    e.preventDefault();
                    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                    window.AccessibilityManager.announcePolite('Navigated to projects section');
                    break;
                case 's':
                    e.preventDefault();
                    document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
                    window.AccessibilityManager.announcePolite('Navigated to skills section');
                    break;
                case 'c':
                    e.preventDefault();
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    window.AccessibilityManager.announcePolite('Navigated to contact section');
                    break;
                case '?':
                    e.preventDefault();
                    showKeyboardShortcutsHelp();
                    break;
            }
        }
        
        // Escape key to close any open modals/demos
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
    
    // Add keyboard shortcuts help
    function showKeyboardShortcutsHelp() {
        const helpText = `
            Keyboard Shortcuts:
            Alt + H: Go to Home
            Alt + A: Go to About
            Alt + P: Go to Projects
            Alt + S: Go to Skills
            Alt + C: Go to Contact
            Alt + ?: Show this help
            Tab: Navigate forward
            Shift + Tab: Navigate backward
            Enter/Space: Activate buttons
            Escape: Close modals
        `;
        
        window.AccessibilityManager.announceAssertive('Keyboard shortcuts help displayed');
        alert(helpText); // Simple implementation, could be enhanced with a modal
    }
    
    function closeAllModals() {
        // Close any open demos
        const openDemos = document.querySelectorAll('.embedded-demo[style*="block"]');
        openDemos.forEach(demo => {
            const projectId = demo.id.replace('demo-', '');
            const toggleButton = document.querySelector(`[data-project="${projectId}"].demo-toggle`);
            if (toggleButton) {
                demo.style.display = 'none';
                demo.setAttribute('aria-hidden', 'true');
                toggleButton.classList.remove('active');
                toggleButton.setAttribute('aria-expanded', 'false');
                toggleButton.focus();
            }
        });
        
        // Close mobile menu if open
        const navMenu = document.querySelector('.nav-menu');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
            mobileToggle.focus();
        }
    }
}

// High Contrast Mode Detection
function initializeHighContrastMode() {
    // Detect if user prefers high contrast
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)');
    
    function handleHighContrastChange(e) {
        if (e.matches) {
            document.body.classList.add('high-contrast');
            window.AccessibilityManager.announcePolite('High contrast mode enabled');
        } else {
            document.body.classList.remove('high-contrast');
        }
    }
    
    // Initial check
    handleHighContrastChange(prefersHighContrast);
    
    // Listen for changes
    prefersHighContrast.addEventListener('change', handleHighContrastChange);
}

// Reduced Motion Mode Detection
function initializeReducedMotionMode() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    function handleReducedMotionChange(e) {
        if (e.matches) {
            document.body.classList.add('reduced-motion');
            window.AccessibilityManager.announcePolite('Reduced motion mode enabled');
        } else {
            document.body.classList.remove('reduced-motion');
        }
    }
    
    // Initial check
    handleReducedMotionChange(prefersReducedMotion);
    
    // Listen for changes
    prefersReducedMotion.addEventListener('change', handleReducedMotionChange);
}

// Image Alt Text Validation
function validateImageAltText() {
    const images = document.querySelectorAll('img');
    let missingAltCount = 0;
    
    images.forEach((img, index) => {
        if (!img.alt || img.alt.trim() === '') {
            console.warn(`Image ${index + 1} is missing alt text:`, img.src);
            missingAltCount++;
            
            // Add a default alt text for decorative images
            if (img.getAttribute('aria-hidden') === 'true' || 
                img.closest('[aria-hidden="true"]')) {
                img.alt = '';
            } else {
                img.alt = 'Image';
                console.warn(`Added default alt text to image ${index + 1}`);
            }
        }
        
        // Handle image load errors
        img.addEventListener('error', function() {
            this.alt = 'Image failed to load';
            this.style.display = 'none';
            
            // Create a text replacement
            const replacement = document.createElement('div');
            replacement.className = 'image-error';
            replacement.textContent = 'Image not available';
            replacement.setAttribute('role', 'img');
            replacement.setAttribute('aria-label', this.alt);
            
            this.parentNode.insertBefore(replacement, this.nextSibling);
        });
    });
    
    if (missingAltCount > 0) {
        console.warn(`Found ${missingAltCount} images with missing or empty alt text`);
    }
}

// Form Accessibility
function initializeFormAccessibility() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Add form validation announcements
        form.addEventListener('submit', function(e) {
            const errors = form.querySelectorAll('.error-message:not(:empty)');
            if (errors.length > 0) {
                e.preventDefault();
                window.AccessibilityManager.announceAssertive(`Form has ${errors.length} error${errors.length > 1 ? 's' : ''}. Please review and correct.`);
                
                // Focus first error field
                const firstErrorField = form.querySelector('.error-message:not(:empty)')?.previousElementSibling;
                if (firstErrorField) {
                    firstErrorField.focus();
                }
            }
        });
        
        // Add real-time validation announcements
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                const errorElement = document.getElementById(this.getAttribute('aria-describedby'));
                if (errorElement && errorElement.textContent.trim()) {
                    window.AccessibilityManager.announcePolite(`${this.labels[0]?.textContent || 'Field'}: ${errorElement.textContent}`);
                }
            });
            
            // Clear error announcements when user starts typing
            input.addEventListener('input', function() {
                const errorElement = document.getElementById(this.getAttribute('aria-describedby'));
                if (errorElement && errorElement.textContent.trim()) {
                    setTimeout(() => {
                        if (!errorElement.textContent.trim()) {
                            window.AccessibilityManager.announcePolite(`${this.labels[0]?.textContent || 'Field'} error cleared`);
                        }
                    }, 500);
                }
            });
        });
    });
}

// Image Error Handling
function initializeImageErrorHandling() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            // Create a fallback element
            const fallback = document.createElement('div');
            fallback.className = 'image-fallback';
            fallback.innerHTML = `
                <div class="fallback-content">
                    <i class="fas fa-image" aria-hidden="true"></i>
                    <span>Image not available</span>
                </div>
            `;
            fallback.setAttribute('role', 'img');
            fallback.setAttribute('aria-label', this.alt || 'Image not available');
            
            // Replace the image with the fallback
            this.parentNode.replaceChild(fallback, this);
            
            console.warn('Image failed to load, replaced with fallback:', this.src);
        });
    });
}

// Performance integration
function initializePerformanceIntegration() {
    // Wait for performance optimizer to be available
    if (typeof window.performanceOptimizer !== 'undefined') {
        // Integrate with performance optimizer
        console.log('Performance optimizer integrated');
        
        // Track page load completion
        window.addEventListener('load', () => {
            setTimeout(() => {
                if (window.performanceOptimizer) {
                    const status = window.performanceOptimizer.getPerformanceStatus();
                    console.log('Performance status:', status);
                }
            }, 1000);
        });
    } else {
        // Retry after a short delay
        setTimeout(initializePerformanceIntegration, 100);
    }
}

// Navigation functionality
function initializeNavigation() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navigation = document.querySelector('.main-navigation');
    
    if (mobileToggle && navMenu) {
        // Mobile menu toggle functionality
        mobileToggle.addEventListener('click', function() {
            const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
            
            // Toggle menu visibility
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
            
            // Update ARIA attributes
            mobileToggle.setAttribute('aria-expanded', !isExpanded);
            
            // Prevent body scroll when menu is open
            if (!isExpanded) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close mobile menu when clicking on nav links
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    mobileToggle.classList.remove('active');
                    mobileToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (navMenu.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                !mobileToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
        
        // Handle escape key to close mobile menu
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
                mobileToggle.focus(); // Return focus to toggle button
            }
        });
    }
    
    // Add scroll effect to navigation
    if (navigation) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navigation.classList.add('scrolled');
            } else {
                navigation.classList.remove('scrolled');
            }
        });
    }
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"], .brand-link[href^="#"], .hero-actions a[href^="#"]');
    const sections = document.querySelectorAll('section[id]');
    const navigationHeight = document.querySelector('.main-navigation').offsetHeight;
    
    // Smooth scroll functionality
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - navigationHeight - 20;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update active link immediately
                updateActiveNavLink(targetId);
            }
        });
    });
    
    // Active section highlighting on scroll
    function updateActiveNavLink(activeId = null) {
        const navMenuLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
        
        if (activeId) {
            // Manually set active link
            navMenuLinks.forEach(link => {
                const linkId = link.getAttribute('href').substring(1);
                if (linkId === activeId) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        } else {
            // Determine active section based on scroll position
            let currentSection = '';
            const scrollPosition = window.scrollY + navigationHeight + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    currentSection = section.getAttribute('id');
                }
            });
            
            // Update active nav link
            navMenuLinks.forEach(link => {
                const linkId = link.getAttribute('href').substring(1);
                if (linkId === currentSection) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
    }
    
    // Throttled scroll event for performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(updateActiveNavLink, 10);
    });
    
    // Initialize active link on page load
    updateActiveNavLink();
}

// Keyboard navigation for accessibility
function initializeKeyboardNavigation() {
    const navLinks = document.querySelectorAll('.nav-menu a');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    // Handle keyboard navigation within the menu
    navLinks.forEach((link, index) => {
        link.addEventListener('keydown', function(e) {
            let targetIndex;
            
            switch(e.key) {
                case 'ArrowDown':
                case 'ArrowRight':
                    e.preventDefault();
                    targetIndex = (index + 1) % navLinks.length;
                    navLinks[targetIndex].focus();
                    break;
                    
                case 'ArrowUp':
                case 'ArrowLeft':
                    e.preventDefault();
                    targetIndex = (index - 1 + navLinks.length) % navLinks.length;
                    navLinks[targetIndex].focus();
                    break;
                    
                case 'Home':
                    e.preventDefault();
                    navLinks[0].focus();
                    break;
                    
                case 'End':
                    e.preventDefault();
                    navLinks[navLinks.length - 1].focus();
                    break;
                    
                case 'Escape':
                    if (navMenu.classList.contains('active')) {
                        e.preventDefault();
                        navMenu.classList.remove('active');
                        mobileToggle.classList.remove('active');
                        mobileToggle.setAttribute('aria-expanded', 'false');
                        document.body.style.overflow = '';
                        mobileToggle.focus();
                    }
                    break;
            }
        });
    });
    
    // Handle Tab key navigation to trap focus in mobile menu
    if (mobileToggle && navMenu) {
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab' && navMenu.classList.contains('active')) {
                const focusableElements = navMenu.querySelectorAll('a');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey) {
                    // Shift + Tab
                    if (document.activeElement === firstElement || document.activeElement === mobileToggle) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    // Tab
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        mobileToggle.focus();
                    }
                }
            }
        });
        
        // Handle Enter and Space keys for mobile toggle
        mobileToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
                
                // Focus first menu item when opening
                if (navMenu.classList.contains('active')) {
                    setTimeout(() => {
                        const firstLink = navMenu.querySelector('a');
                        if (firstLink) firstLink.focus();
                    }, 100);
                }
            }
        });
    }
    
    // Skip link functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.focus();
                mainContent.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

// Project demo functionality
function initializeProjectDemos() {
    // Initialize demo toggle buttons
    const demoToggleButtons = document.querySelectorAll('.demo-toggle');
    const demoCloseButtons = document.querySelectorAll('.demo-close');
    
    // Add event listeners for demo toggles
    demoToggleButtons.forEach(button => {
        button.addEventListener('click', handleDemoToggle);
        
        // Add keyboard support
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleDemoToggle.call(this, e);
            }
        });
    });
    
    // Add event listeners for demo close buttons
    demoCloseButtons.forEach(button => {
        button.addEventListener('click', handleDemoClose);
        
        // Add keyboard support
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleDemoClose.call(this, e);
            }
        });
    });
    
    // Handle escape key to close demos
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeDemos = document.querySelectorAll('.embedded-demo[style*="block"]');
            activeDemos.forEach(demo => {
                const projectId = demo.id.replace('demo-', '');
                const toggleButton = document.querySelector(`[data-project="${projectId}"].demo-toggle`);
                if (toggleButton) {
                    closeDemoById(projectId);
                    toggleButton.focus();
                }
            });
        }
    });
    
    // Initialize lazy loading observer for iframes
    initializeLazyLoading();
}

function handleDemoToggle(event) {
    const projectId = event.target.dataset.project;
    const demoContainer = document.getElementById(`demo-${projectId}`);
    const toggleButton = event.target;
    const playIcon = toggleButton.querySelector('.fas');
    
    if (!demoContainer) {
        console.error(`Demo container not found for project: ${projectId}`);
        return;
    }
    
    const isVisible = demoContainer.style.display === 'block';
    
    if (!isVisible) {
        // Show demo
        showDemo(projectId, demoContainer, toggleButton, playIcon);
    } else {
        // Hide demo
        hideDemo(projectId, demoContainer, toggleButton, playIcon);
    }
}

function handleDemoClose(event) {
    const projectId = event.target.dataset.project;
    closeDemoById(projectId);
}

function showDemo(projectId, demoContainer, toggleButton, playIcon) {
    // Update container visibility
    demoContainer.style.display = 'block';
    demoContainer.setAttribute('aria-hidden', 'false');
    
    // Update button state
    toggleButton.classList.add('active');
    toggleButton.setAttribute('aria-expanded', 'true');
    
    // Update button text and icon
    if (playIcon) {
        playIcon.className = 'fas fa-stop';
    }
    const buttonText = toggleButton.childNodes[toggleButton.childNodes.length - 1];
    if (buttonText && buttonText.nodeType === Node.TEXT_NODE) {
        buttonText.textContent = ' Hide Demo';
    }
    
    // Announce to screen readers
    const projectTitle = toggleButton.closest('.project-card').querySelector('.project-title')?.textContent || 'Project';
    window.AccessibilityManager.announcePolite(`${projectTitle} demo opened. Press Escape to close.`);
    
    // Lazy load iframe if not already loaded
    const iframe = demoContainer.querySelector('iframe');
    if (iframe && !iframe.src && iframe.dataset.src) {
        // Add loading state
        toggleButton.classList.add('loading');
        window.AccessibilityManager.announcePolite('Loading demo...');
        
        iframe.src = iframe.dataset.src;
        
        // Add loading indicator
        iframe.addEventListener('load', function() {
            iframe.style.opacity = '1';
            toggleButton.classList.remove('loading');
            window.AccessibilityManager.announcePolite('Demo loaded successfully');
            PortfolioUtils.trackEvent('demo_loaded', { projectId: projectId });
        });
        
        iframe.addEventListener('error', function() {
            console.error(`Failed to load demo for project: ${projectId}`);
            toggleButton.classList.remove('loading');
            iframe.src = 'data:text/html,<html><body style="font-family:Arial,sans-serif;padding:20px;text-align:center;"><h3>Demo Unavailable</h3><p>Sorry, this demo is currently unavailable. Please check back later or view the source code.</p></body></html>';
            window.AccessibilityManager.announceAssertive('Demo failed to load. Please try again later.');
        });
    }
    
    // Smooth scroll to demo if it's below the fold
    setTimeout(() => {
        const demoRect = demoContainer.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        if (demoRect.bottom > viewportHeight) {
            demoContainer.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });
        }
    }, 100);
    
    // Track demo open event
    PortfolioUtils.trackEvent('demo_opened', { 
        projectId: projectId,
        timestamp: new Date().toISOString()
    });
}

function hideDemo(projectId, demoContainer, toggleButton, playIcon) {
    // Update container visibility
    demoContainer.style.display = 'none';
    demoContainer.setAttribute('aria-hidden', 'true');
    
    // Update button state
    toggleButton.classList.remove('active');
    toggleButton.setAttribute('aria-expanded', 'false');
    
    // Update button text and icon
    if (playIcon) {
        playIcon.className = 'fas fa-play';
    }
    const buttonText = toggleButton.childNodes[toggleButton.childNodes.length - 1];
    if (buttonText && buttonText.nodeType === Node.TEXT_NODE) {
        buttonText.textContent = ' Try Live Demo';
    }
    
    // Announce to screen readers
    const projectTitle = toggleButton.closest('.project-card').querySelector('.project-title')?.textContent || 'Project';
    window.AccessibilityManager.announcePolite(`${projectTitle} demo closed`);
    
    // Track demo close event
    PortfolioUtils.trackEvent('demo_closed', { 
        projectId: projectId,
        timestamp: new Date().toISOString()
    });
}

function closeDemoById(projectId) {
    const demoContainer = document.getElementById(`demo-${projectId}`);
    const toggleButton = document.querySelector(`[data-project="${projectId}"].demo-toggle`);
    const playIcon = toggleButton ? toggleButton.querySelector('.fas') : null;
    
    if (demoContainer && toggleButton) {
        hideDemo(projectId, demoContainer, toggleButton, playIcon);
    }
}

function initializeLazyLoading() {
    // Create intersection observer for lazy loading iframes
    const iframeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const iframe = entry.target;
                if (iframe.dataset.src && !iframe.src) {
                    iframe.src = iframe.dataset.src;
                    iframeObserver.unobserve(iframe);
                }
            }
        });
    }, {
        rootMargin: '50px'
    });
    
    // Observe all iframes with data-src attribute
    const lazyIframes = document.querySelectorAll('iframe[data-src]');
    lazyIframes.forEach(iframe => {
        iframeObserver.observe(iframe);
        
        // Add loading styles
        iframe.style.opacity = '0.7';
        iframe.style.transition = 'opacity 0.3s ease';
    });
}

// Installer download functionality
function initializeInstallerDownloads() {
    const downloadButtons = document.querySelectorAll('.download-btn');
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', handleInstallerDownload);
        
        // Add keyboard support
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleInstallerDownload.call(this, e);
            }
        });
        
        // Add hover effects for better UX
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Initialize installation instructions toggles
    initializeInstallationInstructions();
}

function handleInstallerDownload(event) {
    const downloadButton = event.currentTarget;
    const downloadUrl = downloadButton.href;
    const filename = downloadButton.download;
    const platform = getPlatformFromButton(downloadButton);
    const fileSize = downloadButton.querySelector('.file-size')?.textContent || 'Unknown size';
    
    // Announce download start to screen readers
    window.AccessibilityManager.announcePolite(`Starting download of ${filename} for ${platform}, ${fileSize}`);
    
    // Track download event
    PortfolioUtils.trackEvent('installer_download_started', {
        filename: filename,
        platform: platform,
        url: downloadUrl,
        fileSize: fileSize,
        timestamp: new Date().toISOString()
    });
    
    // Show download confirmation
    showDownloadConfirmation(filename, platform, fileSize);
    
    // Add visual feedback
    downloadButton.classList.add('downloading');
    downloadButton.setAttribute('aria-pressed', 'true');
    
    // Remove downloading state after a delay
    setTimeout(() => {
        downloadButton.classList.remove('downloading');
        downloadButton.setAttribute('aria-pressed', 'false');
        window.AccessibilityManager.announcePolite(`Download of ${filename} completed`);
    }, 2000);
    
    // Check if file exists (basic validation)
    validateDownloadFile(downloadUrl, filename);
}

function getPlatformFromButton(button) {
    if (button.classList.contains('windows')) return 'Windows';
    if (button.classList.contains('mac')) return 'macOS';
    if (button.classList.contains('linux')) return 'Linux';
    return 'Unknown';
}

function showDownloadConfirmation(filename, platform, fileSize) {
    const notification = document.createElement('div');
    notification.className = 'download-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">
                <i class="fas fa-download" aria-hidden="true"></i>
            </div>
            <div class="notification-text">
                <div class="notification-title">Download Started</div>
                <div class="notification-details">
                    <strong>${filename}</strong> for ${platform}
                    <br><span class="file-size-info">${fileSize}</span>
                </div>
            </div>
            <button class="notification-close" aria-label="Close notification">&times;</button>
        </div>
        <div class="notification-progress">
            <div class="progress-bar"></div>
        </div>
    `;
    
    // Add notification to page
    document.body.appendChild(notification);
    
    // Animate progress bar
    const progressBar = notification.querySelector('.progress-bar');
    if (progressBar) {
        setTimeout(() => {
            progressBar.style.width = '100%';
        }, 100);
    }
    
    // Add close button functionality
    const closeButton = notification.querySelector('.notification-close');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            notification.remove();
        });
    }
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
    
    // Track notification shown
    PortfolioUtils.trackEvent('download_notification_shown', {
        filename: filename,
        platform: platform
    });
}

function validateDownloadFile(url, filename) {
    // Simple validation to check if file exists
    fetch(url, { method: 'HEAD' })
        .then(response => {
            if (!response.ok) {
                console.warn(`Download file may not exist: ${filename}`);
                PortfolioUtils.showNotification(
                    `Warning: ${filename} may not be available. Please contact the developer.`,
                    'warning'
                );
            }
        })
        .catch(error => {
            console.warn(`Could not validate download file: ${filename}`, error);
        });
}

function initializeInstallationInstructions() {
    const instructionDetails = document.querySelectorAll('.install-instructions details');
    
    instructionDetails.forEach(details => {
        const summary = details.querySelector('summary');
        
        if (summary) {
            // Track when installation instructions are opened
            details.addEventListener('toggle', function() {
                if (this.open) {
                    PortfolioUtils.trackEvent('installation_instructions_opened', {
                        timestamp: new Date().toISOString()
                    });
                }
            });
            
            // Add keyboard support for better accessibility
            summary.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    details.open = !details.open;
                }
            });
        }
    });
    
    // Add copy functionality for command line instructions
    const codeElements = document.querySelectorAll('.install-instructions code');
    codeElements.forEach(code => {
        code.style.cursor = 'pointer';
        code.title = 'Click to copy command';
        
        code.addEventListener('click', function() {
            copyToClipboard(this.textContent);
            PortfolioUtils.showNotification('Command copied to clipboard!', 'success');
            
            PortfolioUtils.trackEvent('command_copied', {
                command: this.textContent,
                timestamp: new Date().toISOString()
            });
        });
    });
}

function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        // Use modern clipboard API
        navigator.clipboard.writeText(text).catch(err => {
            console.error('Failed to copy text: ', err);
            fallbackCopyToClipboard(text);
        });
    } else {
        // Fallback for older browsers
        fallbackCopyToClipboard(text);
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
    } catch (err) {
        console.error('Fallback: Could not copy text: ', err);
    }
    
    document.body.removeChild(textArea);
}

// Utility functions for future use
const PortfolioUtils = {
    // Track events for analytics
    trackEvent: function(eventName, eventData) {
        console.log(`Event: ${eventName}`, eventData);
        
        // Google Analytics 4 integration (when available)
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                custom_parameter: eventData
            });
        }
        
        // Store events in localStorage for development/testing
        try {
            const events = JSON.parse(localStorage.getItem('portfolio_events') || '[]');
            events.push({
                event: eventName,
                data: eventData,
                timestamp: new Date().toISOString()
            });
            
            // Keep only last 100 events
            if (events.length > 100) {
                events.splice(0, events.length - 100);
            }
            
            localStorage.setItem('portfolio_events', JSON.stringify(events));
        } catch (e) {
            console.warn('Could not store event in localStorage:', e);
        }
    },
    
    // Show notifications
    showNotification: function(message, type = 'info') {
        console.log(`${type.toUpperCase()}: ${message}`);
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" aria-label="Close notification">&times;</button>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
        
        // Add close button functionality
        const closeButton = notification.querySelector('.notification-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                notification.remove();
            });
        }
        
        return notification;
    }
};

// Skills visualization functionality
function initializeSkillsVisualization() {
    // Initialize intersection observer for skills animation
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBars(entry.target);
                skillsObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe skills section
    const skillsSection = document.querySelector('.skills-section');
    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }
    
    // Add hover effects to skill items
    initializeSkillHoverEffects();
    
    // Add keyboard navigation for skills
    initializeSkillsKeyboardNavigation();
    
    // Track skills section view
    PortfolioUtils.trackEvent('skills_section_initialized', {
        timestamp: new Date().toISOString()
    });
}

function animateSkillBars(skillsSection) {
    const skillItems = skillsSection.querySelectorAll('.skill-item');
    
    skillItems.forEach((skillItem, index) => {
        const skillLevel = skillItem.querySelector('.skill-level');
        const skillProgress = skillItem.querySelector('.skill-progress');
        const skillName = skillItem.querySelector('.skill-name').textContent;
        
        if (skillLevel && skillProgress) {
            const level = parseInt(skillLevel.dataset.level) || 0;
            
            // Add staggered animation delay
            setTimeout(() => {
                // Animate the progress bar
                skillProgress.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                skillProgress.style.width = `${level}%`;
                
                // Add visual feedback
                skillItem.classList.add('animated');
                
                // Track skill animation
                PortfolioUtils.trackEvent('skill_animated', {
                    skillName: skillName,
                    level: level,
                    timestamp: new Date().toISOString()
                });
                
                // Add completion effect
                setTimeout(() => {
                    skillProgress.classList.add('completed');
                }, 1500);
                
            }, index * 100); // Stagger animations by 100ms
        }
    });
    
    // Track skills animation completion
    setTimeout(() => {
        PortfolioUtils.trackEvent('skills_animation_completed', {
            totalSkills: skillItems.length,
            timestamp: new Date().toISOString()
        });
    }, skillItems.length * 100 + 1500);
}

function initializeSkillHoverEffects() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(skillItem => {
        const skillProgress = skillItem.querySelector('.skill-progress');
        const skillName = skillItem.querySelector('.skill-name').textContent;
        
        // Add hover effects
        skillItem.addEventListener('mouseenter', function() {
            this.classList.add('hovered');
            
            // Add glow effect to progress bar
            if (skillProgress) {
                skillProgress.classList.add('glowing');
            }
            
            // Track hover event
            PortfolioUtils.trackEvent('skill_hovered', {
                skillName: skillName,
                timestamp: new Date().toISOString()
            });
        });
        
        skillItem.addEventListener('mouseleave', function() {
            this.classList.remove('hovered');
            
            // Remove glow effect
            if (skillProgress) {
                skillProgress.classList.remove('glowing');
            }
        });
        
        // Add focus effects for keyboard navigation
        skillItem.addEventListener('focus', function() {
            this.classList.add('focused');
        });
        
        skillItem.addEventListener('blur', function() {
            this.classList.remove('focused');
        });
        
        // Make skill items focusable for accessibility
        skillItem.setAttribute('tabindex', '0');
        skillItem.setAttribute('role', 'button');
        skillItem.setAttribute('aria-label', `${skillName} skill level`);
        
        // Add click handler for mobile interaction
        skillItem.addEventListener('click', function() {
            this.classList.toggle('active');
            
            // Track click event
            PortfolioUtils.trackEvent('skill_clicked', {
                skillName: skillName,
                timestamp: new Date().toISOString()
            });
        });
    });
}

function initializeSkillsKeyboardNavigation() {
    const skillItems = document.querySelectorAll('.skill-item');
    const skillCategories = document.querySelectorAll('.skills-category');
    
    // Add keyboard navigation between skill items
    skillItems.forEach((skillItem, index) => {
        skillItem.addEventListener('keydown', function(e) {
            let targetIndex;
            
            switch(e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    e.preventDefault();
                    targetIndex = (index + 1) % skillItems.length;
                    skillItems[targetIndex].focus();
                    break;
                    
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    targetIndex = (index - 1 + skillItems.length) % skillItems.length;
                    skillItems[targetIndex].focus();
                    break;
                    
                case 'Home':
                    e.preventDefault();
                    skillItems[0].focus();
                    break;
                    
                case 'End':
                    e.preventDefault();
                    skillItems[skillItems.length - 1].focus();
                    break;
                    
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    this.click();
                    break;
            }
        });
    });
    
    // Add category navigation
    skillCategories.forEach((category, categoryIndex) => {
        const categoryTitle = category.querySelector('.skills-category-title');
        
        if (categoryTitle) {
            categoryTitle.setAttribute('tabindex', '0');
            categoryTitle.setAttribute('role', 'button');
            categoryTitle.setAttribute('aria-expanded', 'true');
            
            categoryTitle.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleSkillCategory(category);
                }
            });
            
            categoryTitle.addEventListener('click', function() {
                toggleSkillCategory(category);
            });
        }
    });
}

function toggleSkillCategory(category) {
    const categoryTitle = category.querySelector('.skills-category-title');
    const categoryContent = category.querySelector('.skills-subcategory, .skills-grid');
    const categoryName = categoryTitle ? categoryTitle.textContent.trim() : 'Unknown';
    
    if (category.classList.contains('collapsed')) {
        // Expand category
        category.classList.remove('collapsed');
        if (categoryTitle) {
            categoryTitle.setAttribute('aria-expanded', 'true');
        }
        
        PortfolioUtils.trackEvent('skill_category_expanded', {
            categoryName: categoryName,
            timestamp: new Date().toISOString()
        });
    } else {
        // Collapse category
        category.classList.add('collapsed');
        if (categoryTitle) {
            categoryTitle.setAttribute('aria-expanded', 'false');
        }
        
        PortfolioUtils.trackEvent('skill_category_collapsed', {
            categoryName: categoryName,
            timestamp: new Date().toISOString()
        });
    }
}

// Utility function to get skill level text
function getSkillLevelText(level) {
    if (level >= 90) return 'Expert';
    if (level >= 80) return 'Advanced';
    if (level >= 70) return 'Intermediate';
    if (level >= 60) return 'Beginner';
    return 'Learning';
}

// Function to update skill levels dynamically (for future use)
function updateSkillLevel(skillName, newLevel) {
    const skillItem = document.querySelector(`[data-skill="${skillName}"]`);
    
    if (skillItem) {
        const skillLevel = skillItem.querySelector('.skill-level');
        const skillProgress = skillItem.querySelector('.skill-progress');
        const skillPercentage = skillItem.querySelector('.skill-percentage');
        
        if (skillLevel && skillProgress && skillPercentage) {
            // Update data attribute
            skillLevel.dataset.level = newLevel;
            
            // Update progress bar
            skillProgress.style.width = `${newLevel}%`;
            
            // Update percentage text
            skillPercentage.textContent = getSkillLevelText(newLevel);
            
            // Track skill update
            PortfolioUtils.trackEvent('skill_level_updated', {
                skillName: skillName,
                oldLevel: skillLevel.dataset.level,
                newLevel: newLevel,
                timestamp: new Date().toISOString()
            });
        }
    }
}

// Certifications data structure - easy to update and maintain
const certificationsData = [
    {
        id: "cert-aws-cloud-practitioner",
        name: "AWS Certified Cloud Practitioner",
        issuer: "Amazon Web Services",
        issueDate: "2024-03-15",
        expirationDate: "2027-03-15",
        credentialId: "AWS-CCP-2024-001",
        verificationUrl: "https://aws.amazon.com/verification/AWS-CCP-2024-001",
        badgeImage: "assets/images/badges/aws-cloud-practitioner.svg",
        description: "Foundational understanding of AWS cloud services, architecture, security, and pricing models. Demonstrates knowledge of core AWS services and basic cloud concepts.",
        skills: ["Cloud Computing", "AWS Services", "Cloud Security", "Cost Management"],
        status: "active",
        relevance: "Essential for modern software development and deployment practices"
    },
    {
        id: "cert-google-analytics",
        name: "Google Analytics Individual Qualification",
        issuer: "Google",
        issueDate: "2024-01-20",
        expirationDate: "2025-01-20",
        credentialId: "GA-IQ-2024-789",
        verificationUrl: "https://skillshop.exceedlms.com/student/path/2938-google-analytics-individual-qualification",
        badgeImage: "assets/images/badges/google-analytics.svg",
        description: "Comprehensive understanding of Google Analytics including data collection, configuration, analysis, and reporting capabilities.",
        skills: ["Web Analytics", "Data Analysis", "Digital Marketing", "Reporting"],
        status: "active",
        relevance: "Valuable for understanding user behavior and optimizing web applications"
    },
    {
        id: "cert-microsoft-azure-fundamentals",
        name: "Microsoft Azure Fundamentals",
        issuer: "Microsoft",
        issueDate: "2023-11-10",
        expirationDate: null, // No expiration
        credentialId: "AZ-900-2023-456",
        verificationUrl: "https://learn.microsoft.com/en-us/users/studentname/credentials/AZ-900-2023-456",
        badgeImage: "assets/images/badges/azure-fundamentals.svg",
        description: "Foundational knowledge of cloud services and how those services are provided with Microsoft Azure platform.",
        skills: ["Microsoft Azure", "Cloud Fundamentals", "Cloud Services", "Azure Portal"],
        status: "active",
        relevance: "Demonstrates understanding of cloud computing concepts and Microsoft Azure services"
    },
    {
        id: "cert-comptia-security-plus",
        name: "CompTIA Security+",
        issuer: "CompTIA",
        issueDate: "2023-08-15",
        expirationDate: "2026-08-15",
        credentialId: "COMP001021234567",
        verificationUrl: "https://www.certmetrics.com/comptia/public/verification.aspx",
        badgeImage: "assets/images/badges/comptia-security-plus.svg",
        description: "Industry-standard certification covering essential cybersecurity skills including threat detection, risk management, and security protocols.",
        skills: ["Cybersecurity", "Risk Management", "Network Security", "Incident Response"],
        status: "active",
        relevance: "Critical for understanding security best practices in software development"
    },
    {
        id: "cert-cisco-networking",
        name: "Cisco Certified Network Associate (CCNA)",
        issuer: "Cisco",
        issueDate: "2023-05-20",
        expirationDate: "2026-05-20",
        credentialId: "CSCO13579246",
        verificationUrl: "https://www.cisco.com/c/en/us/training-events/training-certifications/certifications.html",
        badgeImage: "assets/images/badges/cisco-ccna.svg",
        description: "Comprehensive networking certification covering routing, switching, network security, and troubleshooting.",
        skills: ["Network Administration", "Routing & Switching", "Network Security", "Troubleshooting"],
        status: "active",
        relevance: "Essential for understanding network infrastructure and connectivity"
    },
    {
        id: "cert-oracle-java",
        name: "Oracle Certified Associate Java SE 8 Programmer",
        issuer: "Oracle",
        issueDate: "2023-02-10",
        expirationDate: null, // No expiration
        credentialId: "OCA-JAVA-2023-987",
        verificationUrl: "https://education.oracle.com/oracle-certification-path/pFamily_48",
        badgeImage: "assets/images/badges/oracle-java.svg",
        description: "Demonstrates proficiency in Java SE 8 programming including object-oriented programming concepts, Java API, and exception handling.",
        skills: ["Java Programming", "Object-Oriented Programming", "Java API", "Exception Handling"],
        status: "active",
        relevance: "Validates core Java programming skills essential for enterprise development"
    }
];

// Certifications system initialization
function initializeCertifications() {
    console.log('Initializing certifications system...');
    
    // Render certifications
    renderCertifications();
    
    // Initialize filtering functionality
    initializeCertificationFiltering();
    
    // Initialize sorting functionality
    initializeCertificationSorting();
    
    // Track certifications section initialization
    PortfolioUtils.trackEvent('certifications_initialized', {
        totalCertifications: certificationsData.length,
        activeCertifications: certificationsData.filter(cert => cert.status === 'active').length,
        timestamp: new Date().toISOString()
    });
}

// Render certifications dynamically from data
function renderCertifications() {
    const certificationsSection = document.querySelector('#certifications .section-container');
    
    if (!certificationsSection) {
        console.error('Certifications section not found');
        return;
    }
    
    // Create certifications container HTML
    const certificationsHTML = `
        <h2 id="certifications-heading">Certifications & Professional Development</h2>
        
        <div class="certifications-controls">
            <div class="certifications-filters">
                <button class="filter-btn active" data-filter="all" aria-pressed="true">
                    All Certifications <span class="count">(${certificationsData.length})</span>
                </button>
                <button class="filter-btn" data-filter="active" aria-pressed="false">
                    Active <span class="count">(${certificationsData.filter(cert => cert.status === 'active').length})</span>
                </button>
                <button class="filter-btn" data-filter="cloud" aria-pressed="false">
                    Cloud <span class="count">(${certificationsData.filter(cert => cert.skills.some(skill => skill.toLowerCase().includes('cloud') || skill.toLowerCase().includes('aws') || skill.toLowerCase().includes('azure'))).length})</span>
                </button>
                <button class="filter-btn" data-filter="security" aria-pressed="false">
                    Security <span class="count">(${certificationsData.filter(cert => cert.skills.some(skill => skill.toLowerCase().includes('security') || skill.toLowerCase().includes('cybersecurity'))).length})</span>
                </button>
            </div>
            
            <div class="certifications-sort">
                <label for="cert-sort-select" class="sort-label">Sort by:</label>
                <select id="cert-sort-select" class="sort-select" aria-label="Sort certifications">
                    <option value="date-desc">Newest First</option>
                    <option value="date-asc">Oldest First</option>
                    <option value="name-asc">Name A-Z</option>
                    <option value="name-desc">Name Z-A</option>
                    <option value="issuer-asc">Issuer A-Z</option>
                </select>
            </div>
        </div>
        
        <div class="certifications-grid" role="region" aria-label="Certifications list">
            ${generateCertificationCards(certificationsData)}
        </div>
        
        <div class="certifications-summary">
            <p class="summary-text">
                <strong>${certificationsData.filter(cert => cert.status === 'active').length}</strong> active certifications 
                demonstrating commitment to continuous learning and professional development.
            </p>
        </div>
    `;
    
    certificationsSection.innerHTML = certificationsHTML;
}

// Generate certification cards HTML
function generateCertificationCards(certifications) {
    return certifications.map(cert => {
        const issueDate = new Date(cert.issueDate);
        const expirationDate = cert.expirationDate ? new Date(cert.expirationDate) : null;
        const isExpired = expirationDate && expirationDate < new Date();
        const status = isExpired ? 'expired' : cert.status;
        
        return `
            <article class="certification-card ${status}" data-cert-id="${cert.id}" data-status="${status}" data-skills="${cert.skills.join(',').toLowerCase()}">
                <div class="cert-badge">
                    <img src="${cert.badgeImage}" 
                         alt="${cert.name} certification badge" 
                         loading="lazy"
                         onerror="this.src='assets/images/badges/default-badge.svg'; this.alt='Certification badge';">
                </div>
                
                <div class="cert-content">
                    <div class="cert-header">
                        <h3 class="cert-name">${cert.name}</h3>
                        <div class="cert-status-indicator ${status}" aria-label="Status: ${status}">
                            ${getStatusIcon(status)} ${status.charAt(0).toUpperCase() + status.slice(1)}
                        </div>
                    </div>
                    
                    <p class="cert-issuer">
                        <i class="fas fa-building" aria-hidden="true"></i>
                        ${cert.issuer}
                    </p>
                    
                    <div class="cert-dates">
                        <div class="cert-date">
                            <i class="fas fa-calendar-check" aria-hidden="true"></i>
                            <span class="date-label">Issued:</span>
                            <time datetime="${cert.issueDate}">${formatDate(issueDate)}</time>
                        </div>
                        ${expirationDate ? `
                            <div class="cert-date ${isExpired ? 'expired' : ''}">
                                <i class="fas fa-calendar-times" aria-hidden="true"></i>
                                <span class="date-label">${isExpired ? 'Expired:' : 'Expires:'}</span>
                                <time datetime="${cert.expirationDate}">${formatDate(expirationDate)}</time>
                            </div>
                        ` : `
                            <div class="cert-date no-expiration">
                                <i class="fas fa-infinity" aria-hidden="true"></i>
                                <span class="date-label">No Expiration</span>
                            </div>
                        `}
                    </div>
                    
                    <p class="cert-description">${cert.description}</p>
                    
                    <div class="cert-skills">
                        <h4 class="skills-title">Skills Demonstrated:</h4>
                        <div class="skills-tags">
                            ${cert.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div class="cert-relevance">
                        <p class="relevance-text">
                            <i class="fas fa-lightbulb" aria-hidden="true"></i>
                            ${cert.relevance}
                        </p>
                    </div>
                    
                    <div class="cert-actions">
                        ${cert.verificationUrl ? `
                            <a href="${cert.verificationUrl}" 
                               class="cert-verify-btn" 
                               target="_blank" 
                               rel="noopener"
                               aria-label="Verify ${cert.name} certification">
                                <i class="fas fa-external-link-alt" aria-hidden="true"></i>
                                Verify Credential
                            </a>
                        ` : ''}
                        
                        <button class="cert-details-btn" 
                                data-cert-id="${cert.id}"
                                aria-expanded="false"
                                aria-controls="cert-details-${cert.id}">
                            <i class="fas fa-info-circle" aria-hidden="true"></i>
                            View Details
                        </button>
                    </div>
                    
                    <div class="cert-credential-id">
                        <small>
                            <strong>Credential ID:</strong> 
                            <code class="credential-code" title="Click to copy">${cert.credentialId}</code>
                        </small>
                    </div>
                </div>
                
                <div class="cert-details-panel" id="cert-details-${cert.id}" style="display: none;" aria-hidden="true">
                    <div class="details-content">
                        <h4>Certification Details</h4>
                        <div class="details-grid">
                            <div class="detail-item">
                                <strong>Full Name:</strong>
                                <span>${cert.name}</span>
                            </div>
                            <div class="detail-item">
                                <strong>Issuing Organization:</strong>
                                <span>${cert.issuer}</span>
                            </div>
                            <div class="detail-item">
                                <strong>Issue Date:</strong>
                                <span>${formatDate(issueDate)}</span>
                            </div>
                            ${expirationDate ? `
                                <div class="detail-item">
                                    <strong>Expiration Date:</strong>
                                    <span>${formatDate(expirationDate)}</span>
                                </div>
                            ` : `
                                <div class="detail-item">
                                    <strong>Validity:</strong>
                                    <span>No Expiration Date</span>
                                </div>
                            `}
                            <div class="detail-item">
                                <strong>Credential ID:</strong>
                                <span><code>${cert.credentialId}</code></span>
                            </div>
                        </div>
                        
                        <div class="skills-breakdown">
                            <strong>Skills & Competencies:</strong>
                            <ul class="skills-list">
                                ${cert.skills.map(skill => `<li>${skill}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div class="relevance-breakdown">
                            <strong>Professional Relevance:</strong>
                            <p>${cert.relevance}</p>
                        </div>
                    </div>
                </div>
            </article>
        `;
    }).join('');
}

// Helper function to get status icon
function getStatusIcon(status) {
    switch(status) {
        case 'active':
            return '<i class="fas fa-check-circle" aria-hidden="true"></i>';
        case 'expired':
            return '<i class="fas fa-times-circle" aria-hidden="true"></i>';
        case 'in-progress':
            return '<i class="fas fa-clock" aria-hidden="true"></i>';
        default:
            return '<i class="fas fa-question-circle" aria-hidden="true"></i>';
    }
}

// Helper function to format dates
function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Initialize certification filtering
function initializeCertificationFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const certificationCards = document.querySelectorAll('.certification-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active filter button
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');
            
            // Filter certifications
            filterCertifications(filter);
            
            // Track filter usage
            PortfolioUtils.trackEvent('certifications_filtered', {
                filter: filter,
                timestamp: new Date().toISOString()
            });
        });
        
        // Add keyboard support
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Initialize certification details buttons
    initializeCertificationDetails();
    
    // Initialize credential ID copy functionality
    initializeCredentialCopy();
}

// Filter certifications based on selected filter
function filterCertifications(filter) {
    const certificationCards = document.querySelectorAll('.certification-card');
    let visibleCount = 0;
    
    certificationCards.forEach(card => {
        let shouldShow = false;
        
        switch(filter) {
            case 'all':
                shouldShow = true;
                break;
            case 'active':
                shouldShow = card.dataset.status === 'active';
                break;
            case 'cloud':
                shouldShow = card.dataset.skills.includes('cloud') || 
                           card.dataset.skills.includes('aws') || 
                           card.dataset.skills.includes('azure');
                break;
            case 'security':
                shouldShow = card.dataset.skills.includes('security') || 
                           card.dataset.skills.includes('cybersecurity');
                break;
        }
        
        if (shouldShow) {
            card.style.display = 'block';
            card.setAttribute('aria-hidden', 'false');
            visibleCount++;
        } else {
            card.style.display = 'none';
            card.setAttribute('aria-hidden', 'true');
        }
    });
    
    // Update results summary
    updateFilterResults(filter, visibleCount);
}

// Update filter results summary
function updateFilterResults(filter, count) {
    const summaryText = document.querySelector('.certifications-summary .summary-text');
    if (summaryText) {
        let filterText = '';
        switch(filter) {
            case 'all':
                filterText = 'total';
                break;
            case 'active':
                filterText = 'active';
                break;
            case 'cloud':
                filterText = 'cloud-related';
                break;
            case 'security':
                filterText = 'security-focused';
                break;
        }
        
        summaryText.innerHTML = `
            <strong>${count}</strong> ${filterText} certification${count !== 1 ? 's' : ''} 
            ${filter === 'all' ? 'demonstrating commitment to continuous learning and professional development.' : 'currently displayed.'}
        `;
    }
}

// Initialize certification sorting
function initializeCertificationSorting() {
    const sortSelect = document.querySelector('#cert-sort-select');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortBy = this.value;
            sortCertifications(sortBy);
            
            // Track sort usage
            PortfolioUtils.trackEvent('certifications_sorted', {
                sortBy: sortBy,
                timestamp: new Date().toISOString()
            });
        });
    }
}

// Sort certifications
function sortCertifications(sortBy) {
    const certificationsGrid = document.querySelector('.certifications-grid');
    const cards = Array.from(certificationsGrid.querySelectorAll('.certification-card'));
    
    cards.sort((a, b) => {
        const certA = certificationsData.find(cert => cert.id === a.dataset.certId);
        const certB = certificationsData.find(cert => cert.id === b.dataset.certId);
        
        switch(sortBy) {
            case 'date-desc':
                return new Date(certB.issueDate) - new Date(certA.issueDate);
            case 'date-asc':
                return new Date(certA.issueDate) - new Date(certB.issueDate);
            case 'name-asc':
                return certA.name.localeCompare(certB.name);
            case 'name-desc':
                return certB.name.localeCompare(certA.name);
            case 'issuer-asc':
                return certA.issuer.localeCompare(certB.issuer);
            default:
                return 0;
        }
    });
    
    // Re-append sorted cards
    cards.forEach(card => certificationsGrid.appendChild(card));
}

// Initialize certification details functionality
function initializeCertificationDetails() {
    const detailsButtons = document.querySelectorAll('.cert-details-btn');
    
    detailsButtons.forEach(button => {
        button.addEventListener('click', function() {
            const certId = this.dataset.certId;
            const detailsPanel = document.getElementById(`cert-details-${certId}`);
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            if (detailsPanel) {
                if (isExpanded) {
                    // Hide details
                    detailsPanel.style.display = 'none';
                    detailsPanel.setAttribute('aria-hidden', 'true');
                    this.setAttribute('aria-expanded', 'false');
                    this.innerHTML = '<i class="fas fa-info-circle" aria-hidden="true"></i> View Details';
                } else {
                    // Show details
                    detailsPanel.style.display = 'block';
                    detailsPanel.setAttribute('aria-hidden', 'false');
                    this.setAttribute('aria-expanded', 'true');
                    this.innerHTML = '<i class="fas fa-times" aria-hidden="true"></i> Hide Details';
                    
                    // Scroll to details if needed
                    setTimeout(() => {
                        const rect = detailsPanel.getBoundingClientRect();
                        if (rect.bottom > window.innerHeight) {
                            detailsPanel.scrollIntoView({ 
                                behavior: 'smooth', 
                                block: 'nearest' 
                            });
                        }
                    }, 100);
                }
                
                // Track details toggle
                PortfolioUtils.trackEvent('certification_details_toggled', {
                    certId: certId,
                    action: isExpanded ? 'hide' : 'show',
                    timestamp: new Date().toISOString()
                });
            }
        });
        
        // Add keyboard support
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// Initialize credential ID copy functionality
function initializeCredentialCopy() {
    const credentialCodes = document.querySelectorAll('.credential-code');
    
    credentialCodes.forEach(code => {
        code.style.cursor = 'pointer';
        code.addEventListener('click', function() {
            const credentialId = this.textContent;
            copyToClipboard(credentialId);
            
            // Show feedback
            const originalText = this.textContent;
            this.textContent = 'Copied!';
            this.style.color = '#28a745';
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.color = '';
            }, 2000);
            
            // Track credential copy
            PortfolioUtils.trackEvent('credential_id_copied', {
                credentialId: credentialId,
                timestamp: new Date().toISOString()
            });
        });
        
        // Add keyboard support
        code.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// Function to easily add new certifications (for future use)
function addNewCertification(certificationData) {
    // Validate required fields
    const requiredFields = ['id', 'name', 'issuer', 'issueDate', 'description', 'skills', 'status'];
    const missingFields = requiredFields.filter(field => !certificationData[field]);
    
    if (missingFields.length > 0) {
        console.error('Missing required fields:', missingFields);
        return false;
    }
    
    // Add to data array
    certificationsData.push(certificationData);
    
    // Re-render certifications
    renderCertifications();
    initializeCertificationFiltering();
    
    // Track new certification added
    PortfolioUtils.trackEvent('certification_added', {
        certId: certificationData.id,
        certName: certificationData.name,
        timestamp: new Date().toISOString()
    });
    
    console.log('New certification added successfully:', certificationData.name);
    return true;
}

// Function to update existing certification (for future use)
function updateCertification(certId, updates) {
    const certIndex = certificationsData.findIndex(cert => cert.id === certId);
    
    if (certIndex === -1) {
        console.error('Certification not found:', certId);
        return false;
    }
    
    // Update certification data
    certificationsData[certIndex] = { ...certificationsData[certIndex], ...updates };
    
    // Re-render certifications
    renderCertifications();
    initializeCertificationFiltering();
    
    // Track certification update
    PortfolioUtils.trackEvent('certification_updated', {
        certId: certId,
        updates: Object.keys(updates),
        timestamp: new Date().toISOString()
    });
    
    console.log('Certification updated successfully:', certId);
    return true;
}



// Certifications system initialization
function initializeCertifications() {
    console.log('Initializing certifications system...');
    
    // Render certifications from data
    renderCertifications();
    
    // Initialize certification interactions
    initializeCertificationInteractions();
    
    // Initialize filtering functionality (for task 6.2)
    initializeCertificationFiltering();
    
    // Track certifications initialization
    PortfolioUtils.trackEvent('certifications_initialized', {
        totalCertifications: certificationsData.length,
        activeCertifications: certificationsData.filter(cert => cert.status === 'active').length,
        inProgressCertifications: certificationsData.filter(cert => cert.status === 'in-progress').length,
        timestamp: new Date().toISOString()
    });
}

// Render certifications dynamically from data structure
function renderCertifications() {
    const certificationsSection = document.querySelector('#certifications .section-container');
    
    if (!certificationsSection) {
        console.error('Certifications section not found');
        return;
    }
    
    // Create certifications container HTML
    const certificationsHTML = `
        <h2 id="certifications-heading">Certifications & Professional Development</h2>
        <div class="certifications-intro">
            <p>My commitment to continuous learning and professional development through industry-recognized certifications and ongoing education.</p>
        </div>
        
        <div class="certifications-controls">
            <div class="certifications-filters" role="group" aria-label="Filter certifications">
                <button class="filter-btn active" data-filter="all" aria-pressed="true">
                    All Certifications
                    <span class="filter-count">(${certificationsData.length})</span>
                </button>
                <button class="filter-btn" data-filter="active" aria-pressed="false">
                    Active
                    <span class="filter-count">(${certificationsData.filter(cert => cert.status === 'active').length})</span>
                </button>
                <button class="filter-btn" data-filter="in-progress" aria-pressed="false">
                    In Progress
                    <span class="filter-count">(${certificationsData.filter(cert => cert.status === 'in-progress').length})</span>
                </button>
                <button class="filter-btn" data-filter="expired" aria-pressed="false">
                    Expired
                    <span class="filter-count">(${certificationsData.filter(cert => cert.expirationDate && new Date(cert.expirationDate) < new Date()).length})</span>
                </button>
            </div>
            
            <div class="certifications-sort" role="group" aria-label="Sort certifications">
                <label for="sort-select" class="sort-label">Sort by:</label>
                <select id="sort-select" class="sort-select" aria-label="Sort certifications by">
                    <option value="name">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                    <option value="date-newest">Newest First</option>
                    <option value="date-oldest">Oldest First</option>
                    <option value="issuer">Issuer (A-Z)</option>
                    <option value="status">Status</option>
                </select>
            </div>
        </div>
        
        <div class="certifications-grid" role="list" aria-label="Certifications list">
            ${generateCertificationCards()}
        </div>
        
        <div class="certifications-footer">
            <p class="certifications-note">
                <i class="fas fa-info-circle" aria-hidden="true"></i>
                All certifications can be verified through the provided verification links. 
                I am committed to maintaining current certifications and pursuing additional relevant credentials.
            </p>
        </div>
    `;
    
    certificationsSection.innerHTML = certificationsHTML;
    
    console.log(`Rendered ${certificationsData.length} certifications`);
}

// Generate HTML for certification cards
function generateCertificationCards() {
    return certificationsData.map(cert => {
        const issueDate = cert.issueDate ? formatDate(cert.issueDate) : null;
        const expirationDate = cert.expirationDate ? formatDate(cert.expirationDate) : null;
        const isExpired = cert.expirationDate && new Date(cert.expirationDate) < new Date();
        const actualStatus = isExpired ? 'expired' : cert.status;
        
        return `
            <article class="certification-card ${actualStatus}" 
                     data-status="${actualStatus}" 
                     data-cert-id="${cert.id}"
                     role="listitem"
                     aria-labelledby="cert-title-${cert.id}">
                
                <div class="cert-badge">
                    <img src="${cert.badgeImage}" 
                         alt="${cert.name} certification badge" 
                         loading="lazy"
                         onerror="this.src='assets/images/badges/default-badge.png'; this.alt='Certification badge';">
                </div>
                
                <div class="cert-content">
                    <div class="cert-header">
                        <h3 id="cert-title-${cert.id}" class="cert-name">${cert.name}</h3>
                        <div class="cert-status-badge ${actualStatus}" aria-label="Status: ${actualStatus}">
                            ${getStatusIcon(actualStatus)} ${getStatusText(actualStatus)}
                        </div>
                    </div>
                    
                    <p class="cert-issuer">
                        <i class="fas fa-building" aria-hidden="true"></i>
                        ${cert.issuer}
                    </p>
                    
                    <div class="cert-dates">
                        ${issueDate ? `
                            <span class="cert-issued">
                                <i class="fas fa-calendar-check" aria-hidden="true"></i>
                                <strong>Issued:</strong> ${issueDate}
                            </span>
                        ` : ''}
                        
                        ${expirationDate ? `
                            <span class="cert-expires ${isExpired ? 'expired' : ''}">
                                <i class="fas fa-calendar-times" aria-hidden="true"></i>
                                <strong>Expires:</strong> ${expirationDate}
                            </span>
                        ` : `
                            <span class="cert-no-expiry">
                                <i class="fas fa-infinity" aria-hidden="true"></i>
                                <strong>No Expiration</strong>
                            </span>
                        `}
                    </div>
                    
                    <p class="cert-description">${cert.description}</p>
                    
                    <div class="cert-skills">
                        <strong>Key Skills:</strong>
                        <div class="skills-tags">
                            ${cert.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div class="cert-relevance">
                        <strong>Career Relevance:</strong>
                        <p>${cert.relevance}</p>
                    </div>
                    
                    <div class="cert-actions">
                        ${cert.verificationUrl ? `
                            <a href="${cert.verificationUrl}" 
                               class="cert-verify" 
                               target="_blank" 
                               rel="noopener"
                               aria-label="Verify ${cert.name} credential">
                                <i class="fas fa-external-link-alt" aria-hidden="true"></i>
                                Verify Credential
                            </a>
                        ` : ''}
                        
                        ${cert.credentialId ? `
                            <span class="cert-credential-id" title="Credential ID">
                                <i class="fas fa-id-card" aria-hidden="true"></i>
                                ID: ${cert.credentialId}
                            </span>
                        ` : ''}
                    </div>
                </div>
            </article>
        `;
    }).join('');
}

// Helper functions for certification rendering
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function getStatusIcon(status) {
    const icons = {
        'active': '<i class="fas fa-check-circle" aria-hidden="true"></i>',
        'expired': '<i class="fas fa-times-circle" aria-hidden="true"></i>',
        'in-progress': '<i class="fas fa-clock" aria-hidden="true"></i>'
    };
    return icons[status] || '<i class="fas fa-question-circle" aria-hidden="true"></i>';
}

function getStatusText(status) {
    const texts = {
        'active': 'Active',
        'expired': 'Expired',
        'in-progress': 'In Progress'
    };
    return texts[status] || 'Unknown';
}

// Initialize certification interactions
function initializeCertificationInteractions() {
    // Add click tracking for verification links
    document.addEventListener('click', function(e) {
        if (e.target.matches('.cert-verify') || e.target.closest('.cert-verify')) {
            const link = e.target.matches('.cert-verify') ? e.target : e.target.closest('.cert-verify');
            const certCard = link.closest('.certification-card');
            const certId = certCard ? certCard.dataset.certId : 'unknown';
            
            PortfolioUtils.trackEvent('certification_verification_clicked', {
                certificationId: certId,
                verificationUrl: link.href,
                timestamp: new Date().toISOString()
            });
        }
    });
    
    // Add hover effects for certification cards
    const certCards = document.querySelectorAll('.certification-card');
    certCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('hovered');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('hovered');
        });
        
        // Add keyboard navigation support
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                const verifyLink = this.querySelector('.cert-verify');
                if (verifyLink) {
                    e.preventDefault();
                    verifyLink.click();
                }
            }
        });
    });
    
    // Add credential ID copy functionality
    const credentialIds = document.querySelectorAll('.cert-credential-id');
    credentialIds.forEach(credId => {
        credId.style.cursor = 'pointer';
        credId.title = 'Click to copy credential ID';
        
        credId.addEventListener('click', function() {
            const idText = this.textContent.replace('ID: ', '');
            copyToClipboard(idText);
            PortfolioUtils.showNotification('Credential ID copied to clipboard!', 'success');
            
            PortfolioUtils.trackEvent('credential_id_copied', {
                credentialId: idText,
                timestamp: new Date().toISOString()
            });
        });
    });
}

// Initialize certification filtering and sorting
function initializeCertificationFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortSelect = document.querySelector('#sort-select');
    
    // Initialize filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active filter button
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');
            
            // Apply filter and current sort
            const currentSort = sortSelect ? sortSelect.value : 'name';
            filterAndSortCertifications(filter, currentSort);
            
            // Track filter usage
            PortfolioUtils.trackEvent('certifications_filtered', {
                filter: filter,
                timestamp: new Date().toISOString()
            });
        });
        
        // Add keyboard support
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Initialize sort functionality
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortBy = this.value;
            const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
            
            // Apply current filter and new sort
            filterAndSortCertifications(activeFilter, sortBy);
            
            // Track sort usage
            PortfolioUtils.trackEvent('certifications_sorted', {
                sortBy: sortBy,
                timestamp: new Date().toISOString()
            });
        });
    }
    
    // Initialize search functionality
    initializeCertificationSearch();
}

// Enhanced filter and sort certifications
function filterAndSortCertifications(filter, sortBy) {
    const certGrid = document.querySelector('.certifications-grid');
    if (!certGrid) return;
    
    // Get filtered data
    let filteredData = getFilteredCertifications(filter);
    
    // Sort the filtered data
    filteredData = sortCertifications(filteredData, sortBy);
    
    // Re-render the grid with filtered and sorted data
    certGrid.innerHTML = generateCertificationCardsFromData(filteredData);
    
    // Re-initialize interactions for new cards
    initializeCertificationInteractions();
    
    // Update visible count
    updateFilterCounts();
    
    // Show/hide empty state
    showEmptyStateIfNeeded(filteredData.length);
    
    console.log(`Showing ${filteredData.length} certifications (filter: ${filter}, sort: ${sortBy})`);
}

// Get filtered certifications data
function getFilteredCertifications(filter) {
    if (filter === 'all') {
        return [...certificationsData];
    }
    
    return certificationsData.filter(cert => {
        const isExpired = cert.expirationDate && new Date(cert.expirationDate) < new Date();
        const actualStatus = isExpired ? 'expired' : cert.status;
        return actualStatus === filter;
    });
}

// Sort certifications data
function sortCertifications(data, sortBy) {
    const sortedData = [...data];
    
    switch (sortBy) {
        case 'name':
            return sortedData.sort((a, b) => a.name.localeCompare(b.name));
            
        case 'name-desc':
            return sortedData.sort((a, b) => b.name.localeCompare(a.name));
            
        case 'date-newest':
            return sortedData.sort((a, b) => {
                const dateA = a.issueDate ? new Date(a.issueDate) : new Date(0);
                const dateB = b.issueDate ? new Date(b.issueDate) : new Date(0);
                return dateB - dateA;
            });
            
        case 'date-oldest':
            return sortedData.sort((a, b) => {
                const dateA = a.issueDate ? new Date(a.issueDate) : new Date(0);
                const dateB = b.issueDate ? new Date(b.issueDate) : new Date(0);
                return dateA - dateB;
            });
            
        case 'issuer':
            return sortedData.sort((a, b) => a.issuer.localeCompare(b.issuer));
            
        case 'status':
            const statusOrder = { 'active': 1, 'in-progress': 2, 'expired': 3 };
            return sortedData.sort((a, b) => {
                const statusA = a.expirationDate && new Date(a.expirationDate) < new Date() ? 'expired' : a.status;
                const statusB = b.expirationDate && new Date(b.expirationDate) < new Date() ? 'expired' : b.status;
                return statusOrder[statusA] - statusOrder[statusB];
            });
            
        default:
            return sortedData;
    }
}

// Generate certification cards from specific data array
function generateCertificationCardsFromData(data) {
    return data.map(cert => {
        const issueDate = cert.issueDate ? formatDate(cert.issueDate) : null;
        const expirationDate = cert.expirationDate ? formatDate(cert.expirationDate) : null;
        const isExpired = cert.expirationDate && new Date(cert.expirationDate) < new Date();
        const actualStatus = isExpired ? 'expired' : cert.status;
        
        return `
            <article class="certification-card ${actualStatus}" 
                     data-status="${actualStatus}" 
                     data-cert-id="${cert.id}"
                     role="listitem"
                     aria-labelledby="cert-title-${cert.id}">
                
                <div class="cert-badge">
                    <img src="${cert.badgeImage}" 
                         alt="${cert.name} certification badge" 
                         loading="lazy"
                         onerror="this.src='assets/images/badges/default-badge.png'; this.alt='Certification badge';">
                </div>
                
                <div class="cert-content">
                    <div class="cert-header">
                        <h3 id="cert-title-${cert.id}" class="cert-name">${cert.name}</h3>
                        <div class="cert-status-badge ${actualStatus}" aria-label="Status: ${actualStatus}">
                            ${getStatusIcon(actualStatus)} ${getStatusText(actualStatus)}
                        </div>
                    </div>
                    
                    <p class="cert-issuer">
                        <i class="fas fa-building" aria-hidden="true"></i>
                        ${cert.issuer}
                    </p>
                    
                    <div class="cert-dates">
                        ${issueDate ? `
                            <span class="cert-issued">
                                <i class="fas fa-calendar-check" aria-hidden="true"></i>
                                <strong>Issued:</strong> ${issueDate}
                            </span>
                        ` : ''}
                        
                        ${expirationDate ? `
                            <span class="cert-expires ${isExpired ? 'expired' : ''}">
                                <i class="fas fa-calendar-times" aria-hidden="true"></i>
                                <strong>Expires:</strong> ${expirationDate}
                            </span>
                        ` : `
                            <span class="cert-no-expiry">
                                <i class="fas fa-infinity" aria-hidden="true"></i>
                                <strong>No Expiration</strong>
                            </span>
                        `}
                    </div>
                    
                    <p class="cert-description">${cert.description}</p>
                    
                    <div class="cert-skills">
                        <strong>Key Skills:</strong>
                        <div class="skills-tags">
                            ${cert.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div class="cert-relevance">
                        <strong>Career Relevance:</strong>
                        <p>${cert.relevance}</p>
                    </div>
                    
                    <div class="cert-actions">
                        ${cert.verificationUrl ? `
                            <a href="${cert.verificationUrl}" 
                               class="cert-verify" 
                               target="_blank" 
                               rel="noopener"
                               aria-label="Verify ${cert.name} credential">
                                <i class="fas fa-external-link-alt" aria-hidden="true"></i>
                                Verify Credential
                            </a>
                        ` : ''}
                        
                        ${cert.credentialId ? `
                            <span class="cert-credential-id" title="Credential ID">
                                <i class="fas fa-id-card" aria-hidden="true"></i>
                                ID: ${cert.credentialId}
                            </span>
                        ` : ''}
                    </div>
                </div>
            </article>
        `;
    }).join('');
}

// Update filter button counts
function updateFilterCounts() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        const filter = button.dataset.filter;
        let count = 0;
        
        switch (filter) {
            case 'all':
                count = certificationsData.length;
                break;
            case 'active':
                count = certificationsData.filter(cert => {
                    const isExpired = cert.expirationDate && new Date(cert.expirationDate) < new Date();
                    return !isExpired && cert.status === 'active';
                }).length;
                break;
            case 'in-progress':
                count = certificationsData.filter(cert => cert.status === 'in-progress').length;
                break;
            case 'expired':
                count = certificationsData.filter(cert => 
                    cert.expirationDate && new Date(cert.expirationDate) < new Date()
                ).length;
                break;
        }
        
        const countSpan = button.querySelector('.filter-count');
        if (countSpan) {
            countSpan.textContent = `(${count})`;
        }
    });
}

// Show empty state when no certifications match filter
function showEmptyStateIfNeeded(count) {
    const certGrid = document.querySelector('.certifications-grid');
    const existingEmptyState = document.querySelector('.certifications-empty-state');
    
    if (count === 0) {
        if (!existingEmptyState) {
            const emptyState = document.createElement('div');
            emptyState.className = 'certifications-empty-state';
            emptyState.innerHTML = `
                <div class="empty-state-content">
                    <i class="fas fa-search" aria-hidden="true"></i>
                    <h3>No certifications found</h3>
                    <p>Try adjusting your filter or sort options to see more results.</p>
                </div>
            `;
            certGrid.parentNode.insertBefore(emptyState, certGrid.nextSibling);
        }
        certGrid.style.display = 'none';
    } else {
        if (existingEmptyState) {
            existingEmptyState.remove();
        }
        certGrid.style.display = 'grid';
    }
}

// Utility function to add new certifications easily (for future use)
function addCertification(certificationData) {
    // Validate required fields
    const requiredFields = ['id', 'name', 'issuer', 'description', 'skills', 'status', 'relevance'];
    const missingFields = requiredFields.filter(field => !certificationData[field]);
    
    if (missingFields.length > 0) {
        console.error('Missing required fields for certification:', missingFields);
        return false;
    }
    
    // Check for duplicate ID
    if (certificationsData.find(cert => cert.id === certificationData.id)) {
        console.error('Certification with this ID already exists:', certificationData.id);
        return false;
    }
    
    // Add to data array
    certificationsData.push(certificationData);
    
    // Re-render certifications
    renderCertifications();
    initializeCertificationInteractions();
    initializeCertificationFiltering();
    
    console.log('Added new certification:', certificationData.name);
    
    // Track addition
    PortfolioUtils.trackEvent('certification_added', {
        certificationId: certificationData.id,
        certificationName: certificationData.name,
        timestamp: new Date().toISOString()
    });
    
    return true;
}

// Utility function to update existing certification
function updateCertification(certId, updates) {
    const certIndex = certificationsData.findIndex(cert => cert.id === certId);
    
    if (certIndex === -1) {
        console.error('Certification not found:', certId);
        return false;
    }
    
    // Update certification data
    certificationsData[certIndex] = { ...certificationsData[certIndex], ...updates };
    
    // Re-render certifications
    renderCertifications();
    initializeCertificationInteractions();
    initializeCertificationFiltering();
    
    console.log('Updated certification:', certId);
    
    // Track update
    PortfolioUtils.trackEvent('certification_updated', {
        certificationId: certId,
        updates: Object.keys(updates),
        timestamp: new Date().toISOString()
    });
    
    return true;
}

// Initialize certification search functionality
function initializeCertificationSearch() {
    // Add search input to the controls if it doesn't exist
    const controlsContainer = document.querySelector('.certifications-controls');
    if (controlsContainer && !document.querySelector('.certifications-search')) {
        const searchHTML = `
            <div class="certifications-search">
                <label for="cert-search" class="search-label">Search:</label>
                <div class="search-input-container">
                    <input type="text" 
                           id="cert-search" 
                           class="search-input" 
                           placeholder="Search certifications..."
                           aria-label="Search certifications by name, issuer, or skills">
                    <i class="fas fa-search search-icon" aria-hidden="true"></i>
                    <button class="search-clear" 
                            aria-label="Clear search" 
                            style="display: none;">
                        <i class="fas fa-times" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
        `;
        
        controlsContainer.insertAdjacentHTML('beforeend', searchHTML);
    }
    
    const searchInput = document.querySelector('#cert-search');
    const searchClear = document.querySelector('.search-clear');
    
    if (searchInput) {
        let searchTimeout;
        
        // Handle search input
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.trim();
            
            // Show/hide clear button
            if (searchClear) {
                searchClear.style.display = searchTerm ? 'flex' : 'none';
            }
            
            // Debounce search
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                performSearch(searchTerm);
            }, 300);
        });
        
        // Handle search clear
        if (searchClear) {
            searchClear.addEventListener('click', function() {
                searchInput.value = '';
                this.style.display = 'none';
                performSearch('');
                searchInput.focus();
            });
        }
        
        // Handle Enter key
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(this.value.trim());
            }
        });
    }
}

// Perform certification search
function performSearch(searchTerm) {
    const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
    const sortSelect = document.querySelector('#sort-select');
    const currentSort = sortSelect ? sortSelect.value : 'name';
    
    // Get filtered data first
    let filteredData = getFilteredCertifications(activeFilter);
    
    // Apply search if there's a search term
    if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filteredData = filteredData.filter(cert => {
            return cert.name.toLowerCase().includes(searchLower) ||
                   cert.issuer.toLowerCase().includes(searchLower) ||
                   cert.description.toLowerCase().includes(searchLower) ||
                   cert.skills.some(skill => skill.toLowerCase().includes(searchLower));
        });
    }
    
    // Sort the results
    filteredData = sortCertifications(filteredData, currentSort);
    
    // Re-render
    const certGrid = document.querySelector('.certifications-grid');
    if (certGrid) {
        certGrid.innerHTML = generateCertificationCardsFromData(filteredData);
        initializeCertificationInteractions();
    }
    
    // Show empty state if needed
    showEmptyStateIfNeeded(filteredData.length);
    
    // Track search
    if (searchTerm) {
        PortfolioUtils.trackEvent('certifications_searched', {
            searchTerm: searchTerm,
            resultsCount: filteredData.length,
            timestamp: new Date().toISOString()
        });
    }
    
    console.log(`Search results: ${filteredData.length} certifications for "${searchTerm}"`);
}

// Enhanced utility function to add new certifications with automatic re-rendering
function addCertificationDynamic(certificationData) {
    const success = addCertification(certificationData);
    
    if (success) {
        // Re-apply current filter and sort
        const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
        const sortSelect = document.querySelector('#sort-select');
        const currentSort = sortSelect ? sortSelect.value : 'name';
        const searchInput = document.querySelector('#cert-search');
        const searchTerm = searchInput ? searchInput.value.trim() : '';
        
        // If there's a search term, perform search, otherwise filter and sort
        if (searchTerm) {
            performSearch(searchTerm);
        } else {
            filterAndSortCertifications(activeFilter, currentSort);
        }
        
        // Show success notification
        PortfolioUtils.showNotification(
            `Successfully added certification: ${certificationData.name}`,
            'success'
        );
    }
    
    return success;
}

// Bulk operations for certifications
const CertificationManager = {
    // Add multiple certifications at once
    addMultiple: function(certificationsArray) {
        let successCount = 0;
        let failedCertifications = [];
        
        certificationsArray.forEach(cert => {
            if (addCertification(cert)) {
                successCount++;
            } else {
                failedCertifications.push(cert.name || cert.id);
            }
        });
        
        // Re-render once after all additions
        renderCertifications();
        initializeCertificationInteractions();
        initializeCertificationFiltering();
        
        // Show results
        if (successCount > 0) {
            PortfolioUtils.showNotification(
                `Successfully added ${successCount} certification(s)`,
                'success'
            );
        }
        
        if (failedCertifications.length > 0) {
            PortfolioUtils.showNotification(
                `Failed to add: ${failedCertifications.join(', ')}`,
                'warning'
            );
        }
        
        return {
            success: successCount,
            failed: failedCertifications.length,
            failedItems: failedCertifications
        };
    },
    
    // Remove certification by ID
    remove: function(certId) {
        const index = certificationsData.findIndex(cert => cert.id === certId);
        
        if (index === -1) {
            console.error('Certification not found:', certId);
            return false;
        }
        
        const removedCert = certificationsData.splice(index, 1)[0];
        
        // Re-render
        renderCertifications();
        initializeCertificationInteractions();
        initializeCertificationFiltering();
        
        PortfolioUtils.showNotification(
            `Removed certification: ${removedCert.name}`,
            'info'
        );
        
        PortfolioUtils.trackEvent('certification_removed', {
            certificationId: certId,
            certificationName: removedCert.name,
            timestamp: new Date().toISOString()
        });
        
        return true;
    },
    
    // Get certification statistics
    getStats: function() {
        const now = new Date();
        const stats = {
            total: certificationsData.length,
            active: 0,
            expired: 0,
            inProgress: 0,
            expiringWithin30Days: 0,
            byIssuer: {},
            byStatus: {}
        };
        
        certificationsData.forEach(cert => {
            // Count by actual status (considering expiration)
            const isExpired = cert.expirationDate && new Date(cert.expirationDate) < now;
            const actualStatus = isExpired ? 'expired' : cert.status;
            
            stats.byStatus[actualStatus] = (stats.byStatus[actualStatus] || 0) + 1;
            
            switch (actualStatus) {
                case 'active':
                    stats.active++;
                    break;
                case 'expired':
                    stats.expired++;
                    break;
                case 'in-progress':
                    stats.inProgress++;
                    break;
            }
            
            // Check for expiring soon
            if (cert.expirationDate && !isExpired) {
                const expirationDate = new Date(cert.expirationDate);
                const daysUntilExpiration = Math.ceil((expirationDate - now) / (1000 * 60 * 60 * 24));
                
                if (daysUntilExpiration <= 30) {
                    stats.expiringWithin30Days++;
                }
            }
            
            // Count by issuer
            stats.byIssuer[cert.issuer] = (stats.byIssuer[cert.issuer] || 0) + 1;
        });
        
        return stats;
    },
    
    // Export certifications data
    export: function() {
        const dataStr = JSON.stringify(certificationsData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'certifications-export.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        PortfolioUtils.trackEvent('certifications_exported', {
            count: certificationsData.length,
            timestamp: new Date().toISOString()
        });
        
        PortfolioUtils.showNotification('Certifications data exported successfully', 'success');
    }
};

// Education Section Functionality
function initializeEducation() {
    handleGPADisplay();
    initializeEducationAnimations();
}

// Handle conditional GPA display (only show if 3.5 or higher)
function handleGPADisplay() {
    const gpaDisplay = document.querySelector('.gpa-display[data-gpa]');
    
    if (gpaDisplay) {
        const gpaValue = parseFloat(gpaDisplay.getAttribute('data-gpa'));
        
        // Only show GPA if it's 3.5 or higher
        if (gpaValue < 3.5) {
            gpaDisplay.style.display = 'none';
            
            // Also hide the entire achievements section if no honors and no GPA
            const achievementsSection = document.querySelector('.education-achievements');
            const honorsList = document.querySelector('.honors-list');
            
            if (achievementsSection && (!honorsList || honorsList.children.length === 0)) {
                achievementsSection.style.display = 'none';
            }
        } else {
            gpaDisplay.style.display = 'flex';
        }
    }
}

// Initialize education section animations
function initializeEducationAnimations() {
    // Intersection Observer for education items
    const educationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe education items
    const educationItems = document.querySelectorAll('.education-item');
    educationItems.forEach(item => {
        // Set initial state for animation
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        
        educationObserver.observe(item);
    });
    
    // Observe activity items for staggered animation
    const activityItems = document.querySelectorAll('.activity-item');
    activityItems.forEach((item, index) => {
        // Set initial state
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `opacity 0.4s ease-out ${index * 0.1}s, transform 0.4s ease-out ${index * 0.1}s`;
        
        educationObserver.observe(item);
    });
}

// Education data management (for easy updates)
const educationData = {
    university: {
        name: "University of Mindanao Digos College",
        location: "Digos City, Davao del Sur",
        degree: "Bachelor of Science in Information Technology",
        major: "Computer Science",
        minor: "Mathematics",
        graduationDate: "May 2025",
        gpa: 3.7, // Set to 0 or remove if below 3.5
        honors: [
            "Dean's List (Fall 2023, Spring 2024)",
            "Computer Science Department Scholarship Recipient"
        ]
    },
    
    coursework: {
        "Core Computer Science": [
            {
                name: "Data Structures and Algorithms",
                project: "Final Project: Implemented AVL Tree with visualization"
            },
            {
                name: "Object-Oriented Programming",
                project: "Project: Java-based inventory management system"
            },
            {
                name: "Database Systems",
                project: "Project: Designed and implemented e-commerce database"
            },
            {
                name: "Software Engineering",
                project: "Team Project: Agile development of web application"
            }
        ],
        "Web Development & Systems": [
            {
                name: "Web Development",
                project: "Project: Full-stack CRUD application with authentication"
            },
            {
                name: "Computer Networks",
                project: "Assignment: Implemented TCP/UDP client-server programs"
            },
            {
                name: "Operating Systems",
                project: "Project: Multi-threaded process scheduler simulation"
            },
            {
                name: "Computer Architecture",
                project: "Assignment: MIPS assembly language programming"
            }
        ],
        "Mathematics & Theory": [
            {
                name: "Discrete Mathematics",
                project: "Focus: Graph theory and combinatorics"
            },
            {
                name: "Linear Algebra",
                project: "Application: Machine learning fundamentals"
            },
            {
                name: "Statistics for Computer Science",
                project: "Project: Statistical analysis of algorithm performance"
            },
            {
                name: "Theory of Computation",
                project: "Study: Automata theory and complexity analysis"
            }
        ]
    },
    
    activities: {
        "Student Organizations": [
            {
                name: "Computer Science Student Association",
                role: "Vice President",
                dates: "Sep 2023 - Present",
                description: "Lead organizing committee for tech talks, hackathons, and networking events. Coordinate with industry professionals and manage event logistics for 200+ members."
            },
            {
                name: "ACM Programming Team",
                role: "Team Member",
                dates: "Jan 2023 - Present",
                description: "Participate in competitive programming contests including ICPC regionals. Practice algorithmic problem-solving and collaborate on complex coding challenges."
            }
        ],
        "Volunteer Work": [
            {
                name: "Code for Good Volunteer",
                role: "Web Developer",
                dates: "Jun 2023 - Present",
                description: "Develop and maintain websites for local non-profit organizations. Collaborate with designers and stakeholders to create accessible, user-friendly solutions."
            },
            {
                name: "CS Tutoring Program",
                role: "Peer Tutor",
                dates: "Aug 2023 - Present",
                description: "Provide one-on-one tutoring for introductory programming courses. Help students understand fundamental concepts in Java, Python, and data structures."
            }
        ],
        "Competitions & Achievements": [
            {
                name: "University Hackathon 2024",
                role: "2nd Place Winner",
                dates: "Mar 2024",
                description: "Led team of 4 to develop AI-powered study assistant web application in 48 hours. Implemented natural language processing and responsive design."
            },
            {
                name: "Regional Programming Contest",
                role: "Team Participant",
                dates: "Nov 2023",
                description: "Competed in ICPC regional contest, solving algorithmic problems under time pressure. Ranked in top 25% of participating teams."
            },
            {
                name: "Google Code Jam",
                role: "Participant",
                dates: "2023, 2024",
                description: "Participated in Google's annual coding competition, advancing to Round 1 both years. Strengthened problem-solving skills and algorithmic thinking."
            }
        ]
    }
};

// Function to update education data dynamically
function updateEducationData(newData) {
    Object.assign(educationData, newData);
    
    // Re-render education section if needed
    if (typeof renderEducationSection === 'function') {
        renderEducationSection();
    }
    
    // Re-initialize GPA display
    handleGPADisplay();
    
    PortfolioUtils.trackEvent('education_data_updated', {
        timestamp: new Date().toISOString()
    });
}

// Add education initialization to the main DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
    // Add to existing initialization
    initializeEducation();
});

// Education utility functions
const EducationUtils = {
    // Format date for display
    formatDate: function(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
        });
    },
    
    // Calculate years until graduation
    getYearsUntilGraduation: function(graduationDate) {
        const now = new Date();
        const gradDate = new Date(graduationDate);
        const diffTime = gradDate - now;
        const diffYears = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365));
        return Math.max(0, diffYears);
    },
    
    // Get academic status
    getAcademicStatus: function(graduationDate) {
        const yearsLeft = this.getYearsUntilGraduation(graduationDate);
        
        if (yearsLeft === 0) {
            return "Graduating Soon";
        } else if (yearsLeft === 1) {
            return "Senior";
        } else if (yearsLeft === 2) {
            return "Junior";
        } else if (yearsLeft === 3) {
            return "Sophomore";
        } else {
            return "Freshman";
        }
    },
    
    // Validate GPA
    isValidGPA: function(gpa) {
        return typeof gpa === 'number' && gpa >= 0 && gpa <= 4.0;
    },
    
    // Should display GPA
    shouldDisplayGPA: function(gpa) {
        return this.isValidGPA(gpa) && gpa >= 3.5;
    }
};

// Error handling for education section
function handleEducationErrors() {
    try {
        // Check if required elements exist
        const educationSection = document.querySelector('.education-section');
        if (!educationSection) {
            console.warn('Education section not found');
            return;
        }
        
        // Validate education data
        if (!educationData || typeof educationData !== 'object') {
            console.error('Education data is invalid');
            return;
        }
        
        // Check GPA validity
        if (educationData.university && educationData.university.gpa) {
            if (!EducationUtils.isValidGPA(educationData.university.gpa)) {
                console.warn('Invalid GPA value:', educationData.university.gpa);
            }
        }
        
    } catch (error) {
        console.error('Error in education section:', error);
        
        // Show user-friendly error message
        PortfolioUtils.showNotification(
            'There was an issue loading the education section. Please refresh the page.',
            'error'
        );
    }
}

// Initialize error handling
document.addEventListener('DOMContentLoaded', function() {
    handleEducationErrors();
});
// ===== CONTACT FORM FUNCTIONALITY =====

// Initialize contact form functionality
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) {
        console.warn('Contact form not found');
        return;
    }
    
    // Add form submission handler
    contactForm.addEventListener('submit', handleContactFormSubmission);
    
    // Add real-time validation
    const formInputs = contactForm.querySelectorAll('.form-input, .form-textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
    
    // Initialize download tracking for resume button
    initializeResumeDownloadTracking();
    
    console.log('Contact form initialized successfully');
}

// Handle contact form submission
async function handleContactFormSubmission(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const formStatus = document.getElementById('formStatus');
    
    // Validate all fields
    const isValid = validateContactForm(form);
    if (!isValid) {
        showFormStatus('Please correct the errors above.', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-flex';
    
    try {
        // Get form data
        const formData = new FormData(form);
        const contactData = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject') || 'Portfolio Contact',
            message: formData.get('message')
        };
        
        // Track form submission attempt
        PortfolioUtils.trackEvent('contact_form_submitted', {
            hasSubject: !!contactData.subject,
            messageLength: contactData.message.length
        });
        
        // Simulate form submission (replace with actual endpoint)
        await simulateFormSubmission(contactData);
        
        // Show success message
        showFormStatus('Thank you for your message! I\'ll get back to you soon.', 'success');
        
        // Reset form
        form.reset();
        
        // Track successful submission
        PortfolioUtils.trackEvent('contact_form_success', contactData);
        
    } catch (error) {
        console.error('Form submission error:', error);
        showFormStatus('Sorry, there was an error sending your message. Please try again or contact me directly.', 'error');
        
        // Track form error
        PortfolioUtils.trackEvent('contact_form_error', {
            error: error.message
        });
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
    }
}

// Validate entire contact form
function validateContactForm(form) {
    const nameInput = form.querySelector('#contactName');
    const emailInput = form.querySelector('#contactEmail');
    const messageInput = form.querySelector('#contactMessage');
    
    let isValid = true;
    
    // Validate name
    if (!validateField(nameInput)) {
        isValid = false;
    }
    
    // Validate email
    if (!validateField(emailInput)) {
        isValid = false;
    }
    
    // Validate message
    if (!validateField(messageInput)) {
        isValid = false;
    }
    
    return isValid;
}

// Validate individual field
function validateField(field) {
    const fieldName = field.name;
    const fieldValue = field.value.trim();
    const errorElement = document.getElementById(field.getAttribute('aria-describedby'));
    
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous error state
    field.classList.remove('error');
    if (errorElement) {
        errorElement.textContent = '';
    }
    
    // Validate based on field type
    switch (fieldName) {
        case 'name':
            if (!fieldValue) {
                errorMessage = 'Name is required.';
                isValid = false;
            } else if (fieldValue.length < 2) {
                errorMessage = 'Name must be at least 2 characters long.';
                isValid = false;
            } else if (fieldValue.length > 100) {
                errorMessage = 'Name must be less than 100 characters.';
                isValid = false;
            }
            break;
            
        case 'email':
            if (!fieldValue) {
                errorMessage = 'Email is required.';
                isValid = false;
            } else if (!isValidEmail(fieldValue)) {
                errorMessage = 'Please enter a valid email address.';
                isValid = false;
            }
            break;
            
        case 'subject':
            // Subject is optional, but validate length if provided
            if (fieldValue && fieldValue.length > 200) {
                errorMessage = 'Subject must be less than 200 characters.';
                isValid = false;
            }
            break;
            
        case 'message':
            if (!fieldValue) {
                errorMessage = 'Message is required.';
                isValid = false;
            } else if (fieldValue.length < 10) {
                errorMessage = 'Message must be at least 10 characters long.';
                isValid = false;
            } else if (fieldValue.length > 2000) {
                errorMessage = 'Message must be less than 2000 characters.';
                isValid = false;
            }
            break;
    }
    
    // Show error if validation failed
    if (!isValid) {
        field.classList.add('error');
        if (errorElement) {
            errorElement.textContent = errorMessage;
        }
    }
    
    return isValid;
}

// Clear field error state
function clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = document.getElementById(field.getAttribute('aria-describedby'));
    if (errorElement) {
        errorElement.textContent = '';
    }
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show form status message
function showFormStatus(message, type) {
    const formStatus = document.getElementById('formStatus');
    if (!formStatus) return;
    
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
    formStatus.style.display = 'block';
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            formStatus.style.display = 'none';
        }, 5000);
    }
}

// Simulate form submission (replace with actual backend integration)
async function simulateFormSubmission(contactData) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate random success/failure for demo purposes
    // In production, this would be replaced with actual form submission logic
    if (Math.random() > 0.1) { // 90% success rate for demo
        return { success: true, message: 'Message sent successfully' };
    } else {
        throw new Error('Network error - please try again');
    }
}

// Initialize resume download tracking
function initializeResumeDownloadTracking() {
    const resumeButtons = document.querySelectorAll('.resume-btn, [download*="resume"], [download*="Resume"]');
    
    resumeButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            const filename = this.download || 'resume.pdf';
            const source = this.closest('.contact-section') ? 'contact_section' : 'other';
            
            // Track resume download
            PortfolioUtils.trackEvent('resume_downloaded', {
                filename: filename,
                source: source,
                timestamp: new Date().toISOString()
            });
            
            // Show download confirmation
            showDownloadNotification(filename);
        });
    });
}

// Show download notification
function showDownloadNotification(filename) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'download-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-download" aria-hidden="true"></i>
            <span>Downloading ${filename}...</span>
        </div>
    `;
    
    // Add notification styles if not already present
    if (!document.querySelector('#download-notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'download-notification-styles';
        styles.textContent = `
            .download-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--primary-color);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 1000;
                animation: slideInRight 0.3s ease-out;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-weight: 500;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @media (max-width: 480px) {
                .download-notification {
                    top: 10px;
                    right: 10px;
                    left: 10px;
                    padding: 0.875rem 1rem;
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Contact form utilities
const ContactFormUtils = {
    // Sanitize input text
    sanitizeInput: function(input) {
        return input.trim().replace(/[<>]/g, '');
    },
    
    // Format contact data for submission
    formatContactData: function(formData) {
        return {
            name: this.sanitizeInput(formData.get('name')),
            email: this.sanitizeInput(formData.get('email')),
            subject: this.sanitizeInput(formData.get('subject') || ''),
            message: this.sanitizeInput(formData.get('message')),
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            referrer: document.referrer
        };
    },
    
    // Get form analytics data
    getFormAnalytics: function(form) {
        const inputs = form.querySelectorAll('input, textarea');
        let totalCharacters = 0;
        let filledFields = 0;
        
        inputs.forEach(input => {
            if (input.value.trim()) {
                filledFields++;
                totalCharacters += input.value.length;
            }
        });
        
        return {
            totalFields: inputs.length,
            filledFields: filledFields,
            totalCharacters: totalCharacters,
            completionRate: (filledFields / inputs.length) * 100
        };
    }
};

// Error handling for contact form
function handleContactFormErrors() {
    try {
        // Check if contact section exists
        const contactSection = document.querySelector('.contact-section');
        if (!contactSection) {
            console.warn('Contact section not found');
            return;
        }
        
        // Check if form exists
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) {
            console.warn('Contact form not found');
            return;
        }
        
        // Validate form structure
        const requiredFields = ['contactName', 'contactEmail', 'contactMessage'];
        const missingFields = requiredFields.filter(id => !document.getElementById(id));
        
        if (missingFields.length > 0) {
            console.error('Missing required form fields:', missingFields);
            return;
        }
        
        console.log('Contact form validation passed');
        
    } catch (error) {
        console.error('Error in contact form setup:', error);
        
        // Show user-friendly error message
        PortfolioUtils.showNotification(
            'There was an issue loading the contact form. Please refresh the page or contact me directly.',
            'error'
        );
    }
}

// Add contact form initialization to the main DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
    // Add to existing initialization
    initializeContactForm();
    handleContactFormErrors();
});

// Social media link tracking
function initializeSocialMediaTracking() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            const platform = this.classList.contains('linkedin') ? 'linkedin' :
                           this.classList.contains('github') ? 'github' :
                           this.classList.contains('email') ? 'email' :
                           this.classList.contains('twitter') ? 'twitter' : 'unknown';
            
            const url = this.href;
            
            // Track social media click
            PortfolioUtils.trackEvent('social_media_clicked', {
                platform: platform,
                url: url,
                source: 'contact_section'
            });
        });
    });
}

// Initialize social media tracking
document.addEventListener('DOMContentLoaded', function() {
    initializeSocialMediaTracking();
});