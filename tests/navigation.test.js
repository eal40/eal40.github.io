// Unit tests for navigation functionality
describe('Navigation System', () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = `
      <nav class="main-navigation">
        <a href="#about" class="nav-link">About</a>
        <a href="#projects" class="nav-link">Projects</a>
        <a href="#contact" class="nav-link">Contact</a>
      </nav>
      <section id="about">About content</section>
      <section id="projects">Projects content</section>
      <section id="contact">Contact content</section>
    `;
  });

  test('should have navigation links', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    expect(navLinks.length).toBe(3);
    
    expect(navLinks[0].getAttribute('href')).toBe('#about');
    expect(navLinks[1].getAttribute('href')).toBe('#projects');
    expect(navLinks[2].getAttribute('href')).toBe('#contact');
  });

  test('should find target sections for navigation links', () => {
    const aboutSection = document.getElementById('about');
    const projectsSection = document.getElementById('projects');
    const contactSection = document.getElementById('contact');
    
    expect(aboutSection).toBeTruthy();
    expect(projectsSection).toBeTruthy();
    expect(contactSection).toBeTruthy();
  });

  test('should handle navigation link clicks', () => {
    const aboutLink = document.querySelector('a[href="#about"]');
    const clickEvent = createMockEvent('click');
    
    // Mock preventDefault
    clickEvent.preventDefault = jest.fn();
    
    aboutLink.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = e.target.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      expect(targetElement).toBeTruthy();
      expect(targetId).toBe('about');
    });
    
    aboutLink.dispatchEvent(clickEvent);
    expect(clickEvent.preventDefault).toHaveBeenCalled();
  });
});