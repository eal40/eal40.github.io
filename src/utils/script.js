// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

function updateThemeIcon() {
  const icon = themeToggle.querySelector('i');
  if (body.dataset.theme === 'dark') {
    icon.className = 'fas fa-sun';
  } else {
    icon.className = 'fas fa-moon';
  }
}

themeToggle.addEventListener('click', () => {
  body.dataset.theme = body.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', body.dataset.theme);
  updateThemeIcon();
});

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  body.dataset.theme = savedTheme;
}
updateThemeIcon();

// Mobile menu toggle functionality
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const nav = document.querySelector('nav');

function updateMobileMenuIcon() {
  const icon = mobileMenuToggle.querySelector('i');
  if (nav.classList.contains('mobile-menu-open')) {
    icon.className = 'fas fa-times';
  } else {
    icon.className = 'fas fa-bars';
  }
}

if (mobileMenuToggle && nav) {
  mobileMenuToggle.addEventListener('click', () => {
    nav.classList.toggle('mobile-menu-open');
    updateMobileMenuIcon();
  });

  // Close mobile menu when a nav link is clicked
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('mobile-menu-open');
      updateMobileMenuIcon();
    });
  });
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Sticky navigation
const header = document.getElementById('header');
const heroSection = document.getElementById('hero');

window.addEventListener('scroll', () => {
  const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
  if (window.scrollY > heroBottom - 100) {
    header.classList.add('sticky');
  } else {
    header.classList.remove('sticky');
  }
});

// Animate progress bars on scroll
const animateProgressBars = () => {
  const progressBars = document.querySelectorAll('.progress');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressBar = entry.target;
        const width = progressBar.style.width;
        progressBar.style.width = '0%';
        setTimeout(() => {
          progressBar.style.width = width;
        }, 100);
        observer.unobserve(progressBar);
      }
    });
  }, { threshold: 0.5 });

  progressBars.forEach(bar => observer.observe(bar));
};

// Typing effect for hero tagline
const typeWriter = (element, text, speed = 100) => {
  let i = 0;
  element.textContent = '';
  const timer = setInterval(() => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(timer);
    }
  }, speed);
};

// Initialize typing effect
const taglineElement = document.querySelector('.tagline');
if (taglineElement) {
  const originalText = taglineElement.textContent;
  typeWriter(taglineElement, originalText, 50);
}

// EmailJS initialization
(function() {
  emailjs.init('VfAkGExEauDpOmXfO');
})();

// Contact form with EmailJS
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();

    // Basic validation
    if (!name || !email || !message) {
      showModal('error', 'Validation Error', 'Please fill in all fields.');
      return;
    }

    if (!isValidEmail(email)) {
      showModal('error', 'Invalid Email', 'Please enter a valid email address.');
      return;
    }

    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // Send email using EmailJS
    emailjs.send('service_79n9w0r', 'template_eh4h3vk', {
      from_name: name,
      from_email: email,
      message: message,
      to_name: 'Eugene',
    })
    .then(function(response) {
      console.log('SUCCESS!', response.status, response.text);
      showModal('success', 'Message Sent!', 'Thank you for your message! I will get back to you soon.');
      contactForm.reset();
    }, function(error) {
      console.log('FAILED...', error);
      showModal('error', 'Send Failed', 'Sorry, there was an error sending your message. Please try again later.');
    })
    .finally(function() {
      // Reset button state
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    });
  });
}

// Custom Modal Functions
function showModal(type, title, message) {
  const modal = document.getElementById('contact-modal');
  const modalIcon = document.getElementById('modal-icon');
  const modalTitle = document.getElementById('modal-title');
  const modalMessage = document.getElementById('modal-message');

  // Set modal content
  modalTitle.textContent = title;
  modalMessage.textContent = message;

  // Set icon and styling based on type
  if (type === 'success') {
    modalIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
    modalIcon.className = 'modal-icon success';
  } else if (type === 'error') {
    modalIcon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
    modalIcon.className = 'modal-icon error';
  }

  // Show modal
  modal.classList.add('show');
}

// Modal close functionality
const modalCloseBtn = document.getElementById('modal-close');
const modal = document.getElementById('contact-modal');

if (modalCloseBtn && modal) {
  modalCloseBtn.addEventListener('click', () => {
    modal.classList.remove('show');
  });

  // Close modal when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('show');
    }
  });

  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
      modal.classList.remove('show');
    }
  });
}

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Fade-in animation on scroll
const fadeInElements = document.querySelectorAll('section > .container');
const fadeInObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

fadeInElements.forEach(element => {
  element.style.opacity = '0';
  element.style.transform = 'translateY(30px)';
  element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  fadeInObserver.observe(element);
});

// Skills Tab functionality
const skillsTabBtns = document.querySelectorAll('.skills-tab-btn');
const skillsTabPanes = document.querySelectorAll('.skills-tab-pane');

skillsTabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active class from all buttons and panes
    skillsTabBtns.forEach(b => b.classList.remove('active'));
    skillsTabPanes.forEach(p => p.classList.remove('active'));

    // Add active class to clicked button
    btn.classList.add('active');

    // Show corresponding tab pane
    const tab = btn.dataset.tab;
    const targetPane = document.getElementById(tab);
    if (targetPane) {
      targetPane.classList.add('active');
    }
  });

  // Keyboard navigation
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      btn.click();
    }
  });
});

// Initialize skills cards animation on tab switch
function initializeSkillsCards() {
  const skillCards = document.querySelectorAll('.skill-card');
  skillCards.forEach((card, index) => {
    // Reset animation
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';

    // Trigger animation
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 100);
  });
}

// Observe tab changes to re-trigger animations
const skillsTabObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
      const target = mutation.target;
      if (target.classList.contains('skills-tab-pane') && target.classList.contains('active')) {
        setTimeout(initializeSkillsCards, 100);
      }
    }
  });
});

skillsTabPanes.forEach(pane => {
  skillsTabObserver.observe(pane, { attributes: true });
});

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
  animateProgressBars();
  // Delay skills cards initialization to ensure DOM is fully loaded
  setTimeout(initializeSkillsCards, 100);
});

// Performance optimization: Lazy load images
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.remove('lazy');
      imageObserver.unobserve(img);
    }
  });
});

images.forEach(img => imageObserver.observe(img));

// Certificate Carousel
const carouselContainer = document.querySelector('.carousel-container');
const slides = document.querySelectorAll('.certificate-slide');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');

let currentIndex = 0;
const totalSlides = slides.length;

function updateCarousel() {
  carouselContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % totalSlides;
  updateCarousel();
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
  updateCarousel();
}

if (nextBtn && prevBtn) {
  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);
}

// Auto-slide every 5 seconds
setInterval(nextSlide, 5000);

// Keyboard navigation for carousel
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    prevSlide();
  } else if (e.key === 'ArrowRight') {
    nextSlide();
  }
});

// Accessibility: Skip to main content
const skipLink = document.createElement('a');
skipLink.href = '#main';
skipLink.textContent = 'Skip to main content';
skipLink.className = 'skip-link';
document.body.insertBefore(skipLink, document.body.firstChild);

// Add skip link styles
const style = document.createElement('style');
style.textContent = `
  .skip-link {
    position: absolute;
    top: -40px;
    left: 6px;
    background: var(--primary-color);
    color: white;
    padding: 8px;
    text-decoration: none;
    z-index: 1000;
    border-radius: 4px;
  }
  .skip-link:focus {
    top: 6px;
  }
`;
document.head.appendChild(style);