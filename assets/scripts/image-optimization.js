// Image Optimization Module
class ImageOptimizer {
    constructor() {
        this.webpSupported = this.checkWebPSupport();
        this.lazyLoadObserver = null;
        this.imageCache = new Map();
        this.init();
    }

    init() {
        this.initializeLazyLoading();
        this.optimizeExistingImages();
        this.setupImageErrorHandling();
        console.log('Image optimization initialized');
    }

    // Check if browser supports WebP format
    checkWebPSupport() {
        return new Promise((resolve) => {
            const webP = new Image();
            webP.onload = webP.onerror = () => {
                resolve(webP.height === 2);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }

    // Initialize lazy loading for images
    initializeLazyLoading() {
        // Create intersection observer for lazy loading
        this.lazyLoadObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    this.lazyLoadObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        // Observe all images with lazy loading
        this.observeLazyImages();
    }

    // Observe images for lazy loading
    observeLazyImages() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => {
            // Add placeholder while loading
            this.addImagePlaceholder(img);
            this.lazyLoadObserver.observe(img);
        });
    }

    // Add placeholder for images while loading
    addImagePlaceholder(img) {
        if (!img.style.backgroundColor) {
            img.style.backgroundColor = '#f0f0f0';
            img.style.minHeight = '200px';
            img.style.display = 'block';
        }
    }

    // Load image with optimization
    async loadImage(img) {
        const originalSrc = img.src || img.dataset.src;
        if (!originalSrc) return;

        try {
            // Show loading state
            img.classList.add('loading');
            
            // Get optimized image source
            const optimizedSrc = await this.getOptimizedImageSrc(originalSrc);
            
            // Create new image to preload
            const newImg = new Image();
            
            // Set up load handlers
            newImg.onload = () => {
                img.src = optimizedSrc;
                img.classList.remove('loading');
                img.classList.add('loaded');
                
                // Remove placeholder styles
                img.style.backgroundColor = '';
                img.style.minHeight = '';
                
                // Track successful load
                this.trackImageLoad(originalSrc, optimizedSrc, true);
            };
            
            newImg.onerror = () => {
                // Fallback to original image
                img.src = originalSrc;
                img.classList.remove('loading');
                img.classList.add('error');
                
                // Track failed load
                this.trackImageLoad(originalSrc, optimizedSrc, false);
            };
            
            // Start loading
            newImg.src = optimizedSrc;
            
        } catch (error) {
            console.error('Error loading image:', error);
            img.src = originalSrc;
            img.classList.remove('loading');
            img.classList.add('error');
        }
    }

    // Get optimized image source (WebP with fallback)
    async getOptimizedImageSrc(originalSrc) {
        // Check cache first
        if (this.imageCache.has(originalSrc)) {
            return this.imageCache.get(originalSrc);
        }

        // Check if WebP is supported
        const webpSupported = await this.webpSupported;
        
        if (webpSupported) {
            // Try to get WebP version
            const webpSrc = this.getWebPPath(originalSrc);
            
            // Check if WebP version exists
            const webpExists = await this.checkImageExists(webpSrc);
            
            if (webpExists) {
                this.imageCache.set(originalSrc, webpSrc);
                return webpSrc;
            }
        }
        
        // Fallback to original
        this.imageCache.set(originalSrc, originalSrc);
        return originalSrc;
    }

    // Convert image path to WebP version
    getWebPPath(originalPath) {
        const pathParts = originalPath.split('.');
        const extension = pathParts.pop();
        const basePath = pathParts.join('.');
        return `${basePath}.webp`;
    }

    // Check if image exists
    checkImageExists(src) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = src;
        });
    }

    // Optimize existing images on page
    optimizeExistingImages() {
        const allImages = document.querySelectorAll('img');
        
        allImages.forEach(img => {
            // Add responsive image attributes if not present
            this.addResponsiveAttributes(img);
            
            // Add error handling
            this.setupImageErrorHandling(img);
            
            // Optimize loading for above-the-fold images
            if (img.loading !== 'lazy') {
                this.optimizeEagerImage(img);
            }
        });
    }

    // Add responsive image attributes
    addResponsiveAttributes(img) {
        const src = img.src || img.dataset.src;
        if (!src) return;

        // Generate srcset for different screen sizes
        const srcset = this.generateSrcSet(src);
        if (srcset) {
            img.srcset = srcset;
        }

        // Add sizes attribute if not present
        if (!img.sizes) {
            img.sizes = this.generateSizesAttribute(img);
        }
    }

    // Generate srcset for responsive images
    generateSrcSet(src) {
        const basePath = src.replace(/\.[^/.]+$/, '');
        const extension = src.split('.').pop();
        
        // Define different sizes
        const sizes = [400, 800, 1200, 1600];
        const srcsetEntries = [];
        
        sizes.forEach(size => {
            // For now, we'll use the original image
            // In a real implementation, you'd have different sized versions
            srcsetEntries.push(`${src} ${size}w`);
        });
        
        return srcsetEntries.join(', ');
    }

    // Generate sizes attribute based on image context
    generateSizesAttribute(img) {
        // Check if image is in hero section
        if (img.closest('.hero-section')) {
            return '(max-width: 768px) 300px, (max-width: 1200px) 400px, 500px';
        }
        
        // Check if image is in project section
        if (img.closest('.project-card')) {
            return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px';
        }
        
        // Default sizes
        return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
    }

    // Optimize eager-loading images
    async optimizeEagerImage(img) {
        const originalSrc = img.src;
        if (!originalSrc) return;

        try {
            const optimizedSrc = await this.getOptimizedImageSrc(originalSrc);
            if (optimizedSrc !== originalSrc) {
                img.src = optimizedSrc;
            }
        } catch (error) {
            console.error('Error optimizing eager image:', error);
        }
    }

    // Setup error handling for images
    setupImageErrorHandling(img = null) {
        const images = img ? [img] : document.querySelectorAll('img');
        
        images.forEach(image => {
            if (image.dataset.errorHandled) return;
            
            image.addEventListener('error', (e) => {
                this.handleImageError(e.target);
            });
            
            image.dataset.errorHandled = 'true';
        });
    }

    // Handle image loading errors
    handleImageError(img) {
        console.warn('Image failed to load:', img.src);
        
        // Try fallback to JPEG if WebP failed
        if (img.src.includes('.webp')) {
            const jpegSrc = img.src.replace('.webp', '.jpg');
            img.src = jpegSrc;
            return;
        }
        
        // Use placeholder image
        const placeholder = this.getPlaceholderImage(img);
        img.src = placeholder;
        img.alt = 'Image not available';
        img.classList.add('image-error');
        
        // Track error
        this.trackImageLoad(img.src, placeholder, false);
    }

    // Get placeholder image based on context
    getPlaceholderImage(img) {
        // Check if it's a headshot
        if (img.classList.contains('hero-image') || img.alt.toLowerCase().includes('headshot')) {
            return 'assets/images/placeholders/headshot-placeholder.svg';
        }
        
        // Check if it's a project screenshot
        if (img.closest('.project-card')) {
            return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBBdmFpbGFibGU8L3RleHQ+PC9zdmc+';
        }
        
        // Default placeholder
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBBdmFpbGFibGU8L3RleHQ+PC9zdmc+';
    }

    // Track image loading events
    trackImageLoad(originalSrc, optimizedSrc, success) {
        if (typeof PortfolioUtils !== 'undefined') {
            PortfolioUtils.trackEvent('image_load', {
                originalSrc,
                optimizedSrc,
                success,
                webpUsed: optimizedSrc.includes('.webp'),
                timestamp: new Date().toISOString()
            });
        }
    }

    // Create WebP versions of existing images (utility method)
    static async createWebPVersions() {
        console.log('WebP conversion should be done during build process or manually');
        console.log('Current images that should have WebP versions:');
        
        const images = document.querySelectorAll('img[src*=".jpg"], img[src*=".jpeg"], img[src*=".png"]');
        images.forEach(img => {
            const webpPath = img.src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
            console.log(`${img.src} -> ${webpPath}`);
        });
    }

    // Preload critical images
    preloadCriticalImages() {
        const criticalImages = [
            'assets/images/headshot.webp',
            'assets/images/headshot.jpg'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    // Get image loading statistics
    getLoadingStats() {
        const stats = {
            totalImages: document.querySelectorAll('img').length,
            loadedImages: document.querySelectorAll('img.loaded').length,
            errorImages: document.querySelectorAll('img.image-error').length,
            webpSupported: this.webpSupported
        };
        
        console.log('Image Loading Statistics:', stats);
        return stats;
    }
}

// Initialize image optimizer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.imageOptimizer = new ImageOptimizer();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImageOptimizer;
}