# Design Document

## Overview

The undergraduate portfolio website will be built as a modern, single-page application (SPA) with smooth scrolling navigation between sections. The design emphasizes clean aesthetics, professional presentation, and optimal user experience across all devices. The architecture follows a component-based approach with semantic HTML5, modern CSS (Grid/Flexbox), and progressive enhancement principles.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────┐
│              Frontend Layer             │
├─────────────────────────────────────────┤
│  • HTML5 Semantic Structure            │
│  • CSS Grid/Flexbox Layout             │
│  • Vanilla JavaScript (ES6+)           │
│  • Progressive Web App Features        │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│             Content Layer               │
├─────────────────────────────────────────┤
│  • Static Content Files                │
│  • Image Assets (WebP/AVIF)            │
│  • Resume PDF                          │
│  • Project Screenshots                 │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│            Hosting Layer                │
├─────────────────────────────────────────┤
│  • Static Site Hosting                 │
│  • CDN for Asset Delivery              │
│  • HTTPS Certificate                   │
│  • Custom Domain                       │
└─────────────────────────────────────────┘
```

### Technology Stack

- **Frontend Framework**: Vanilla HTML5, CSS3, JavaScript ES6+
- **CSS Framework**: Custom CSS with CSS Grid and Flexbox
- **Build Tools**: GitHub Actions for automated deployment
- **Image Optimization**: Manual optimization or GitHub Actions workflow
- **Hosting**: GitHub Pages with custom domain support
- **Analytics**: Google Analytics 4 or Plausible
- **Performance**: Lighthouse optimization target 90+ scores

## Components and Interfaces

### Core Components

#### 1. Navigation Component
```html
<nav class="main-navigation" role="navigation">
  <div class="nav-container">
    <div class="nav-brand">
      <a href="#home" class="brand-link">Student Name</a>
    </div>
    <ul class="nav-menu">
      <li><a href="#about">About</a></li>
      <li><a href="#projects">Projects</a></li>
      <li><a href="#skills">Skills</a></li>
      <li><a href="#certifications">Certifications</a></li>
      <li><a href="#education">Education</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
    <button class="mobile-menu-toggle" aria-label="Toggle mobile menu">
      <span></span>
      <span></span>
      <span></span>
    </button>
  </div>
</nav>
```

**Features:**
- Sticky positioning with background blur on scroll
- Smooth scroll navigation with active section highlighting
- Mobile hamburger menu with slide-out animation
- Accessibility-compliant keyboard navigation

#### 2. Hero Section Component
```html
<section id="home" class="hero-section">
  <div class="hero-container">
    <div class="hero-content">
      <img src="headshot.webp" alt="Professional headshot" class="hero-image">
      <div class="hero-text">
        <h1 class="hero-name">Student Full Name</h1>
        <p class="hero-title">Computer Science Student | University Name</p>
        <p class="hero-graduation">Expected Graduation: May 2025</p>
        <p class="hero-tagline">Passionate about software development and innovative problem-solving</p>
        <div class="hero-actions">
          <a href="#contact" class="btn btn-primary">Get In Touch</a>
          <a href="resume.pdf" class="btn btn-secondary" download>Download Resume</a>
        </div>
      </div>
    </div>
  </div>
</section>
```

#### 3. Project Card Component
```html
<!-- Website Project Card with Embedded Demo -->
<article class="project-card website-project">
  <div class="project-header">
    <div class="project-type-badge">Website</div>
    <h3 class="project-title">Project Name</h3>
    <p class="project-description">Brief project description...</p>
    <div class="project-tech">
      <span class="tech-tag">React</span>
      <span class="tech-tag">Node.js</span>
      <span class="tech-tag">MongoDB</span>
    </div>
  </div>
  
  <div class="project-demo-container">
    <div class="demo-controls">
      <button class="demo-toggle" data-project="project1">Try Live Demo</button>
      <a href="#" class="project-link" target="_blank" rel="noopener">
        <i class="fab fa-github"></i> View Code
      </a>
    </div>
    
    <div class="embedded-demo" id="demo-project1" style="display: none;">
      <div class="demo-header">
        <span class="demo-url">https://your-project.com</span>
        <button class="demo-close" data-project="project1">×</button>
      </div>
      <iframe 
        src="https://your-project.com" 
        title="Live demo of Project Name"
        class="demo-iframe"
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups">
      </iframe>
    </div>
  </div>
  
  <div class="project-details">
    <p><strong>Role:</strong> Full-stack Developer</p>
    <p><strong>Challenge:</strong> Key challenge overcome</p>
    <p><strong>Learning:</strong> Key learning outcome</p>
  </div>
