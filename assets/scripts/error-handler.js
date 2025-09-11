// Error Handler - Client-side error handling and fallbacks
// Implements comprehensive error handling for images, forms, navigation, and general errors

class ErrorHandler {
    constructor() {
        this.errorLog = [];
        this.fallbackImages = {
            default: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIiBzdHJva2U9IiNkZGQiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg==',
            headshot: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIiBzdHJva2U9IiNlMWU1ZTkiIHN0cm9rZS13aWR0aD0iMiIvPjxjaXJjbGUgY3g9IjI1MCIgY3k9IjIwMCIgcj0iNjAiIGZpbGw9IiNkMWQ1ZGIiLz48cGF0aCBkPSJNMTgwIDM1MGMwLTQwIDMwLTcwIDcwLTcwczcwIDMwIDcwIDcwdjUwSDE4MHoiIGZpbGw9IiNkMWQ1ZGIiLz48dGV4dCB4PSI1MCUiIHk9IjQ1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNjc3NDhkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Qcm9maWxlIGltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+',
            project: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIiBzdHJva2U9IiNlMWU1ZTkiIHN0cm9rZS13aWR0aD0iMiIvPjxyZWN0IHg9IjUwIiB5PSI1MCIgd2lkdGg9IjcwMCIgaGVpZ2h0PSI0MCIgZmlsbD0iI2UxZTVlOSIgcng9IjQiLz48cmVjdCB4PSI1MCIgeT0iMTIwIiB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjZDFkNWRiIiByeD0iNCIvPjxyZWN0IHg9IjUwIiB5PSIxNjAiIHdpZHRoPSI0NTAiIGhlaWdodD0iMjAiIGZpbGw9IiNkMWQ1ZGIiIHJ4PSI0Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzY3NzQ4ZCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UHJvamVjdCBzY3JlZW5zaG90IG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+'
        };
        this.init();
    }

    init() {
        this.initializeImageErrorHandling();
        this.initializeFormErrorHandling();
        this.initializeNavigationErrorHandling();
        this.initializeGlobalErrorHandling();
        this.initializeNetworkErrorHandling();
        this.initializeLoadingStates();
        this.initializeGracefulDegradation();
        console.log('Error handler initialized');
    }

