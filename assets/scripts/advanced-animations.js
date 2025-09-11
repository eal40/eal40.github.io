// Advanced Animations Module

// This module handles advanced animations for the portfolio
// It's loaded dynamically as a non-critical resource

var AdvancedAnimations = function() {
    this.initialized = false;
    this.animationElements = [];
    this.init();
};

AdvancedAnimations.prototype.init = function() {
    console.log('Advanced animations initialized');
    this.detectAnimationSupport();
    this.setupAnimationElements();
    this.setupIntersectionObserver();
    this.initialized = true;
};

AdvancedAnimations.prototype.detectAnimationSupport = function() {
    // Check if the browser supports advanced animations
    var supportsWebAnimations = 'animate' in Element.prototype;
    var supportsWaapi = typeof window.Animation === 'function';
    
    if (!supportsWebAnimations || !supportsWaapi) {
        console.log('Browser has limited animation support - using fallbacks');
        this.useFallbackAnimations = true;
    } else {
        console.log('Browser supports advanced animations');
        this.useFallbackAnimations = false;
    }
};

AdvancedAnimations.prototype.setupAnimationElements = function() {
    // Find all elements with animation data attributes
    this.animationElements = document.querySelectorAll('[data-animation]');
    console.log('Found ' + this.animationElements.length + ' elements to animate');
};

AdvancedAnimations.prototype.setupIntersectionObserver = function() {
    // Create an intersection observer to trigger animations when elements come into view
    var options = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // trigger when 10% of the element is visible
    };

    var self = this;
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                self.animateElement(entry.target);
                observer.unobserve(entry.target); // animate only once
            }
        });
    }, options);

    // Observe all animation elements
    this.animationElements.forEach(function(element) {
        observer.observe(element);
    });
};

AdvancedAnimations.prototype.animateElement = function(element) {
    var animationType = element.dataset.animation;
    var duration = parseInt(element.dataset.duration || '1000');
    var delay = parseInt(element.dataset.delay || '0');
    
    var animation;
    
    switch(animationType) {
        case 'fade-in':
            animation = this.createFadeInAnimation(duration);
            break;
        case 'slide-up':
            animation = this.createSlideUpAnimation(duration);
            break;
        case 'scale-in':
            animation = this.createScaleInAnimation(duration);
            break;
        default:
            console.warn('Unknown animation type: ' + animationType);
            return;
    }
    
    // Apply animation with delay
    var self = this;
    setTimeout(function() {
        if (self.useFallbackAnimations) {
            self.applyFallbackAnimation(element, animationType);
        } else {
            element.animate(animation.keyframes, animation.options);
        }
    }, delay);
};

AdvancedAnimations.prototype.createFadeInAnimation = function(duration) {
    return {
        keyframes: [
            { opacity: 0 },
            { opacity: 1 }
        ],
        options: {
            duration: duration,
            easing: 'ease-in-out',
            fill: 'forwards'
        }
    };
};

AdvancedAnimations.prototype.createSlideUpAnimation = function(duration) {
    return {
        keyframes: [
            { transform: 'translateY(50px)', opacity: 0 },
            { transform: 'translateY(0)', opacity: 1 }
        ],
        options: {
            duration: duration,
            easing: 'ease-out',
            fill: 'forwards'
        }
    };
};

AdvancedAnimations.prototype.createScaleInAnimation = function(duration) {
    return {
        keyframes: [
            { transform: 'scale(0.8)', opacity: 0 },
            { transform: 'scale(1)', opacity: 1 }
        ],
        options: {
            duration: duration,
            easing: 'ease-in-out',
            fill: 'forwards'
        }
    };
};

AdvancedAnimations.prototype.applyFallbackAnimation = function(element, animationType) {
    // Simple CSS class-based fallback for browsers without Web Animations API
    element.classList.add('animated', animationType);
};

// Initialize the module
var advancedAnimations = new AdvancedAnimations();