</article>

<!-- Desktop Application Project Card with Installer Download -->
<article class="project-card desktop-project">
  <div class="project-header">
    <div class="project-type-badge">Desktop App</div>
    <h3 class="project-title">Desktop Application Name</h3>
    <p class="project-description">Brief application description...</p>
    <div class="project-tech">
      <span class="tech-tag">Python</span>
      <span class="tech-tag">Tkinter</span>
      <span class="tech-tag">SQLite</span>
    </div>
  </div>
  
  <div class="project-image">
    <img src="desktop-app-screenshot.webp" alt="Desktop application screenshot" loading="lazy">
  </div>
  
  <div class="download-section">
    <h4>Download Installer</h4>
    <div class="download-buttons">
      <a href="assets/installers/app-windows.exe" 
         class="download-btn windows" 
         download="MyApp-Setup.exe">
        <i class="fab fa-windows"></i>
        Windows (.exe)
        <span class="file-size">12.5 MB</span>
      </a>
      <a href="assets/installers/app-mac.dmg" 
         class="download-btn mac" 
         download="MyApp-Setup.dmg">
        <i class="fab fa-apple"></i>
        macOS (.dmg)
        <span class="file-size">15.2 MB</span>
      </a>
      <a href="assets/installers/app-linux.deb" 
         class="download-btn linux" 
         download="MyApp-Setup.deb">
        <i class="fab fa-linux"></i>
        Linux (.deb)
        <span class="file-size">11.8 MB</span>
      </a>
    </div>
    <div class="download-info">
      <p><strong>System Requirements:</strong> Windows 10+, macOS 10.14+, Ubuntu 18.04+</p>
      <a href="#" class="project-link" target="_blank" rel="noopener">
        <i class="fab fa-github"></i> View Source Code
      </a>
    </div>
  </div>
  
  <div class="project-details">
    <p><strong>Platform:</strong> Cross-platform (Windows/Mac/Linux)</p>
    <p><strong>Challenge:</strong> Key challenge overcome</p>
    <p><strong>Learning:</strong> Key learning outcome</p>
  </div>
  
  <div class="install-instructions">
    <details>
      <summary><strong>Installation Instructions</strong></summary>
      <div class="install-steps">
        <h5>Windows:</h5>
        <ol>
          <li>Download the .exe installer</li>
          <li>Run as administrator if prompted</li>
          <li>Follow the installation wizard</li>
        </ol>
        <h5>macOS:</h5>
        <ol>
          <li>Download the .dmg file</li>
          <li>Open and drag to Applications folder</li>
          <li>Allow in Security & Privacy if needed</li>
        </ol>
        <h5>Linux:</h5>
        <ol>
          <li>Download the .deb package</li>
          <li>Run: <code>sudo dpkg -i MyApp-Setup.deb</code></li>
          <li>Or double-click to install via package manager</li>
        </ol>
      </div>
    </details>
  </div>
</article>
```

#### 4. Skills Visualization Component
```html
<div class="skills-category">
  <h3 class="skills-category-title">Programming Languages</h3>
  <div class="skills-grid">
    <div class="skill-item">
      <div class="skill-icon">
        <img src="javascript-icon.svg" alt="JavaScript">
      </div>
      <div class="skill-info">
        <span class="skill-name">JavaScript</span>
        <div class="skill-level">
          <div class="skill-bar">
            <div class="skill-progress" data-level="85"></div>
          </div>
          <span class="skill-percentage">Advanced</span>
        </div>
      </div>
    </div>
  </div>