    // Image Error Handling with Fallbacks
    initializeImageErrorHandling() {
        // Handle existing images
        const images = document.querySelectorAll('img');
        images.forEach(img => this.setupImageErrorHandling(img));

        // Handle dynamically added images
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const images = node.tagName === 'IMG' ? [node] : node.querySelectorAll('img');
                        images.forEach(img => this.setupImageErrorHandling(img));
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    setupImageErrorHandling(img) {
        if (img.dataset.errorHandled) return;
        img.dataset.errorHandled = 'true';

        img.addEventListener('error', (e) => {
            this.handleImageError(e.target);
        });

        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });
    }

    handleImageError(img) {
        const errorInfo = {
            type: 'image_load_error',
            src: img.src,
            alt: img.alt,
            timestamp: new Date().toISOString()
        };
        this.logError(errorInfo);

        // Determine appropriate fallback
        let fallbackSrc = this.fallbackImages.default;
        
        if (img.classList.contains('hero-image') || img.alt.toLowerCase().includes('headshot')) {
            fallbackSrc = this.fallbackImages.headshot;
        } else if (img.closest('.project-card') || img.alt.toLowerCase().includes('screenshot')) {
            fallbackSrc = this.fallbackImages.project;
        }

        // Create fallback container
        const fallbackContainer = document.createElement('div');
        fallbackContainer.className = 'image-error-fallback';
        fallbackContainer.innerHTML = `
            <img src="${fallbackSrc}" 
                 alt="${img.alt || 'Image not available'}" 
                 class="${img.className} fallback-image"
                 style="${img.getAttribute('style') || ''}"
                 ${img.width ? `width="${img.width}"` : ''}
                 ${img.height ? `height="${img.height}"` : ''}>
            <div class="error-overlay">
                <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
                <span class="error-text">Image unavailable</span>
            </div>
        `;

        // Copy important attributes
        if (img.loading) fallbackContainer.querySelector('img').loading = img.loading;
        if (img.sizes) fallbackContainer.querySelector('img').sizes = img.sizes;

        // Replace the broken image
        img.parentNode.replaceChild(fallbackContainer, img);

        // Announce to screen readers
        if (window.AccessibilityManager) {
            window.AccessibilityManager.announcePolite('Image failed to load, fallback displayed');
        }

        console.warn('Image load failed, fallback applied:', errorInfo);
    }

    // Form Error Handling and Validation
    initializeFormErrorHandling() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => this.setupFormErrorHandling(form));
    }

    setupFormErrorHandling(form) {
        if (form.dataset.errorHandled) return;
        form.dataset.errorHandled = 'true';

        // Create error container if it doesn't exist
        if (!form.querySelector('.form-errors')) {
            const errorContainer = document.createElement('div');
            errorContainer.className = 'form-errors';
            errorContainer.setAttribute('role', 'alert');
            errorContainer.setAttribute('aria-live', 'polite');
            form.insertBefore(errorContainer, form.firstChild);
        }

        // Setup field validation
        const fields = form.querySelectorAll('input, textarea, select');
        fields.forEach(field => this.setupFieldValidation(field));

        // Handle form submission
        form.addEventListener('submit', (e) => {
            this.handleFormSubmission(e);
        });
    }

    setupFieldValidation(field) {
        if (field.dataset.validationHandled) return;
        field.dataset.validationHandled = 'true';

        // Create error element for field if it doesn't exist
        let errorElement = document.getElementById(`${field.id}-error`);
        if (!errorElement && field.id) {
            errorElement = document.createElement('div');
            errorElement.id = `${field.id}-error`;
            errorElement.className = 'field-error';
            errorElement.setAttribute('role', 'alert');
            errorElement.setAttribute('aria-live', 'polite');
            field.parentNode.insertBefore(errorElement, field.nextSibling);
            field.setAttribute('aria-describedby', errorElement.id);
        }

        // Real-time validation
        field.addEventListener('blur', () => {
            this.validateField(field);
        });

        field.addEventListener('input', () => {
            // Clear errors when user starts typing
            if (errorElement) {
                errorElement.textContent = '';
                field.classList.remove('error');
            }
        });
    }

    validateField(field) {
        const errors = [];
        const value = field.value.trim();

        // Required field validation
        if (field.required && !value) {
            errors.push(`${this.getFieldLabel(field)} is required`);
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errors.push('Please enter a valid email address');
            }
        }

        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                errors.push('Please enter a valid phone number');
            }
        }

        // URL validation
        if (field.type === 'url' && value) {
            try {
                new URL(value);
            } catch {
                errors.push('Please enter a valid URL');
            }
        }

        // Length validation
        if (field.minLength && value.length < field.minLength) {
            errors.push(`${this.getFieldLabel(field)} must be at least ${field.minLength} characters`);
        }

        if (field.maxLength && value.length > field.maxLength) {
            errors.push(`${this.getFieldLabel(field)} must be no more than ${field.maxLength} characters`);
        }

        // Pattern validation
        if (field.pattern && value) {
            const regex = new RegExp(field.pattern);
            if (!regex.test(value)) {
                errors.push(field.title || `${this.getFieldLabel(field)} format is invalid`);
            }
        }

        // Display errors
        const errorElement = document.getElementById(`${field.id}-error`);
        if (errorElement) {
            if (errors.length > 0) {
                errorElement.textContent = errors[0];
                field.classList.add('error');
                
                // Announce error to screen readers
                if (window.AccessibilityManager) {
                    window.AccessibilityManager.announcePolite(errors[0]);
                }
            } else {
                errorElement.textContent = '';
                field.classList.remove('error');
            }
        }

        return errors.length === 0;
    }

    getFieldLabel(field) {
        const label = field.labels?.[0]?.textContent || 
                     field.getAttribute('aria-label') || 
                     field.getAttribute('placeholder') || 
                     field.name || 
                     'Field';
        return label.replace('*', '').trim();
    }

    handleFormSubmission(e) {
        const form = e.target;
        const errorContainer = form.querySelector('.form-errors');
        let hasErrors = false;
        const allErrors = [];

        // Validate all fields
        const fields = form.querySelectorAll('input, textarea, select');
        fields.forEach(field => {
            if (!this.validateField(field)) {
                hasErrors = true;
                const errorElement = document.getElementById(`${field.id}-error`);
                if (errorElement && errorElement.textContent) {
                    allErrors.push(errorElement.textContent);
                }
            }
        });

        // Handle submission errors
        if (hasErrors) {
            e.preventDefault();
            
            // Display summary of errors
            if (errorContainer) {
                errorContainer.innerHTML = `
                    <div class="error-summary">
                        <h3><i class="fas fa-exclamation-triangle" aria-hidden="true"></i> Please correct the following errors:</h3>
                        <ul>
                            ${allErrors.map(error => `<li>${error}</li>`).join('')}
                        </ul>
                    </div>
                `;
                errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            // Focus first error field
            const firstErrorField = form.querySelector('.error');
            if (firstErrorField) {
                firstErrorField.focus();
            }

            // Announce to screen readers
            if (window.AccessibilityManager) {
                window.AccessibilityManager.announceAssertive(
                    `Form has ${allErrors.length} error${allErrors.length > 1 ? 's' : ''}. Please review and correct.`
                );
            }

            this.logError({
                type: 'form_validation_error',
                form: form.id || form.className,
                errors: allErrors,
                timestamp: new Date().toISOString()
            });
        } else {
            // Clear any previous errors
            if (errorContainer) {
                errorContainer.innerHTML = '';
            }

            // Show loading state
            this.showFormLoadingState(form);
        }
    }

    showFormLoadingState(form) {
        const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            const originalText = submitButton.textContent;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Sending...';
            
            // Reset after timeout (fallback)
            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }, 10000);
        }
    }

    // Navigation Error Handling
    initializeNavigationErrorHandling() {
        // Handle smooth scroll errors
        const originalScrollTo = window.scrollTo;
        window.scrollTo = (...args) => {
            try {
                originalScrollTo.apply(window, args);
            } catch (error) {
                this.logError({
                    type: 'scroll_error',
                    error: error.message,
                    timestamp: new Date().toISOString()
                });
                
                // Fallback to regular scroll
                if (args[0] && typeof args[0] === 'object') {
                    window.scroll(0, args[0].top || 0);
                } else {
                    window.scroll(args[0] || 0, args[1] || 0);
                }
            }
        };

        // Handle hash navigation errors
        window.addEventListener('hashchange', (e) => {
            try {
                const hash = window.location.hash.substring(1);
                const target = document.getElementById(hash);
                
                if (hash && !target) {
                    this.logError({
                        type: 'navigation_error',
                        hash: hash,
                        message: 'Target element not found',
                        timestamp: new Date().toISOString()
                    });
                    
                    // Fallback to top of page
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    
                    if (window.AccessibilityManager) {
                        window.AccessibilityManager.announcePolite('Section not found, returned to top of page');
                    }
                }
            } catch (error) {
                this.logError({
                    type: 'hashchange_error',
                    error: error.message,
                    timestamp: new Date().toISOString()
                });
            }
        });

        // Enhanced smooth scroll with error handling
        this.setupSafeScrolling();
    }

    setupSafeScrolling() {
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                try {
                    const targetId = link.getAttribute('href').substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        const navigationHeight = document.querySelector('.main-navigation')?.offsetHeight || 0;
                        const offsetTop = targetElement.offsetTop - navigationHeight - 20;
                        
                        // Safe scroll with fallback
                        this.safeScrollTo(offsetTop, targetId);
                    } else {
                        throw new Error(`Target element '${targetId}' not found`);
                    }
                } catch (error) {
                    this.logError({
                        type: 'navigation_click_error',
                        link: link.href,
                        error: error.message,
                        timestamp: new Date().toISOString()
                    });
                    
                    // Fallback behavior
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    
                    if (window.AccessibilityManager) {
                        window.AccessibilityManager.announcePolite('Navigation error occurred, returned to top');
                    }
                }
            });
        });
    }

    safeScrollTo(position, targetId = null) {
        try {
            window.scrollTo({
                top: position,
                behavior: 'smooth'
            });
            
            if (targetId && window.AccessibilityManager) {
                setTimeout(() => {
                    window.AccessibilityManager.announcePolite(`Navigated to ${targetId} section`);
                }, 500);
            }
        } catch (error) {
            // Fallback to instant scroll
            window.scroll(0, position);
            
            this.logError({
                type: 'smooth_scroll_error',
                position: position,
                targetId: targetId,
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }

    // Network Error Handling
    initializeNetworkErrorHandling() {
        // Monitor online/offline status
        window.addEventListener('online', () => {
            this.showNetworkStatus('online');
        });

        window.addEventListener('offline', () => {
            this.showNetworkStatus('offline');
        });

        // Handle fetch errors globally
        const originalFetch = window.fetch;
        window.fetch = (...args) => {
            return originalFetch.apply(window, args)
                .catch(error => {
                    this.logError({
                        type: 'network_error',
                        url: args[0],
                        error: error.message,
                        timestamp: new Date().toISOString()
                    });
                    
                    this.showNetworkError(error);
                    throw error;
                });
        };
    }

    showNetworkStatus(status) {
        const notification = document.createElement('div');
        notification.className = `network-notification ${status}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${status === 'online' ? 'wifi' : 'wifi-slash'}" aria-hidden="true"></i>
                <span>${status === 'online' ? 'Connection restored' : 'No internet connection'}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Announce to screen readers
        if (window.AccessibilityManager) {
            window.AccessibilityManager.announceAssertive(
                status === 'online' ? 'Internet connection restored' : 'Internet connection lost'
            );
        }
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    showNetworkError(error) {
        const notification = document.createElement('div');
        notification.className = 'error-notification network-error';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
                <span>Network error occurred. Please check your connection.</span>
                <button class="notification-close" aria-label="Close notification">×</button>
            </div>
        `;
        
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            notification.remove();
        });
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (document.contains(notification)) {
                notification.remove();
            }
        }, 10000);
    }

    // Global Error Handling
    initializeGlobalErrorHandling() {
        // Handle JavaScript errors
        window.addEventListener('error', (e) => {
            this.logError({
                type: 'javascript_error',
                message: e.message,
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno,
                stack: e.error?.stack,
                timestamp: new Date().toISOString()
            });
        });

        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (e) => {
            this.logError({
                type: 'unhandled_promise_rejection',
                reason: e.reason,
                timestamp: new Date().toISOString()
            });
        });

        // Handle resource loading errors
        document.addEventListener('error', (e) => {
            if (e.target !== window) {
                this.logError({
                    type: 'resource_error',
                    element: e.target.tagName,
                    src: e.target.src || e.target.href,
                    timestamp: new Date().toISOString()
                });
            }
        }, true);
    }

    // Error Logging
    logError(errorInfo) {
        this.errorLog.push(errorInfo);
        
        // Keep only last 100 errors
        if (this.errorLog.length > 100) {
            this.errorLog = this.errorLog.slice(-100);
        }
        
        // Log to console in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.error('Error logged:', errorInfo);
        }
        
        // Send to analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                description: `${errorInfo.type}: ${errorInfo.message || errorInfo.error || 'Unknown error'}`,
                fatal: false
            });
        }
    }

    // Loading States Management
    initializeLoadingStates() {
        // Create global loading overlay
        this.createLoadingOverlay();
        
        // Handle dynamic content loading
        this.setupDynamicContentLoading();
        
        // Handle iframe loading states
        this.setupIframeLoadingStates();
    }

    createLoadingOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'global-loading-overlay';
        overlay.className = 'loading-overlay hidden';
        overlay.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner" aria-hidden="true">
                    <i class="fas fa-spinner fa-spin"></i>
                </div>
                <div class="loading-text">Loading...</div>
            </div>
        `;
        overlay.setAttribute('role', 'status');
        overlay.setAttribute('aria-live', 'polite');
        document.body.appendChild(overlay);
    }

    showLoading(message = 'Loading...') {
        const overlay = document.getElementById('global-loading-overlay');
        if (overlay) {
            const loadingText = overlay.querySelector('.loading-text');
            if (loadingText) {
                loadingText.textContent = message;
            }
            overlay.classList.remove('hidden');
            
            // Announce to screen readers
            if (window.AccessibilityManager) {
                window.AccessibilityManager.announcePolite(message);
            }
        }
    }

    hideLoading() {
        const overlay = document.getElementById('global-loading-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }

    setupDynamicContentLoading() {
        // Monitor for dynamic content changes
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Add loading states to new interactive elements
                        const buttons = node.tagName === 'BUTTON' ? [node] : node.querySelectorAll('button');
                        buttons.forEach(button => this.setupButtonLoadingState(button));
                        
                        // Add loading states to new forms
                        const forms = node.tagName === 'FORM' ? [node] : node.querySelectorAll('form');
                        forms.forEach(form => this.setupFormLoadingState(form));
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    setupButtonLoadingState(button) {
        if (button.dataset.loadingHandled) return;
        button.dataset.loadingHandled = 'true';

        button.addEventListener('click', () => {
            // Only add loading state for buttons that might trigger async operations
            if (button.type === 'submit' || 
                button.classList.contains('demo-toggle') ||
                button.classList.contains('download-btn') ||
                button.dataset.async === 'true') {
                
                this.setButtonLoading(button, true);
                
                // Auto-reset after timeout (fallback)
                setTimeout(() => {
                    this.setButtonLoading(button, false);
                }, 10000);
            }
        });
    }

    setButtonLoading(button, isLoading) {
        if (isLoading) {
            button.disabled = true;
            button.dataset.originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Loading...';
            button.setAttribute('aria-busy', 'true');
        } else {
            button.disabled = false;
            button.innerHTML = button.dataset.originalText || button.innerHTML;
            button.removeAttribute('aria-busy');
        }
    }

    setupIframeLoadingStates() {
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => this.setupIframeLoading(iframe));
    }

    setupIframeLoading(iframe) {
        if (iframe.dataset.loadingHandled) return;
        iframe.dataset.loadingHandled = 'true';

        // Create loading placeholder
        const loadingPlaceholder = document.createElement('div');
        loadingPlaceholder.className = 'iframe-loading-placeholder';
        loadingPlaceholder.innerHTML = `
            <div class="iframe-loading-content">
                <i class="fas fa-spinner fa-spin" aria-hidden="true"></i>
                <span>Loading demo...</span>
            </div>
        `;
        
        iframe.parentNode.insertBefore(loadingPlaceholder, iframe);
        iframe.style.display = 'none';

        iframe.addEventListener('load', () => {
            loadingPlaceholder.remove();
            iframe.style.display = 'block';
            
            // Announce completion
            if (window.AccessibilityManager) {
                window.AccessibilityManager.announcePolite('Demo loaded successfully');
            }
        });

        iframe.addEventListener('error', () => {
            loadingPlaceholder.innerHTML = `
                <div class="iframe-error-content">
                    <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
                    <span>Demo failed to load</span>
                    <button class="retry-btn" onclick="this.closest('.iframe-loading-placeholder').nextElementSibling.src = this.closest('.iframe-loading-placeholder').nextElementSibling.src">
                        Retry
                    </button>
                </div>
            `;
            
            this.logError({
                type: 'iframe_load_error',
                src: iframe.src,
                timestamp: new Date().toISOString()
            });
        });
    }

    // Error Boundaries for JavaScript-disabled browsers
    initializeGracefulDegradation() {
        // Add noscript fallbacks
        this.addNoScriptFallbacks();
        
        // Enhance forms for non-JS environments
        this.enhanceFormsForNoJS();
        
        // Add CSS-only fallbacks
        this.addCSSFallbacks();
    }

    addNoScriptFallbacks() {
        // Check if noscript elements exist, if not create them
        if (!document.querySelector('noscript')) {
            const noscript = document.createElement('noscript');
            noscript.innerHTML = `
                <div class="noscript-warning">
                    <div class="noscript-content">
                        <h2>JavaScript Disabled</h2>
                        <p>This portfolio works best with JavaScript enabled. Some interactive features may not be available.</p>
                        <p>You can still:</p>
                        <ul>
                            <li>View all content and projects</li>
                            <li>Download my resume</li>
                            <li>Access contact information</li>
                            <li>Navigate between sections</li>
                        </ul>
                    </div>
                </div>
            `;
            document.body.insertBefore(noscript, document.body.firstChild);
        }
    }

    enhanceFormsForNoJS() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            // Add action attribute if missing (for no-JS submission)
            if (!form.action) {
                form.action = '#contact';
            }
            
            // Add method if missing
            if (!form.method) {
                form.method = 'post';
            }
            
            // Add novalidate for custom validation, but remove it if JS is disabled
            form.setAttribute('novalidate', '');
        });
    }

    addCSSFallbacks() {
        // Add CSS class to indicate JS is available
        document.documentElement.classList.add('js-enabled');
        
        // This allows CSS to provide fallbacks for non-JS users
        // Example: .no-js .demo-toggle { display: none; }
    }

    // Enhanced error boundaries
    createErrorBoundary(element, fallbackContent) {
        try {
            // Wrap element in error boundary
            const boundary = document.createElement('div');
            boundary.className = 'error-boundary';
            boundary.dataset.originalContent = element.outerHTML;
            
            element.parentNode.insertBefore(boundary, element);
            boundary.appendChild(element);
            
            // Monitor for errors within this boundary
            boundary.addEventListener('error', (e) => {
                this.handleBoundaryError(boundary, fallbackContent, e);
            }, true);
            
            return boundary;
        } catch (error) {
            this.logError({
                type: 'error_boundary_creation_failed',
                error: error.message,
                timestamp: new Date().toISOString()
            });
            return element;
        }
    }

    handleBoundaryError(boundary, fallbackContent, error) {
        this.logError({
            type: 'error_boundary_triggered',
            boundary: boundary.className,
            error: error.message,
            timestamp: new Date().toISOString()
        });

        // Replace content with fallback
        boundary.innerHTML = fallbackContent || `
            <div class="error-boundary-fallback">
                <div class="error-content">
                    <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
                    <h3>Something went wrong</h3>
                    <p>This section encountered an error and has been temporarily disabled.</p>
                    <button class="retry-boundary-btn" onclick="window.errorHandler.retryBoundary(this.closest('.error-boundary'))">
                        Try Again
                    </button>
                </div>
            </div>
        `;
        
        // Announce to screen readers
        if (window.AccessibilityManager) {
            window.AccessibilityManager.announceAssertive('A section of the page encountered an error and has been replaced with a fallback');
        }
    }

    retryBoundary(boundary) {
        try {
            const originalContent = boundary.dataset.originalContent;
            if (originalContent) {
                boundary.outerHTML = originalContent;
                
                // Re-initialize the restored element
                setTimeout(() => {
                    this.init();
                }, 100);
            }
        } catch (error) {
            this.logError({
                type: 'boundary_retry_failed',
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }

    // Public methods for external use
    getErrorLog() {
        return [...this.errorLog];
    }

    clearErrorLog() {
        this.errorLog = [];
    }

    showUserFriendlyError(message, type = 'error') {
        const notification = document.createElement('div');
        notification.className = `user-error-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : 'info-circle'}" aria-hidden="true"></i>
                <span>${message}</span>
                <button class="notification-close" aria-label="Close notification">×</button>
            </div>
        `;
        
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            notification.remove();
        });
        
        document.body.appendChild(notification);
        
        // Announce to screen readers
        if (window.AccessibilityManager) {
            window.AccessibilityManager.announceAssertive(message);
        }
        
        setTimeout(() => {
            if (document.contains(notification)) {
                notification.remove();
            }
        }, 8000);
    }
}

// Initialize error handler when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.errorHandler = new ErrorHandler();
    });
} else {
    window.errorHandler = new ErrorHandler();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ErrorHandler;
}