</div>
```

#### 5. Certification Card Component
```html
<div class="certification-card">
  <div class="cert-badge">
    <img src="aws-badge.png" alt="AWS Certification Badge">
  </div>
  <div class="cert-content">
    <h3 class="cert-name">AWS Certified Cloud Practitioner</h3>
    <p class="cert-issuer">Amazon Web Services</p>
    <div class="cert-dates">
      <span class="cert-issued">Issued: March 2024</span>
      <span class="cert-expires">Expires: March 2027</span>
    </div>
    <p class="cert-description">Foundational understanding of AWS cloud services and architecture</p>
    <a href="#" class="cert-verify" target="_blank" rel="noopener">Verify Credential</a>
  </div>
  <div class="cert-status active">Active</div>
</div>
```

### Layout System

#### CSS Grid Structure
```css
.main-container {
  display: grid;
  grid-template-areas: 
    "header"
    "hero"
    "about"
    "projects"
    "skills"
    "certifications"
    "education"
    "contact"
    "footer";
  grid-template-rows: auto 100vh repeat(6, auto) auto;
}

@media (min-width: 1200px) {
  .section-container {
    display: grid;
    grid-template-columns: 1fr min(1200px, 90%) 1fr;
    grid-template-areas: ". content .";
  }
  
  .section-content {
    grid-area: content;
  }
}
```

## Data Models

### Student Profile Model
```javascript
const studentProfile = {
  personal: {
    fullName: "string",
    email: "string",
    phone: "string",
    location: "string",
    linkedIn: "string",
    github: "string",
    website: "string"
  },
  academic: {
    university: "string",
    degree: "string",
    major: "string",
    minor: "string",
    graduationDate: "Date",
    gpa: "number",
    honors: ["string"]
  },
  professional: {
    tagline: "string",
    summary: "string",
    careerGoals: "string",
    workExperience: [{
      title: "string",
      company: "string",
      duration: "string",
      description: "string"
    }]
  }
};
```

### Project Model
```javascript
const project = {
  id: "string",
  title: "string",
  subtitle: "string",
  description: "string",
  technologies: ["string"],
  role: "string",
  challenges: "string",
  learnings: "string",
  images: [{
    src: "string",
    alt: "string",
    caption: "string"
  }],
  type: "string", // "website" or "desktop"
  links: {
    demo: "string", // embedded iframe URL for websites
    github: "string",
    documentation: "string"
  },
  // For desktop applications
  installers: [{
    platform: "string", // "windows", "mac", "linux"
    filename: "string",
    downloadUrl: "string",
    fileSize: "string",
    icon: "string" // platform icon class
  }],
  systemRequirements: "string",
  installInstructions: {
    windows: ["string"],
    mac: ["string"],
    linux: ["string"]
  },
  completionDate: "Date"
};

// Example project data structure
const projectsData = [
  {
    id: "website-1",
    title: "E-Commerce Platform",
    description: "Full-stack e-commerce solution with React and Node.js",
    technologies: ["React", "Node.js", "MongoDB", "Stripe"],
    type: "website",
    links: {
      demo: "https://my-ecommerce-demo.netlify.app",
      github: "https://github.com/username/ecommerce-platform"
    },
    role: "Full-stack Developer",
    challenges: "Implementing secure payment processing and inventory management",
    learnings: "Advanced React patterns and payment gateway integration"
  },
  {
    id: "desktop-1",
    title: "Task Management Desktop App",
    description: "Cross-platform productivity application built with Python",
    technologies: ["Python", "Tkinter", "SQLite", "PyInstaller"],
    type: "desktop",
    links: {
      github: "https://github.com/username/task-manager-app"
    },
    installers: [
      {
        platform: "windows",
        filename: "TaskManager-Setup.exe",
        downloadUrl: "assets/installers/TaskManager-Setup.exe",
        fileSize: "12.5 MB",
        icon: "fab fa-windows"
      },
      {
        platform: "mac",
        filename: "TaskManager-Setup.dmg",
        downloadUrl: "assets/installers/TaskManager-Setup.dmg",
        fileSize: "15.2 MB",
        icon: "fab fa-apple"
      },
      {
        platform: "linux",
        filename: "TaskManager-Setup.deb",
        downloadUrl: "assets/installers/TaskManager-Setup.deb",
        fileSize: "11.8 MB",
        icon: "fab fa-linux"
      }
    ],
    systemRequirements: "Windows 10+, macOS 10.14+, Ubuntu 18.04+",
    installInstructions: {
      windows: [
        "Download the .exe installer",
        "Run as administrator if prompted",
        "Follow the installation wizard"
      ],
      mac: [
        "Download the .dmg file",
        "Open and drag to Applications folder",
        "Allow in Security & Privacy if needed"
      ],
      linux: [
        "Download the .deb package",
        "Run: sudo dpkg -i TaskManager-Setup.deb",
        "Or double-click to install via package manager"
      ]
    },
    role: "Solo Developer",
    challenges: "Creating cross-platform compatibility and packaging for distribution",
    learnings: "Desktop application architecture and deployment strategies"
  }
];
```

### Skill Model
```javascript
const skill = {
  name: "string",
  category: "string", // "programming", "frameworks", "tools", "soft"
  proficiency: "string", // "beginner", "intermediate", "advanced", "expert"
  proficiencyLevel: "number", // 1-100
  icon: "string",
  yearsExperience: "number",
  projects: ["string"] // project IDs where skill was used
};
```

### Certification Model
```javascript
const certification = {
  id: "string",
  name: "string",
  issuer: "string",
  issueDate: "Date",
  expirationDate: "Date",
  credentialId: "string",
  verificationUrl: "string",
  badgeImage: "string",
  description: "string",
  skills: ["string"],
  status: "string" // "active", "expired", "in-progress"
};

// Easy-to-update certifications data structure
const certificationsData = [
  {
    id: "cert-1",
    name: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    issueDate: "2024-03-15",
    expirationDate: "2027-03-15",
    credentialId: "ABC123XYZ",
    verificationUrl: "https://aws.amazon.com/verification/ABC123XYZ",
    badgeImage: "assets/badges/aws-cloud-practitioner.png",
    description: "Foundational understanding of AWS cloud services and architecture",
    skills: ["Cloud Computing", "AWS Services", "Security"],
    status: "active"
  }
  // Additional certificates can be easily added here
];
```

## Error Handling

### Client-Side Error Handling

#### Image Loading Errors
```javascript
class ImageErrorHandler {
  static handleImageError(img) {
    img.onerror = () => {
      img.src = '/assets/images/placeholder.svg';
      img.alt = 'Image not available';
    };
  }
  
  static lazyLoadImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          this.handleImageError(img);
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  }
}
```

#### Form Validation
```javascript
class FormValidator {
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  static validateContactForm(formData) {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!this.validateEmail(formData.email)) {
      errors.email = 'Valid email is required';
    }
    
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}
```

#### Navigation Error Handling
```javascript
class NavigationHandler {
  static smoothScrollTo(targetId) {
    try {
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      } else {
        console.warn(`Target element ${targetId} not found`);
      }
    } catch (error) {
      console.error('Smooth scroll error:', error);
      // Fallback to regular scroll
      window.location.hash = targetId;
    }
  }
}
```

#### Project Demo Handler
```javascript
class ProjectDemoHandler {
  static initializeDemos() {
    // Initialize demo toggle buttons
    document.querySelectorAll('.demo-toggle').forEach(button => {
      button.addEventListener('click', this.toggleDemo.bind(this));
    });
    
    // Initialize demo close buttons
    document.querySelectorAll('.demo-close').forEach(button => {
      button.addEventListener('click', this.closeDemo.bind(this));
    });
    
    // Initialize download tracking
    document.querySelectorAll('.download-btn').forEach(button => {
      button.addEventListener('click', this.trackDownload.bind(this));
    });
  }
  
  static toggleDemo(event) {
    const projectId = event.target.dataset.project;
    const demoContainer = document.getElementById(`demo-${projectId}`);
    const toggleButton = event.target;
    
    if (demoContainer.style.display === 'none' || !demoContainer.style.display) {
      // Show demo
      demoContainer.style.display = 'block';
      toggleButton.textContent = 'Hide Demo';
      toggleButton.classList.add('active');
      
      // Track demo view
      this.trackEvent('demo_opened', projectId);
      
      // Lazy load iframe if not already loaded
      const iframe = demoContainer.querySelector('iframe');
      if (!iframe.src) {
        iframe.src = iframe.dataset.src;
      }
    } else {
      // Hide demo
      this.closeDemo(event);
    }
  }
  
  static closeDemo(event) {
    const projectId = event.target.dataset.project;
    const demoContainer = document.getElementById(`demo-${projectId}`);
    const toggleButton = document.querySelector(`[data-project="${projectId}"].demo-toggle`);
    
    demoContainer.style.display = 'none';
    toggleButton.textContent = 'Try Live Demo';
    toggleButton.classList.remove('active');
    
    // Track demo close
    this.trackEvent('demo_closed', projectId);
  }
  
  static trackDownload(event) {
    const downloadUrl = event.target.href;
    const filename = event.target.download;
    const platform = event.target.classList.contains('windows') ? 'windows' : 
                    event.target.classList.contains('mac') ? 'mac' : 'linux';
    
    // Track download event
    this.trackEvent('installer_download', {
      filename: filename,
      platform: platform,
      url: downloadUrl
    });
    
    // Show download confirmation
    this.showDownloadConfirmation(filename);
  }
  
  static showDownloadConfirmation(filename) {
    const notification = document.createElement('div');
    notification.className = 'download-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-download"></i>
        <span>Downloading ${filename}...</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
  
  static trackEvent(eventName, eventData) {
    // Google Analytics 4 event tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        custom_parameter: eventData
      });
    }
    
    // Console log for development
    console.log(`Event: ${eventName}`, eventData);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  ProjectDemoHandler.initializeDemos();
});
```

### Performance Error Handling

#### Resource Loading Timeout
```javascript
class ResourceLoader {
  static loadWithTimeout(url, timeout = 5000) {
    return Promise.race([
      fetch(url),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), timeout)
      )
    ]);
  }
}
```

## Testing Strategy

### Unit Testing
- **Framework**: Jest for JavaScript functionality
- **Coverage Target**: 80%+ code coverage
- **Test Files**: `*.test.js` alongside component files

#### Example Test Structure
```javascript
// navigation.test.js
describe('Navigation Component', () => {
  test('should highlight active section on scroll', () => {
    // Test implementation
  });
  
  test('should toggle mobile menu on button click', () => {
    // Test implementation
  });
  
  test('should smooth scroll to target section', () => {
    // Test implementation
  });
});
```

### Integration Testing
- **Framework**: Cypress for end-to-end testing
- **Test Scenarios**:
  - Complete user journey through all sections
  - Form submission and validation
  - Mobile responsive behavior
  - Cross-browser compatibility

#### Example E2E Test
```javascript
// portfolio.cy.js
describe('Portfolio Website', () => {
  it('should navigate through all sections', () => {
    cy.visit('/');
    cy.get('[data-testid="nav-about"]').click();
    cy.url().should('include', '#about');
    cy.get('#about').should('be.visible');
  });
  
  it('should download resume when clicked', () => {
    cy.get('[data-testid="resume-download"]').click();
    cy.readFile('cypress/downloads/resume.pdf').should('exist');
  });
});
```

### Performance Testing
- **Tools**: Lighthouse CI, WebPageTest
- **Metrics**:
  - First Contentful Paint < 1.5s
  - Largest Contentful Paint < 2.5s
  - Cumulative Layout Shift < 0.1
  - First Input Delay < 100ms

### Accessibility Testing
- **Tools**: axe-core, WAVE, Lighthouse accessibility audit
- **Manual Testing**: Keyboard navigation, screen reader testing
- **Compliance**: WCAG 2.1 AA standards

### Visual Regression Testing
- **Tool**: Percy or Chromatic
- **Test Coverage**: All major breakpoints and component states
- **Automated**: Run on every pull request

## Performance Optimization

### Image Optimization
- **Formats**: WebP with JPEG fallback, AVIF for modern browsers
- **Lazy Loading**: Intersection Observer API for below-fold images
- **Responsive Images**: Multiple sizes with `srcset` attribute
- **Compression**: 80% quality for photos, lossless for graphics

### Code Splitting
- **Critical CSS**: Inline above-the-fold styles
- **Deferred Loading**: Non-critical JavaScript loaded after page load
- **Module Bundling**: Tree-shaking to eliminate unused code

### Caching Strategy
- **Static Assets**: Long-term caching with content hashing
- **HTML**: Short-term caching with ETags
- **Service Worker**: Cache-first strategy for static resources

This design provides a comprehensive foundation for building a professional, performant, and accessible undergraduate portfolio website that meets all the specified requirements while following modern web development best practices.